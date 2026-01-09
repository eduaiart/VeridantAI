import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { dbStorage as storage } from "./dbStorage";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { generateCertificatePDF, generateOfferLetterPDF, generateEmployeeOfferLetterPDF } from "./pdfGenerator";
import { 
  sendApplicationConfirmation,
  sendStatusChangeNotification,
  sendOfferLetterNotification,
  sendCertificateNotification
} from "./emailService";
import { 
  insertContactSchema, 
  insertInternshipApplicationSchema,
  insertEmployeeSchema,
  insertEmploymentDocumentSchema,
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
        resumeUrl: applicationData.resumeUrl || null,
        collegeIdUrl: applicationData.collegeIdUrl || null,
        bonafideCertificateUrl: applicationData.bonafideCertificateUrl || null,
        governmentIdUrl: applicationData.governmentIdUrl || null,
        marksheetUrl: applicationData.marksheetUrl || null,
        panCardUrl: applicationData.panCardUrl || null,
        dateOfBirth: null,
        gender: null,
        address: applicationData.address || null,
        city: applicationData.city || null,
        state: applicationData.state || null,
        pincode: applicationData.pincode || null
      });
      
      // Send confirmation email (async, don't wait for it)
      sendApplicationConfirmation(
        applicationData.email,
        applicationData.firstName,
        applicationData.lastName,
        program.title,
        application.applicationNumber
      ).catch(err => console.error("Failed to send confirmation email:", err));
      
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
      
      // Send status change email notification (async)
      const program = await storage.getProgram(application.programId);
      sendStatusChangeNotification(
        application.email,
        application.firstName,
        application.lastName,
        program?.title || "Internship Program",
        application.applicationNumber,
        status,
        notes
      ).catch(err => console.error("Failed to send status change email:", err));
      
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
      const { applicationId } = req.body;
      
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }
      
      // Fetch application details
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // Check if application is selected or completed
      if (application.status !== "selected" && application.status !== "completed") {
        return res.status(400).json({ error: "Application must be selected or completed first" });
      }
      
      // Fetch program details for title
      const program = await storage.getProgram(application.programId);
      const programTitle = program?.title || "Internship Program";
      
      // Create certificate with application data
      const certificateType = "Completion";
      const certificate = await storage.createCertificate({
        applicationId,
        userId: application.userId || undefined,
        recipientName: `${application.firstName} ${application.lastName}`,
        programTitle,
        certificateType: "completion",
        issueDate: new Date(),
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
        grade: "Excellent",
        mentorName: "Program Coordinator",
        issuedBy: req.user!.userId
      });
      
      // Send certificate notification email (async)
      sendCertificateNotification(
        application.email,
        application.firstName,
        application.lastName,
        programTitle,
        certificate.certificateNumber,
        certificateType
      ).catch(err => console.error("Failed to send certificate email:", err));
      
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
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
      const { applicationId } = req.body;
      
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required" });
      }
      
      // Fetch application details
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // Check if application is selected
      if (application.status !== "selected" && application.status !== "completed") {
        return res.status(400).json({ error: "Application must be selected first" });
      }
      
      // Fetch program details for title
      const program = await storage.getProgram(application.programId);
      const programTitle = program?.title || "Internship Program";
      
      // Create offer letter with application data
      const startDate = new Date();
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 3 months from now
      
      const offerLetter = await storage.createOfferLetter({
        applicationId,
        userId: application.userId || undefined,
        recipientName: `${application.firstName} ${application.lastName}`,
        programTitle,
        position: `${programTitle} Intern`,
        department: "Technology",
        stipend: "As per company policy",
        startDate,
        endDate,
        reportingTo: "Program Coordinator",
        location: "Remote/Hybrid",
        termsAndConditions: "Standard internship terms apply. Details will be provided during onboarding.",
        issuedBy: req.user!.userId,
        status: "pending"
      });
      
      // Send offer letter notification email (async)
      sendOfferLetterNotification(
        application.email,
        application.firstName,
        application.lastName,
        programTitle,
        offerLetter.offerNumber,
        startDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      ).catch(err => console.error("Failed to send offer letter email:", err));
      
      res.json(offerLetter);
    } catch (error) {
      console.error("Error creating offer letter:", error);
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

  // ============== PDF DOWNLOAD ROUTES ==============

  // Download certificate PDF
  app.get("/api/certificates/:id/download", authMiddleware, async (req, res) => {
    try {
      const certificate = await storage.getCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Only allow users to download their own certificates or admins
      if (req.user!.role !== "admin" && certificate.userId !== req.user!.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const pdfBuffer = await generateCertificatePDF(certificate, baseUrl);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
      res.status(500).json({ error: "Failed to generate certificate" });
    }
  });

  // Download offer letter PDF
  app.get("/api/offer-letters/:id/download", authMiddleware, async (req, res) => {
    try {
      const offerLetter = await storage.getOfferLetter(req.params.id);
      if (!offerLetter) {
        return res.status(404).json({ error: "Offer letter not found" });
      }

      // Only allow users to download their own offer letters or admins
      if (req.user!.role !== "admin" && offerLetter.userId !== req.user!.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Fetch application details for address and institution
      const application = await storage.getApplication(offerLetter.applicationId);
      const applicationDetails = application ? {
        address: application.address || undefined,
        city: application.city || undefined,
        state: application.state || undefined,
        pincode: application.pincode || undefined,
        institution: application.institution || undefined,
        fieldOfStudy: application.fieldOfStudy || undefined,
      } : undefined;

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const pdfBuffer = await generateOfferLetterPDF(offerLetter, baseUrl, applicationDetails);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="offer-letter-${offerLetter.offerNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating offer letter PDF:", error);
      res.status(500).json({ error: "Failed to generate offer letter" });
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

  // ============== EMPLOYEE MANAGEMENT (Admin) ==============

  // Get all employees
  app.get("/api/employees", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { status, department } = req.query;
      const filters: { status?: string; department?: string } = {};
      if (status && typeof status === "string") filters.status = status;
      if (department && typeof department === "string") filters.department = department;
      
      const employees = await storage.getEmployees(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // Get single employee
  app.get("/api/employees/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  // Create employee (can also convert from intern)
  app.post("/api/employees", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      console.log("Creating employee with data:", JSON.stringify(req.body, null, 2));
      
      // Transform date strings to Date objects before validation
      const bodyWithDates = {
        ...req.body,
        joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        probationEndDate: req.body.probationEndDate ? new Date(req.body.probationEndDate) : undefined,
        confirmationDate: req.body.confirmationDate ? new Date(req.body.confirmationDate) : undefined,
        lastWorkingDate: req.body.lastWorkingDate ? new Date(req.body.lastWorkingDate) : undefined,
      };
      
      // Parse and validate
      const data = insertEmployeeSchema.parse(bodyWithDates);
      console.log("Parsed data:", JSON.stringify(data, null, 2));
      
      const employee = await storage.createEmployee({
        ...data,
        createdBy: req.user!.userId,
      });
      
      // Log creation in history
      await storage.addEmploymentHistory(
        employee.id,
        "status_change",
        null,
        "onboarding",
        req.user!.userId,
        "Employee record created"
      );
      
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ error: "Invalid employee data", details: error.errors });
      }
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Failed to create employee" });
    }
  });

  // Update employee
  app.patch("/api/employees/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const existing = await storage.getEmployee(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const updates = req.body;
      
      // Track status changes
      if (updates.status && updates.status !== existing.status) {
        await storage.addEmploymentHistory(
          req.params.id,
          "status_change",
          existing.status,
          updates.status,
          req.user!.userId,
          updates.statusReason || `Status changed from ${existing.status} to ${updates.status}`
        );
      }

      // Track designation changes
      if (updates.designation && updates.designation !== existing.designation) {
        await storage.addEmploymentHistory(
          req.params.id,
          "designation_change",
          existing.designation,
          updates.designation,
          req.user!.userId
        );
      }

      // Track department changes
      if (updates.department && updates.department !== existing.department) {
        await storage.addEmploymentHistory(
          req.params.id,
          "department_change",
          existing.department,
          updates.department,
          req.user!.userId
        );
      }

      const employee = await storage.updateEmployee(req.params.id, updates);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to update employee" });
    }
  });

  // Get employee count and stats
  app.get("/api/employees/stats/summary", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      const stats = {
        total: employees.length,
        onboarding: employees.filter(e => e.status === "onboarding").length,
        active: employees.filter(e => e.status === "active").length,
        onLeave: employees.filter(e => e.status === "on_leave").length,
        resigned: employees.filter(e => e.status === "resigned").length,
        terminated: employees.filter(e => e.status === "terminated").length,
        byDepartment: {
          Engineering: employees.filter(e => e.department === "Engineering").length,
          Finance: employees.filter(e => e.department === "Finance").length,
          HR: employees.filter(e => e.department === "HR").length,
          Marketing: employees.filter(e => e.department === "Marketing").length,
          Operations: employees.filter(e => e.department === "Operations").length,
        }
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee stats" });
    }
  });

  // Convert intern to employee
  app.post("/api/employees/convert-from-intern/:applicationId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      if (application.status !== "completed") {
        return res.status(400).json({ error: "Only completed internships can be converted to employees" });
      }

      const program = await storage.getProgram(application.programId);
      
      const employee = await storage.createEmployee({
        userId: application.userId,
        applicationId: application.id,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        address: application.address,
        city: application.city,
        state: application.state,
        pincode: application.pincode,
        designation: req.body.designation || `${program?.title || "Associate"}`,
        department: program?.department || "Engineering",
        employmentType: "intern_converted",
        joiningDate: new Date(),
        createdBy: req.user!.userId,
      });

      await storage.addEmploymentHistory(
        employee.id,
        "status_change",
        null,
        "onboarding",
        req.user!.userId,
        `Converted from internship application ${application.applicationNumber}`
      );

      res.status(201).json(employee);
    } catch (error) {
      console.error("Error converting intern:", error);
      res.status(500).json({ error: "Failed to convert intern to employee" });
    }
  });

  // ============== EMPLOYMENT DOCUMENTS ==============

  // Get employee documents
  app.get("/api/employees/:id/documents", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const documents = await storage.getEmploymentDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Add document
  app.post("/api/employees/:id/documents", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const data = insertEmploymentDocumentSchema.parse({
        ...req.body,
        employeeId: req.params.id,
      });
      const document = await storage.createEmploymentDocument(data);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid document data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add document" });
    }
  });

  // Verify document
  app.patch("/api/employees/:employeeId/documents/:docId/verify", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const document = await storage.updateEmploymentDocument(req.params.docId, {
        isVerified: true,
        verifiedBy: req.user!.userId,
        verifiedAt: new Date(),
        verificationNotes: req.body.notes,
      });
      
      if (document) {
        await storage.addEmploymentHistory(
          req.params.employeeId,
          "document_verified",
          null,
          `${document.documentType} verified`,
          req.user!.userId
        );
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify document" });
    }
  });

  // Get employee history
  app.get("/api/employees/:id/history", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const history = await storage.getEmploymentHistory(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employment history" });
    }
  });

  // Convert intern to employee
  app.post("/api/employees/convert-intern", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { applicationId, designation, department, salary, joiningDate } = req.body;
      
      if (!applicationId || !designation || !department || !joiningDate) {
        return res.status(400).json({ error: "Missing required fields: applicationId, designation, department, joiningDate" });
      }

      // Get the application
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== "completed") {
        return res.status(400).json({ error: "Only completed interns can be converted to employees" });
      }

      // Create employee from intern data (employeeId is auto-generated)
      const employee = await storage.createEmployee({
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        designation,
        department,
        salary: salary || null,
        joiningDate: new Date(joiningDate),
        employmentType: "full_time",
        createdBy: req.user!.userId,
      });

      // Log conversion in history
      await storage.addEmploymentHistory(
        employee.id,
        "status_change",
        null,
        "onboarding",
        req.user!.userId,
        `Converted from intern (Application: ${application.applicationNumber})`
      );

      res.status(201).json(employee);
    } catch (error) {
      console.error("Error converting intern to employee:", error);
      res.status(500).json({ error: "Failed to convert intern to employee" });
    }
  });

  // ============== EMPLOYEE OFFER LETTER ROUTES ==============

  // Generate employee offer letter
  app.post("/api/employee-offer-letters", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { employeeId, probationSalary, confirmedSalary, probationPeriod, noticePeriod } = req.body;
      
      console.log("Generating offer letter with:", { employeeId, probationSalary, confirmedSalary, probationPeriod, noticePeriod });
      
      if (!employeeId) {
        return res.status(400).json({ error: "Employee ID is required" });
      }

      const employee = await storage.getEmployee(employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Create offer letter record with compensation info
      const salaryInfo = probationSalary && confirmedSalary 
        ? `Probation: ₹${Number(probationSalary).toLocaleString()}/month, Confirmed: ₹${Number(confirmedSalary).toLocaleString()}/month`
        : employee.salary || null;

      const offerLetter = await storage.createEmployeeOfferLetter({
        employeeId,
        recipientName: `${employee.firstName} ${employee.lastName}`,
        position: employee.designation,
        department: employee.department,
        salary: salaryInfo,
        joiningDate: employee.joiningDate,
        probationPeriod: probationPeriod || "6 months",
        noticePeriod: noticePeriod || "30 days",
        issuedBy: req.user!.userId,
      });

      // Generate PDF
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const pdfBuffer = await generateEmployeeOfferLetterPDF({
        offerNumber: offerLetter.offerNumber,
        verificationToken: offerLetter.verificationToken,
        employee,
        probationSalary,
        confirmedSalary,
        probationPeriod: probationPeriod || "6 months",
        noticePeriod: noticePeriod || "30 days",
      }, baseUrl);

      // Log in employment history
      await storage.addEmploymentHistory(
        employeeId,
        "document_verified",
        null,
        `Offer letter ${offerLetter.offerNumber} issued`,
        req.user!.userId
      );

      res.status(201).json(offerLetter);
    } catch (error) {
      console.error("Error generating employee offer letter:", error);
      res.status(500).json({ error: "Failed to generate offer letter" });
    }
  });

  // Download employee offer letter
  app.get("/api/employee-offer-letters/:id/download", authMiddleware, async (req, res) => {
    try {
      const offerLetter = await storage.getEmployeeOfferLetter(req.params.id);
      if (!offerLetter) {
        return res.status(404).json({ error: "Offer letter not found" });
      }

      const employee = await storage.getEmployee(offerLetter.employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Parse salary info if available
      let probationSalary, confirmedSalary;
      console.log("Downloading offer letter, stored salary:", offerLetter.salary);
      if (offerLetter.salary && offerLetter.salary.includes('Probation:')) {
        const match = offerLetter.salary.match(/Probation: ₹([\d,]+)\/month, Confirmed: ₹([\d,]+)\/month/);
        console.log("Salary regex match:", match);
        if (match) {
          probationSalary = match[1].replace(/,/g, '');
          confirmedSalary = match[2].replace(/,/g, '');
        }
      }
      console.log("Parsed salaries for PDF:", { probationSalary, confirmedSalary });

      const pdfBuffer = await generateEmployeeOfferLetterPDF({
        offerNumber: offerLetter.offerNumber,
        verificationToken: offerLetter.verificationToken,
        employee,
        probationSalary,
        confirmedSalary,
        probationPeriod: offerLetter.probationPeriod || "6 months",
        noticePeriod: offerLetter.noticePeriod || "30 days",
      }, baseUrl);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="offer-letter-${offerLetter.offerNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      res.status(500).json({ error: "Failed to download offer letter" });
    }
  });

  // Get employee offer letters
  app.get("/api/employees/:employeeId/offer-letters", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const offerLetters = await storage.getEmployeeOfferLettersByEmployee(req.params.employeeId);
      res.json(offerLetters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offer letters" });
    }
  });

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
