import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertInternshipApplicationSchema,
  loginSchema,
  registerSchema,
  applicationFormSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "veridantai-secret-key-2025";
const JWT_EXPIRES_IN = "7d";

// JWT Payload type
interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Auth Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Admin Middleware
function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============== AUTH ROUTES ==============
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Check if email exists
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: data.username,
        password: hashedPassword,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        role: "candidate"
      });
      
      // Generate token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register" });
      }
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(data.username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      
      // Generate token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid login data", details: error.errors });
      } else {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
      }
    }
  });
  
  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // ============== CONTACT ROUTES ==============
  
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid contact data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create contact" });
      }
    }
  });

  // Get all contacts (admin only)
  app.get("/api/contacts", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // ============== INTERNSHIP PROGRAM ROUTES ==============
  
  // Get all programs (public)
  app.get("/api/programs", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const programs = await storage.getPrograms(activeOnly);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });
  
  // Get single program (public)
  app.get("/api/programs/:id", async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });
  
  // Create program (admin only)
  app.post("/api/programs", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const program = await storage.createProgram(req.body);
      res.json({ success: true, program });
    } catch (error) {
      res.status(500).json({ error: "Failed to create program" });
    }
  });
  
  // Update program (admin only)
  app.patch("/api/programs/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const program = await storage.updateProgram(req.params.id, req.body);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json({ success: true, program });
    } catch (error) {
      res.status(500).json({ error: "Failed to update program" });
    }
  });

  // ============== APPLICATION ROUTES ==============
  
  // Submit application (public - creates candidate account if logged in)
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = applicationFormSchema.parse(req.body);
      
      // Check if program exists
      const program = await storage.getProgram(applicationData.programId);
      if (!program) {
        return res.status(400).json({ error: "Invalid program selected" });
      }
      
      // Create application
      const application = await storage.createApplication({
        programId: applicationData.programId,
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        highestQualification: applicationData.highestQualification,
        institution: applicationData.institution,
        fieldOfStudy: applicationData.fieldOfStudy || null,
        graduationYear: applicationData.graduationYear || null,
        cgpa: applicationData.cgpa || null,
        currentStatus: applicationData.currentStatus || null,
        linkedinUrl: applicationData.linkedinUrl || null,
        portfolioUrl: applicationData.portfolioUrl || null,
        githubUrl: applicationData.githubUrl || null,
        coverLetter: applicationData.coverLetter || null,
        resumeUrl: null,
        dateOfBirth: null,
        gender: null,
        address: null,
        city: null,
        state: null,
        pincode: null
      });
      
      res.json({ 
        success: true, 
        application: {
          id: application.id,
          applicationNumber: application.applicationNumber,
          status: application.status
        },
        message: `Application submitted successfully! Your application number is ${application.applicationNumber}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid application data", details: error.errors });
      } else {
        console.error("Application error:", error);
        res.status(500).json({ error: "Failed to submit application" });
      }
    }
  });
  
  // Get all applications (admin only)
  app.get("/api/applications", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.programId) filters.programId = req.query.programId as string;
      
      const applications = await storage.getApplications(filters);
      
      // Enrich with program details
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const program = await storage.getProgram(app.programId);
          return {
            ...app,
            programTitle: program?.title || "Unknown Program"
          };
        })
      );
      
      res.json(enrichedApplications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });
  
  // Get my applications (candidate)
  app.get("/api/my-applications", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user?.email) {
        return res.json([]);
      }
      
      // Find applications by email
      const allApplications = await storage.getApplications();
      const myApplications = allApplications.filter(app => app.email === user.email);
      
      // Enrich with program details
      const enrichedApplications = await Promise.all(
        myApplications.map(async (app) => {
          const program = await storage.getProgram(app.programId);
          return {
            ...app,
            programTitle: program?.title || "Unknown Program"
          };
        })
      );
      
      res.json(enrichedApplications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });
  
  // Get single application
  app.get("/api/applications/:id", authMiddleware, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // Check permissions
      const user = await storage.getUser(req.user!.userId);
      if (req.user!.role !== "admin" && application.email !== user?.email) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const program = await storage.getProgram(application.programId);
      const statusHistory = await storage.getStatusHistory(application.id);
      
      res.json({
        ...application,
        programTitle: program?.title || "Unknown Program",
        statusHistory
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });
  
  // Track application by number (public)
  app.get("/api/track/:applicationNumber", async (req, res) => {
    try {
      const application = await storage.getApplicationByNumber(req.params.applicationNumber);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const program = await storage.getProgram(application.programId);
      
      res.json({
        applicationNumber: application.applicationNumber,
        programTitle: program?.title || "Unknown Program",
        status: application.status,
        statusNotes: application.statusNotes,
        submittedAt: application.createdAt,
        interviewDate: application.interviewDate
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to track application" });
    }
  });
  
  // Update application status (admin only)
  app.patch("/api/applications/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { status, notes, interviewDate, interviewLink } = req.body;
      
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const previousStatus = application.status;
      
      const updateData: any = { status };
      if (notes) updateData.statusNotes = notes;
      if (interviewDate) updateData.interviewDate = new Date(interviewDate);
      if (interviewLink) updateData.interviewLink = interviewLink;
      
      const updated = await storage.updateApplication(req.params.id, updateData);
      
      // Add status history
      await storage.addStatusHistory(
        req.params.id,
        previousStatus,
        status,
        req.user!.userId,
        notes
      );
      
      res.json({ success: true, application: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // ============== MESSAGES / CRM ROUTES ==============
  
  // Send message (admin)
  app.post("/api/messages", authMiddleware, async (req, res) => {
    try {
      const { applicationId, recipientId, subject, content, messageType } = req.body;
      
      const message = await storage.createMessage({
        applicationId: applicationId || null,
        senderId: req.user!.userId,
        recipientId: recipientId || null,
        subject: subject || null,
        content,
        messageType: messageType || "general"
      });
      
      res.json({ success: true, message });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
  // Get messages
  app.get("/api/messages", authMiddleware, async (req, res) => {
    try {
      const { applicationId } = req.query;
      
      let messages;
      if (req.user!.role === "admin") {
        messages = await storage.getMessages(applicationId as string);
      } else {
        messages = await storage.getMessages(undefined, req.user!.userId);
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  
  // Mark message as read
  app.patch("/api/messages/:id/read", authMiddleware, async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });
  
  // Get unread count
  app.get("/api/messages/unread-count", authMiddleware, async (req, res) => {
    try {
      const count = await storage.getUnreadCount(req.user!.userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get unread count" });
    }
  });

  // ============== CERTIFICATE ROUTES ==============
  
  // Create certificate (admin only)
  app.post("/api/certificates", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const certificate = await storage.createCertificate({
        ...req.body,
        issuedBy: req.user!.userId
      });
      
      res.json({ success: true, certificate });
    } catch (error) {
      res.status(500).json({ error: "Failed to create certificate" });
    }
  });
  
  // Get certificates
  app.get("/api/certificates", authMiddleware, async (req, res) => {
    try {
      let certificates;
      if (req.user!.role === "admin") {
        certificates = await storage.getCertificates();
      } else {
        certificates = await storage.getCertificates(req.user!.userId);
      }
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });
  
  // Verify certificate (public)
  app.get("/api/verify/certificate/:token", async (req, res) => {
    try {
      const certificate = await storage.getCertificateByToken(req.params.token);
      
      // Log verification attempt
      await storage.logVerification({
        documentType: "certificate",
        documentId: certificate?.id || "unknown",
        verificationToken: req.params.token,
        verifierIp: req.ip || null,
        verifierUserAgent: req.get("User-Agent") || null,
        verificationResult: certificate ? (certificate.status === "revoked" ? "revoked" : "valid") : "invalid"
      });
      
      if (!certificate) {
        return res.json({
          valid: false,
          message: "Certificate not found or invalid verification code"
        });
      }
      
      if (certificate.status === "revoked") {
        return res.json({
          valid: false,
          message: "This certificate has been revoked",
          reason: certificate.revokedReason
        });
      }
      
      res.json({
        valid: true,
        certificate: {
          certificateNumber: certificate.certificateNumber,
          recipientName: certificate.recipientName,
          programTitle: certificate.programTitle,
          certificateType: certificate.certificateType,
          issueDate: certificate.issueDate,
          grade: certificate.grade,
          mentorName: certificate.mentorName
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // ============== OFFER LETTER ROUTES ==============
  
  // Create offer letter (admin only)
  app.post("/api/offer-letters", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const offerLetter = await storage.createOfferLetter({
        ...req.body,
        issuedBy: req.user!.userId
      });
      
      res.json({ success: true, offerLetter });
    } catch (error) {
      res.status(500).json({ error: "Failed to create offer letter" });
    }
  });
  
  // Get offer letters
  app.get("/api/offer-letters", authMiddleware, async (req, res) => {
    try {
      let offerLetters;
      if (req.user!.role === "admin") {
        offerLetters = await storage.getOfferLetters();
      } else {
        offerLetters = await storage.getOfferLetters(req.user!.userId);
      }
      res.json(offerLetters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offer letters" });
    }
  });
  
  // Accept/Reject offer letter
  app.patch("/api/offer-letters/:id/respond", authMiddleware, async (req, res) => {
    try {
      const { response } = req.body; // 'accept' | 'reject'
      
      const offerLetter = await storage.getOfferLetter(req.params.id);
      if (!offerLetter) {
        return res.status(404).json({ error: "Offer letter not found" });
      }
      
      const updateData: any = {};
      if (response === "accept") {
        updateData.status = "accepted";
        updateData.acceptedAt = new Date();
      } else if (response === "reject") {
        updateData.status = "rejected";
        updateData.rejectedAt = new Date();
      }
      
      const updated = await storage.updateOfferLetter(req.params.id, updateData);
      res.json({ success: true, offerLetter: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to respond to offer" });
    }
  });
  
  // Verify offer letter (public)
  app.get("/api/verify/offer/:token", async (req, res) => {
    try {
      const offerLetter = await storage.getOfferLetterByToken(req.params.token);
      
      // Log verification attempt
      await storage.logVerification({
        documentType: "offer_letter",
        documentId: offerLetter?.id || "unknown",
        verificationToken: req.params.token,
        verifierIp: req.ip || null,
        verifierUserAgent: req.get("User-Agent") || null,
        verificationResult: offerLetter ? "valid" : "invalid"
      });
      
      if (!offerLetter) {
        return res.json({
          valid: false,
          message: "Offer letter not found or invalid verification code"
        });
      }
      
      res.json({
        valid: true,
        offerLetter: {
          offerNumber: offerLetter.offerNumber,
          recipientName: offerLetter.recipientName,
          position: offerLetter.position,
          department: offerLetter.department,
          startDate: offerLetter.startDate,
          status: offerLetter.status
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // ============== DASHBOARD STATS (Admin) ==============
  
  app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      const programs = await storage.getPrograms();
      const certificates = await storage.getCertificates();
      
      const stats = {
        totalApplications: applications.length,
        pendingReview: applications.filter(a => a.status === "submitted" || a.status === "under_review").length,
        shortlisted: applications.filter(a => a.status === "shortlisted").length,
        selected: applications.filter(a => a.status === "selected").length,
        rejected: applications.filter(a => a.status === "rejected").length,
        activePrograms: programs.filter(p => p.isActive).length,
        certificatesIssued: certificates.filter(c => c.status === "issued").length,
        applicationsByStatus: {
          submitted: applications.filter(a => a.status === "submitted").length,
          under_review: applications.filter(a => a.status === "under_review").length,
          shortlisted: applications.filter(a => a.status === "shortlisted").length,
          interview_scheduled: applications.filter(a => a.status === "interview_scheduled").length,
          selected: applications.filter(a => a.status === "selected").length,
          rejected: applications.filter(a => a.status === "rejected").length,
          completed: applications.filter(a => a.status === "completed").length
        }
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // ============== EMAIL TEMPLATES ==============
  
  app.get("/api/email-templates", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
