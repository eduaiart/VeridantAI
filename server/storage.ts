import { 
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type InternshipProgram, type InsertInternshipProgram,
  type InternshipApplication, type InsertInternshipApplication,
  type ApplicationStatusHistory,
  type Message, type InsertMessage,
  type EmailTemplate,
  type Certificate, type InsertCertificate,
  type OfferLetter, type InsertOfferLetter,
  type VerificationLog,
  type WeeklyReport, type InsertWeeklyReport,
  type Employee, type InsertEmployee,
  type EmploymentDocument, type InsertEmploymentDocument,
  type EmploymentHistory,
  type CollegeMou, type InsertCollegeMou
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getUsers(role?: string): Promise<User[]>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Internship Programs
  createProgram(program: InsertInternshipProgram): Promise<InternshipProgram>;
  getPrograms(activeOnly?: boolean): Promise<InternshipProgram[]>;
  getProgram(id: string): Promise<InternshipProgram | undefined>;
  updateProgram(id: string, data: Partial<InternshipProgram>): Promise<InternshipProgram | undefined>;
  deleteProgram(id: string): Promise<boolean>;
  
  // Applications
  createApplication(application: InsertInternshipApplication): Promise<InternshipApplication>;
  getApplications(filters?: { status?: string; programId?: string; userId?: string }): Promise<InternshipApplication[]>;
  getApplication(id: string): Promise<InternshipApplication | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<InternshipApplication | undefined>;
  updateApplication(id: string, data: Partial<InternshipApplication>): Promise<InternshipApplication | undefined>;
  getApplicationCount(): Promise<number>;
  
  // Application Status History
  addStatusHistory(applicationId: string, previousStatus: string | null, newStatus: string, changedBy: string | null, notes?: string): Promise<ApplicationStatusHistory>;
  getStatusHistory(applicationId: string): Promise<ApplicationStatusHistory[]>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(applicationId?: string, userId?: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  markMessageAsRead(id: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
  
  // Email Templates
  getEmailTemplates(): Promise<EmailTemplate[]>;
  getEmailTemplate(templateType: string): Promise<EmailTemplate | undefined>;
  
  // Certificates
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificates(userId?: string): Promise<Certificate[]>;
  getCertificate(id: string): Promise<Certificate | undefined>;
  getCertificateByToken(token: string): Promise<Certificate | undefined>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate | undefined>;
  getCertificateCount(): Promise<number>;
  
  // Offer Letters
  createOfferLetter(offerLetter: InsertOfferLetter): Promise<OfferLetter>;
  getOfferLetters(userId?: string): Promise<OfferLetter[]>;
  getOfferLetter(id: string): Promise<OfferLetter | undefined>;
  getOfferLetterByToken(token: string): Promise<OfferLetter | undefined>;
  updateOfferLetter(id: string, data: Partial<OfferLetter>): Promise<OfferLetter | undefined>;
  
  // Verification Logs
  logVerification(log: Omit<VerificationLog, 'id' | 'createdAt'>): Promise<VerificationLog>;
  getVerificationLogs(documentId: string): Promise<VerificationLog[]>;
  
  // Weekly Reports
  createWeeklyReport(report: InsertWeeklyReport): Promise<WeeklyReport>;
  getWeeklyReports(applicationId: string): Promise<WeeklyReport[]>;
  updateWeeklyReport(id: string, data: Partial<WeeklyReport>): Promise<WeeklyReport | undefined>;
  
  // Employees
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  getEmployees(filters?: { status?: string; department?: string }): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee | undefined>;
  getEmployeeCount(): Promise<number>;
  
  // Employment Documents
  createEmploymentDocument(doc: InsertEmploymentDocument): Promise<EmploymentDocument>;
  getEmploymentDocuments(employeeId: string): Promise<EmploymentDocument[]>;
  updateEmploymentDocument(id: string, data: Partial<EmploymentDocument>): Promise<EmploymentDocument | undefined>;
  
  // Employment History
  addEmploymentHistory(employeeId: string, changeType: string, previousValue: string | null, newValue: string, changedBy: string | null, notes?: string): Promise<EmploymentHistory>;
  getEmploymentHistory(employeeId: string): Promise<EmploymentHistory[]>;
  
  // College MoUs
  createCollegeMou(mou: InsertCollegeMou): Promise<CollegeMou>;
  getCollegeMous(): Promise<CollegeMou[]>;
  getCollegeMou(id: string): Promise<CollegeMou | undefined>;
  getCollegeMouByToken(token: string): Promise<CollegeMou | undefined>;
  getCollegeMouByNumber(mouNumber: string): Promise<CollegeMou | undefined>;
  updateCollegeMou(id: string, data: Partial<CollegeMou>): Promise<CollegeMou | undefined>;
  getCollegeMouCount(): Promise<number>;
}

// Helper to generate application numbers
function generateApplicationNumber(count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count + 1).padStart(4, '0');
  return `VAI-${year}-${paddedCount}`;
}

// Helper to generate certificate numbers
function generateCertificateNumber(count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count + 1).padStart(4, '0');
  return `CERT-VAI-${year}-${paddedCount}`;
}

// Helper to generate offer letter numbers
function generateOfferNumber(count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count + 1).padStart(4, '0');
  return `OFFER-VAI-${year}-${paddedCount}`;
}

// Helper to generate verification tokens
function generateVerificationToken(): string {
  return randomUUID().replace(/-/g, '').substring(0, 16).toUpperCase();
}

// Helper to generate employee IDs
function generateEmployeeId(count: number): string {
  const paddedCount = String(count + 1).padStart(3, '0');
  return `VAI-EMP-${paddedCount}`;
}

// Helper to generate MoU numbers
function generateMouNumber(count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count + 1).padStart(4, '0');
  return `MOU-RH-${year}-${paddedCount}`;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private programs: Map<string, InternshipProgram>;
  private applications: Map<string, InternshipApplication>;
  private statusHistory: Map<string, ApplicationStatusHistory>;
  private messages: Map<string, Message>;
  private emailTemplates: Map<string, EmailTemplate>;
  private certificates: Map<string, Certificate>;
  private offerLetters: Map<string, OfferLetter>;
  private verificationLogs: Map<string, VerificationLog>;
  private weeklyReports: Map<string, WeeklyReport>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.programs = new Map();
    this.applications = new Map();
    this.statusHistory = new Map();
    this.messages = new Map();
    this.emailTemplates = new Map();
    this.certificates = new Map();
    this.offerLetters = new Map();
    this.verificationLogs = new Map();
    this.weeklyReports = new Map();
    
    // Initialize with sample internship programs
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample internship programs
    const samplePrograms: InternshipProgram[] = [
      {
        id: randomUUID(),
        title: "AI/ML Engineering Internship",
        description: "Join our AI team to work on cutting-edge machine learning projects. You'll gain hands-on experience with natural language processing, computer vision, and deep learning frameworks.",
        department: "engineering",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹15,000/month",
        skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Analysis"],
        learningOutcomes: [
          "Build and deploy ML models",
          "Work with real-world datasets",
          "Understand AI product development lifecycle",
          "Collaborate with experienced engineers"
        ],
        eligibility: "B.Tech/M.Tech in CS/IT or related field. Strong programming skills required.",
        location: "Remote",
        seats: 10,
        applicationDeadline: new Date("2025-02-28"),
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-06-15"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Full Stack Development Internship",
        description: "Work on our web applications using modern technologies. Build features, fix bugs, and learn best practices in software development.",
        department: "engineering",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹12,000/month",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
        learningOutcomes: [
          "Build production-ready web applications",
          "Learn agile development practices",
          "Master version control with Git",
          "Write clean, maintainable code"
        ],
        eligibility: "B.Tech/BCA in CS/IT. Basic knowledge of web development.",
        location: "Hybrid",
        seats: 15,
        applicationDeadline: new Date("2025-02-28"),
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-06-15"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Data Science Internship",
        description: "Analyze data, build dashboards, and derive insights that drive business decisions. Work with our data team on real analytics projects.",
        department: "data-science",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹15,000/month",
        skills: ["Python", "SQL", "Pandas", "Data Visualization", "Statistics"],
        learningOutcomes: [
          "Perform exploratory data analysis",
          "Build interactive dashboards",
          "Apply statistical methods",
          "Present insights to stakeholders"
        ],
        eligibility: "Strong analytical skills. Knowledge of Python and SQL preferred.",
        location: "Remote",
        seats: 8,
        applicationDeadline: new Date("2025-02-28"),
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-06-15"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "UI/UX Design Internship",
        description: "Design user interfaces for our AI products. Create wireframes, prototypes, and conduct user research.",
        department: "design",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹10,000/month",
        skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
        learningOutcomes: [
          "Design user-centered interfaces",
          "Conduct usability testing",
          "Create design systems",
          "Collaborate with developers"
        ],
        eligibility: "Strong design portfolio. Knowledge of Figma or similar tools.",
        location: "Remote",
        seats: 5,
        applicationDeadline: new Date("2025-02-28"),
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-06-15"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Digital Marketing Internship",
        description: "Learn digital marketing strategies, content creation, and social media management for a tech company.",
        department: "marketing",
        duration: "2 months",
        durationWeeks: 8,
        stipend: "₹8,000/month",
        skills: ["Content Writing", "Social Media", "SEO", "Analytics", "Marketing Strategy"],
        learningOutcomes: [
          "Create engaging content",
          "Manage social media campaigns",
          "Understand SEO fundamentals",
          "Analyze marketing metrics"
        ],
        eligibility: "Good communication skills. Interest in technology and marketing.",
        location: "Remote",
        seats: 5,
        applicationDeadline: new Date("2025-02-28"),
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-05-01"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    samplePrograms.forEach(program => {
      this.programs.set(program.id, program);
    });

    // Create default email templates
    const defaultTemplates: EmailTemplate[] = [
      {
        id: randomUUID(),
        name: "Application Received",
        subject: "Application Received - VeridantAI Internship Program",
        body: `Dear {{firstName}},

Thank you for applying to the {{programTitle}} at VeridantAI!

Your application number is: {{applicationNumber}}

We have received your application and our team will review it shortly. You can expect to hear from us within 5-7 business days.

In the meantime, feel free to explore more about VeridantAI at www.veridantai.in.

Best regards,
VeridantAI HR Team`,
        templateType: "application_received",
        variables: ["firstName", "programTitle", "applicationNumber"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Status Update",
        subject: "Application Status Update - {{applicationNumber}}",
        body: `Dear {{firstName}},

We wanted to update you on the status of your application ({{applicationNumber}}) for the {{programTitle}}.

Your application status has been updated to: {{status}}

{{statusNotes}}

If you have any questions, please don't hesitate to reach out.

Best regards,
VeridantAI HR Team`,
        templateType: "status_update",
        variables: ["firstName", "applicationNumber", "programTitle", "status", "statusNotes"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Interview Scheduled",
        subject: "Interview Invitation - VeridantAI {{programTitle}}",
        body: `Dear {{firstName}},

Congratulations! Your application for the {{programTitle}} has been shortlisted.

We would like to invite you for an interview:

Date & Time: {{interviewDate}}
Meeting Link: {{interviewLink}}

Please confirm your availability by replying to this email.

Best regards,
VeridantAI HR Team`,
        templateType: "interview_scheduled",
        variables: ["firstName", "programTitle", "interviewDate", "interviewLink"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Offer Letter",
        subject: "Congratulations! Offer Letter - VeridantAI Internship",
        body: `Dear {{firstName}},

We are delighted to offer you the position of {{position}} at VeridantAI!

Please find your offer letter attached. To accept this offer, please:
1. Review the terms and conditions
2. Click the acceptance link below
3. Complete the joining formalities

Offer Details:
- Position: {{position}}
- Stipend: {{stipend}}
- Start Date: {{startDate}}
- Location: {{location}}

This offer is valid until {{expiryDate}}.

We look forward to having you on our team!

Best regards,
VeridantAI HR Team`,
        templateType: "offer_letter",
        variables: ["firstName", "position", "stipend", "startDate", "location", "expiryDate"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultTemplates.forEach(template => {
      this.emailTemplates.set(template.id, template);
    });

    // Create an admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "$2b$10$76U8OJnk3JKWcAsyZwyYJu7Qh000OAJjC0BPbkGWksQw4/MtF0jqW", // "admin123" hashed
      email: "admin@veridantai.in",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      phone: "+91-8550970101",
      profileImage: null,
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null
    };
    this.users.set(adminUser.id, adminUser);
  }

  // ============== USERS ==============
  
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email ?? null,
      role: insertUser.role ?? "candidate",
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      phone: insertUser.phone ?? null,
      profileImage: null,
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getUsers(role?: string): Promise<User[]> {
    const users = Array.from(this.users.values());
    if (role) {
      return users.filter(u => u.role === role);
    }
    return users;
  }

  // ============== CONTACTS ==============

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      id,
      firstName: insertContact.firstName,
      lastName: insertContact.lastName,
      email: insertContact.email,
      company: insertContact.company ?? null,
      interest: insertContact.interest ?? null,
      message: insertContact.message ?? null,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  // ============== INTERNSHIP PROGRAMS ==============

  async createProgram(program: InsertInternshipProgram): Promise<InternshipProgram> {
    const id = randomUUID();
    const newProgram: InternshipProgram = {
      id,
      title: program.title,
      description: program.description,
      department: program.department,
      duration: program.duration,
      durationWeeks: program.durationWeeks,
      stipend: program.stipend ?? null,
      skills: program.skills ?? null,
      learningOutcomes: program.learningOutcomes ?? null,
      eligibility: program.eligibility ?? null,
      location: program.location ?? "Remote",
      seats: program.seats ?? 10,
      applicationDeadline: program.applicationDeadline ?? null,
      startDate: program.startDate ?? null,
      endDate: program.endDate ?? null,
      isActive: program.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.programs.set(id, newProgram);
    return newProgram;
  }

  async getPrograms(activeOnly: boolean = false): Promise<InternshipProgram[]> {
    const programs = Array.from(this.programs.values());
    if (activeOnly) {
      return programs.filter(p => p.isActive);
    }
    return programs.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getProgram(id: string): Promise<InternshipProgram | undefined> {
    return this.programs.get(id);
  }

  async updateProgram(id: string, data: Partial<InternshipProgram>): Promise<InternshipProgram | undefined> {
    const program = this.programs.get(id);
    if (!program) return undefined;
    const updated = { ...program, ...data, updatedAt: new Date() };
    this.programs.set(id, updated);
    return updated;
  }

  async deleteProgram(id: string): Promise<boolean> {
    return this.programs.delete(id);
  }

  // ============== APPLICATIONS ==============

  async createApplication(application: InsertInternshipApplication): Promise<InternshipApplication> {
    const id = randomUUID();
    const count = await this.getApplicationCount();
    const applicationNumber = generateApplicationNumber(count);
    
    const newApplication: InternshipApplication = {
      id,
      applicationNumber,
      programId: application.programId,
      userId: null,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      dateOfBirth: application.dateOfBirth ?? null,
      gender: application.gender ?? null,
      address: application.address ?? null,
      city: application.city ?? null,
      state: application.state ?? null,
      pincode: application.pincode ?? null,
      highestQualification: application.highestQualification,
      institution: application.institution,
      fieldOfStudy: application.fieldOfStudy ?? null,
      graduationYear: application.graduationYear ?? null,
      cgpa: application.cgpa ?? null,
      currentStatus: application.currentStatus ?? null,
      linkedinUrl: application.linkedinUrl ?? null,
      portfolioUrl: application.portfolioUrl ?? null,
      githubUrl: application.githubUrl ?? null,
      resumeUrl: application.resumeUrl ?? null,
      coverLetter: application.coverLetter ?? null,
      status: "submitted",
      statusNotes: null,
      interviewDate: null,
      interviewLink: null,
      interviewNotes: null,
      interviewScore: null,
      adminNotes: null,
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.applications.set(id, newApplication);
    
    // Add initial status history
    await this.addStatusHistory(id, null, "submitted", null, "Application submitted");
    
    return newApplication;
  }

  async getApplications(filters?: { status?: string; programId?: string; userId?: string }): Promise<InternshipApplication[]> {
    let applications = Array.from(this.applications.values());
    
    if (filters) {
      if (filters.status) {
        applications = applications.filter(a => a.status === filters.status);
      }
      if (filters.programId) {
        applications = applications.filter(a => a.programId === filters.programId);
      }
      if (filters.userId) {
        applications = applications.filter(a => a.userId === filters.userId);
      }
    }
    
    return applications.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getApplication(id: string): Promise<InternshipApplication | undefined> {
    return this.applications.get(id);
  }

  async getApplicationByNumber(applicationNumber: string): Promise<InternshipApplication | undefined> {
    return Array.from(this.applications.values()).find(
      a => a.applicationNumber === applicationNumber
    );
  }

  async updateApplication(id: string, data: Partial<InternshipApplication>): Promise<InternshipApplication | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    const updated = { ...application, ...data, updatedAt: new Date() };
    this.applications.set(id, updated);
    return updated;
  }

  async getApplicationCount(): Promise<number> {
    return this.applications.size;
  }

  // ============== STATUS HISTORY ==============

  async addStatusHistory(applicationId: string, previousStatus: string | null, newStatus: string, changedBy: string | null, notes?: string): Promise<ApplicationStatusHistory> {
    const id = randomUUID();
    const history: ApplicationStatusHistory = {
      id,
      applicationId,
      previousStatus,
      newStatus,
      changedBy,
      notes: notes || null,
      createdAt: new Date()
    };
    this.statusHistory.set(id, history);
    return history;
  }

  async getStatusHistory(applicationId: string): Promise<ApplicationStatusHistory[]> {
    return Array.from(this.statusHistory.values())
      .filter(h => h.applicationId === applicationId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // ============== MESSAGES ==============

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = {
      id,
      applicationId: message.applicationId ?? null,
      senderId: message.senderId ?? null,
      recipientId: message.recipientId ?? null,
      subject: message.subject ?? null,
      content: message.content,
      messageType: message.messageType ?? "general",
      isRead: false,
      isEmailSent: false,
      createdAt: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessages(applicationId?: string, userId?: string): Promise<Message[]> {
    let messages = Array.from(this.messages.values());
    
    if (applicationId) {
      messages = messages.filter(m => m.applicationId === applicationId);
    }
    if (userId) {
      messages = messages.filter(m => m.recipientId === userId || m.senderId === userId);
    }
    
    return messages.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    this.messages.set(id, { ...message, isRead: true });
    return true;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Array.from(this.messages.values())
      .filter(m => m.recipientId === userId && !m.isRead)
      .length;
  }

  // ============== EMAIL TEMPLATES ==============

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.emailTemplates.values());
  }

  async getEmailTemplate(templateType: string): Promise<EmailTemplate | undefined> {
    return Array.from(this.emailTemplates.values()).find(
      t => t.templateType === templateType && t.isActive
    );
  }

  // ============== CERTIFICATES ==============

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const count = await this.getCertificateCount();
    const certificateNumber = generateCertificateNumber(count);
    const verificationToken = generateVerificationToken();
    
    const newCertificate: Certificate = {
      id,
      certificateNumber,
      applicationId: certificate.applicationId,
      userId: certificate.userId ?? null,
      certificateType: certificate.certificateType,
      recipientName: certificate.recipientName,
      programTitle: certificate.programTitle,
      issueDate: certificate.issueDate ?? new Date(),
      validFrom: certificate.validFrom ?? null,
      validTo: certificate.validTo ?? null,
      grade: certificate.grade ?? null,
      completionPercentage: certificate.completionPercentage ?? null,
      projectTitle: certificate.projectTitle ?? null,
      mentorName: certificate.mentorName ?? null,
      certificateUrl: certificate.certificateUrl ?? null,
      verificationToken,
      qrCodeUrl: certificate.qrCodeUrl ?? null,
      status: "issued",
      revokedReason: null,
      createdAt: new Date(),
      issuedBy: certificate.issuedBy ?? null
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }

  async getCertificates(userId?: string): Promise<Certificate[]> {
    let certificates = Array.from(this.certificates.values());
    if (userId) {
      certificates = certificates.filter(c => c.userId === userId);
    }
    return certificates.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async getCertificateByToken(token: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      c => c.verificationToken === token
    );
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      c => c.certificateNumber === certificateNumber
    );
  }

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate | undefined> {
    const certificate = this.certificates.get(id);
    if (!certificate) return undefined;
    const updated = { ...certificate, ...data };
    this.certificates.set(id, updated);
    return updated;
  }

  async getCertificateCount(): Promise<number> {
    return this.certificates.size;
  }

  // ============== OFFER LETTERS ==============

  async createOfferLetter(offerLetter: InsertOfferLetter): Promise<OfferLetter> {
    const id = randomUUID();
    const count = this.offerLetters.size;
    const offerNumber = generateOfferNumber(count);
    const verificationToken = generateVerificationToken();
    
    const newOfferLetter: OfferLetter = {
      id,
      offerNumber,
      applicationId: offerLetter.applicationId,
      userId: offerLetter.userId ?? null,
      recipientName: offerLetter.recipientName,
      programTitle: offerLetter.programTitle,
      position: offerLetter.position,
      department: offerLetter.department ?? null,
      stipend: offerLetter.stipend ?? null,
      startDate: offerLetter.startDate ?? null,
      endDate: offerLetter.endDate ?? null,
      reportingTo: offerLetter.reportingTo ?? null,
      location: offerLetter.location ?? null,
      termsAndConditions: offerLetter.termsAndConditions ?? null,
      offerLetterUrl: offerLetter.offerLetterUrl ?? null,
      verificationToken,
      status: offerLetter.status ?? "pending",
      acceptedAt: null,
      rejectedAt: null,
      expiresAt: offerLetter.expiresAt ?? null,
      createdAt: new Date(),
      issuedBy: offerLetter.issuedBy ?? null
    };
    this.offerLetters.set(id, newOfferLetter);
    return newOfferLetter;
  }

  async getOfferLetters(userId?: string): Promise<OfferLetter[]> {
    let offerLetters = Array.from(this.offerLetters.values());
    if (userId) {
      offerLetters = offerLetters.filter(o => o.userId === userId);
    }
    return offerLetters.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOfferLetter(id: string): Promise<OfferLetter | undefined> {
    return this.offerLetters.get(id);
  }

  async getOfferLetterByToken(token: string): Promise<OfferLetter | undefined> {
    return Array.from(this.offerLetters.values()).find(
      o => o.verificationToken === token
    );
  }

  async updateOfferLetter(id: string, data: Partial<OfferLetter>): Promise<OfferLetter | undefined> {
    const offerLetter = this.offerLetters.get(id);
    if (!offerLetter) return undefined;
    const updated = { ...offerLetter, ...data };
    this.offerLetters.set(id, updated);
    return updated;
  }

  // ============== VERIFICATION LOGS ==============

  async logVerification(log: Omit<VerificationLog, 'id' | 'createdAt'>): Promise<VerificationLog> {
    const id = randomUUID();
    const newLog: VerificationLog = {
      ...log,
      id,
      createdAt: new Date()
    };
    this.verificationLogs.set(id, newLog);
    return newLog;
  }

  async getVerificationLogs(documentId: string): Promise<VerificationLog[]> {
    return Array.from(this.verificationLogs.values())
      .filter(l => l.documentId === documentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // ============== WEEKLY REPORTS ==============

  async createWeeklyReport(report: InsertWeeklyReport): Promise<WeeklyReport> {
    const id = randomUUID();
    const newReport: WeeklyReport = {
      id,
      applicationId: report.applicationId,
      userId: report.userId ?? null,
      weekNumber: report.weekNumber,
      startDate: report.startDate,
      endDate: report.endDate,
      tasksCompleted: report.tasksCompleted ?? null,
      challenges: report.challenges ?? null,
      learnings: report.learnings ?? null,
      nextWeekPlans: report.nextWeekPlans ?? null,
      hoursWorked: report.hoursWorked ?? null,
      mentorFeedback: report.mentorFeedback ?? null,
      mentorRating: report.mentorRating ?? null,
      status: "submitted",
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null
    };
    this.weeklyReports.set(id, newReport);
    return newReport;
  }

  async getWeeklyReports(applicationId: string): Promise<WeeklyReport[]> {
    return Array.from(this.weeklyReports.values())
      .filter(r => r.applicationId === applicationId)
      .sort((a, b) => a.weekNumber - b.weekNumber);
  }

  async updateWeeklyReport(id: string, data: Partial<WeeklyReport>): Promise<WeeklyReport | undefined> {
    const report = this.weeklyReports.get(id);
    if (!report) return undefined;
    const updated = { ...report, ...data };
    this.weeklyReports.set(id, updated);
    return updated;
  }

  // ============== COLLEGE MoUs (Stubs - use DatabaseStorage for MoU operations) ==============
  
  async createCollegeMou(_mou: InsertCollegeMou): Promise<CollegeMou> {
    throw new Error("MoU operations require DatabaseStorage");
  }
  
  async getCollegeMous(): Promise<CollegeMou[]> {
    return [];
  }
  
  async getCollegeMou(_id: string): Promise<CollegeMou | undefined> {
    return undefined;
  }
  
  async getCollegeMouByToken(_token: string): Promise<CollegeMou | undefined> {
    return undefined;
  }
  
  async getCollegeMouByNumber(_mouNumber: string): Promise<CollegeMou | undefined> {
    return undefined;
  }
  
  async updateCollegeMou(_id: string, _data: Partial<CollegeMou>): Promise<CollegeMou | undefined> {
    return undefined;
  }
  
  async getCollegeMouCount(): Promise<number> {
    return 0;
  }
}

export const storage = new MemStorage();
