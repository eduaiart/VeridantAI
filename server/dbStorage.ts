import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, contacts, internshipPrograms, internshipApplications,
  applicationStatusHistory, messages, emailTemplates,
  certificates, offerLetters, verificationLogs, weeklyReports,
  employees, employmentDocuments, employmentHistory, employeeOfferLetters, collegeMous,
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
  type EmployeeOfferLetter, type InsertEmployeeOfferLetter,
  type CollegeMou, type InsertCollegeMou
} from "@shared/schema";
import { IStorage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function generateApplicationNumber(count: number): string {
  const year = new Date().getFullYear();
  const num = (count + 1).toString().padStart(4, "0");
  return `VAI-${year}-${num}`;
}

function generateCertificateNumber(count: number): string {
  const year = new Date().getFullYear();
  const num = (count + 1).toString().padStart(5, "0");
  return `CERT-${year}-${num}`;
}

function generateOfferNumber(count: number): string {
  const year = new Date().getFullYear();
  const num = (count + 1).toString().padStart(5, "0");
  return `OFR-${year}-${num}`;
}

function generateVerificationToken(): string {
  return randomUUID().replace(/-/g, "").substring(0, 12).toUpperCase();
}

function generateEmployeeId(count: number): string {
  const num = (count + 1).toString().padStart(3, "0");
  return `VAI-EMP-${num}`;
}

function generateEmployeeOfferNumber(count: number): string {
  const year = new Date().getFullYear();
  const num = (count + 1).toString().padStart(5, "0");
  return `EMP-OFR-${year}-${num}`;
}

function generateMouNumber(count: number): string {
  const year = new Date().getFullYear();
  const num = (count + 1).toString().padStart(4, "0");
  return `MOU-RH-${year}-${num}`;
}

export class DatabaseStorage implements IStorage {
  
  async initialize(): Promise<void> {
    // Check if admin user exists
    const adminUser = await this.getUserByUsername("admin");
    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.insert(users).values({
        id: randomUUID(),
        username: "admin",
        password: hashedPassword,
        email: "admin@veridantai.in",
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        phone: "+91-8550970101",
        isActive: true,
      });
    }

    // Check if default programs exist
    const existingPrograms = await this.getPrograms();
    if (existingPrograms.length === 0) {
      await this.seedDefaultPrograms();
    }
  }

  private async seedDefaultPrograms(): Promise<void> {
    const defaultPrograms = [
      {
        id: randomUUID(),
        title: "AI/ML Engineering Internship",
        description: "Work on cutting-edge AI and Machine Learning projects. Learn to build, train, and deploy ML models for real-world applications.",
        department: "engineering",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹15,000/month",
        skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
        learningOutcomes: ["Build production ML models", "Deploy AI solutions", "Work with large datasets"],
        eligibility: "B.Tech/M.Tech in CS/IT or related field",
        location: "Remote",
        seats: 15,
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "Full Stack Development Internship",
        description: "Build modern web applications using React, Node.js, and cloud technologies. Work on real products used by thousands.",
        department: "engineering",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹12,000/month",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
        learningOutcomes: ["Build full-stack apps", "Learn CI/CD", "Agile development"],
        eligibility: "Any degree with programming knowledge",
        location: "Remote",
        seats: 20,
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "Data Science Internship",
        description: "Analyze complex datasets, build predictive models, and create data visualizations that drive business decisions.",
        department: "data-science",
        duration: "3 months",
        durationWeeks: 12,
        stipend: "₹12,000/month",
        skills: ["Python", "Pandas", "SQL", "Data Visualization", "Statistics"],
        learningOutcomes: ["Data analysis", "Statistical modeling", "Business insights"],
        eligibility: "Background in statistics, math, or CS",
        location: "Remote",
        seats: 10,
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "UI/UX Design Internship",
        description: "Design beautiful, user-friendly interfaces for AI-powered products. Learn design thinking and user research.",
        department: "design",
        duration: "2 months",
        durationWeeks: 8,
        stipend: "₹10,000/month",
        skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
        learningOutcomes: ["Design production UIs", "User research", "Design systems"],
        eligibility: "Design portfolio required",
        location: "Remote",
        seats: 8,
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "Digital Marketing Internship",
        description: "Learn digital marketing strategies, SEO, content marketing, and social media management for tech products.",
        department: "marketing",
        duration: "2 months",
        durationWeeks: 8,
        stipend: "₹8,000/month",
        skills: ["SEO", "Content Marketing", "Social Media", "Analytics", "Copywriting"],
        learningOutcomes: ["Marketing campaigns", "SEO optimization", "Analytics"],
        eligibility: "Any graduate with interest in marketing",
        location: "Remote",
        seats: 10,
        isActive: true,
      },
    ];

    for (const program of defaultPrograms) {
      await db.insert(internshipPrograms).values(program);
    }
  }

  // ============== USERS ==============
  
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      id: randomUUID(),
      ...insertUser,
    }).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getUsers(role?: string): Promise<User[]> {
    if (role) {
      return await db.select().from(users).where(eq(users.role, role));
    }
    return await db.select().from(users);
  }

  // ============== CONTACTS ==============

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values({
      id: randomUUID(),
      ...insertContact,
    }).returning();
    return result[0];
  }

  // ============== PROGRAMS ==============

  async getPrograms(activeOnly?: boolean): Promise<InternshipProgram[]> {
    if (activeOnly) {
      return await db.select().from(internshipPrograms)
        .where(eq(internshipPrograms.isActive, true))
        .orderBy(desc(internshipPrograms.createdAt));
    }
    return await db.select().from(internshipPrograms).orderBy(desc(internshipPrograms.createdAt));
  }

  async getProgram(id: string): Promise<InternshipProgram | undefined> {
    const result = await db.select().from(internshipPrograms).where(eq(internshipPrograms.id, id));
    return result[0];
  }

  async createProgram(program: InsertInternshipProgram): Promise<InternshipProgram> {
    const result = await db.insert(internshipPrograms).values({
      id: randomUUID(),
      ...program,
    }).returning();
    return result[0];
  }

  async updateProgram(id: string, data: Partial<InternshipProgram>): Promise<InternshipProgram | undefined> {
    const result = await db.update(internshipPrograms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(internshipPrograms.id, id))
      .returning();
    return result[0];
  }

  async deleteProgram(id: string): Promise<boolean> {
    const result = await db.delete(internshipPrograms)
      .where(eq(internshipPrograms.id, id))
      .returning();
    return result.length > 0;
  }

  // ============== APPLICATIONS ==============

  async getApplications(filters?: { status?: string; programId?: string; userId?: string }): Promise<InternshipApplication[]> {
    let query = db.select().from(internshipApplications);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(internshipApplications.status, filters.status));
    }
    if (filters?.programId) {
      conditions.push(eq(internshipApplications.programId, filters.programId));
    }
    if (filters?.userId) {
      conditions.push(eq(internshipApplications.userId, filters.userId));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(internshipApplications)
        .where(and(...conditions))
        .orderBy(desc(internshipApplications.createdAt));
    }
    
    return await db.select().from(internshipApplications).orderBy(desc(internshipApplications.createdAt));
  }

  async getApplication(id: string): Promise<InternshipApplication | undefined> {
    const result = await db.select().from(internshipApplications).where(eq(internshipApplications.id, id));
    return result[0];
  }

  async getApplicationByNumber(applicationNumber: string): Promise<InternshipApplication | undefined> {
    const result = await db.select().from(internshipApplications)
      .where(eq(internshipApplications.applicationNumber, applicationNumber));
    return result[0];
  }

  async createApplication(application: InsertInternshipApplication): Promise<InternshipApplication> {
    const count = await this.getApplicationCount();
    const applicationNumber = generateApplicationNumber(count);
    
    const result = await db.insert(internshipApplications).values({
      id: randomUUID(),
      applicationNumber,
      ...application,
      status: "submitted",
    }).returning();
    return result[0];
  }

  async updateApplication(id: string, data: Partial<InternshipApplication>): Promise<InternshipApplication | undefined> {
    const result = await db.update(internshipApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(internshipApplications.id, id))
      .returning();
    return result[0];
  }

  async getApplicationCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(internshipApplications);
    return Number(result[0].count);
  }

  // ============== APPLICATION STATUS HISTORY ==============

  async addStatusHistory(applicationId: string, previousStatus: string | null, newStatus: string, changedBy: string | null, notes?: string): Promise<ApplicationStatusHistory> {
    const result = await db.insert(applicationStatusHistory).values({
      id: randomUUID(),
      applicationId,
      previousStatus,
      newStatus,
      changedBy,
      notes: notes || null,
    }).returning();
    return result[0];
  }

  async getStatusHistory(applicationId: string): Promise<ApplicationStatusHistory[]> {
    return await db.select().from(applicationStatusHistory)
      .where(eq(applicationStatusHistory.applicationId, applicationId))
      .orderBy(desc(applicationStatusHistory.createdAt));
  }

  // ============== MESSAGES ==============

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values({
      id: randomUUID(),
      ...message,
    }).returning();
    return result[0];
  }

  async getMessages(applicationId?: string, userId?: string): Promise<Message[]> {
    const conditions = [];
    if (applicationId) {
      conditions.push(eq(messages.applicationId, applicationId));
    }
    if (userId) {
      conditions.push(sql`(${messages.senderId} = ${userId} OR ${messages.recipientId} = ${userId})`);
    }
    
    if (conditions.length > 0) {
      return await db.select().from(messages)
        .where(and(...conditions))
        .orderBy(desc(messages.createdAt));
    }
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return result.length > 0;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(messages)
      .where(and(eq(messages.recipientId, userId), eq(messages.isRead, false)));
    return Number(result[0].count);
  }

  // ============== EMAIL TEMPLATES ==============

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates);
  }

  async getEmailTemplate(templateType: string): Promise<EmailTemplate | undefined> {
    const result = await db.select().from(emailTemplates)
      .where(and(eq(emailTemplates.templateType, templateType), eq(emailTemplates.isActive, true)));
    return result[0];
  }

  // ============== CERTIFICATES ==============

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const count = await this.getCertificateCount();
    const certificateNumber = generateCertificateNumber(count);
    const verificationToken = generateVerificationToken();
    
    const result = await db.insert(certificates).values({
      id: randomUUID(),
      certificateNumber,
      verificationToken,
      ...certificate,
      status: "issued",
    }).returning();
    return result[0];
  }

  async getCertificates(userId?: string): Promise<Certificate[]> {
    if (userId) {
      return await db.select().from(certificates)
        .where(eq(certificates.userId, userId))
        .orderBy(desc(certificates.createdAt));
    }
    return await db.select().from(certificates).orderBy(desc(certificates.createdAt));
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates).where(eq(certificates.id, id));
    return result[0];
  }

  async getCertificateByToken(token: string): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates)
      .where(eq(certificates.verificationToken, token));
    return result[0];
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber));
    return result[0];
  }

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate | undefined> {
    const result = await db.update(certificates)
      .set(data)
      .where(eq(certificates.id, id))
      .returning();
    return result[0];
  }

  async getCertificateCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(certificates);
    return Number(result[0].count);
  }

  // ============== OFFER LETTERS ==============

  async createOfferLetter(offerLetter: InsertOfferLetter): Promise<OfferLetter> {
    const count = await db.select({ count: sql<number>`count(*)::int` }).from(offerLetters);
    const offerNumber = generateOfferNumber(Number(count[0].count));
    const verificationToken = generateVerificationToken();
    
    const result = await db.insert(offerLetters).values({
      id: randomUUID(),
      offerNumber,
      verificationToken,
      ...offerLetter,
    }).returning();
    return result[0];
  }

  async getOfferLetters(userId?: string): Promise<OfferLetter[]> {
    if (userId) {
      return await db.select().from(offerLetters)
        .where(eq(offerLetters.userId, userId))
        .orderBy(desc(offerLetters.createdAt));
    }
    return await db.select().from(offerLetters).orderBy(desc(offerLetters.createdAt));
  }

  async getOfferLetter(id: string): Promise<OfferLetter | undefined> {
    const result = await db.select().from(offerLetters).where(eq(offerLetters.id, id));
    return result[0];
  }

  async getOfferLetterByToken(token: string): Promise<OfferLetter | undefined> {
    const result = await db.select().from(offerLetters)
      .where(eq(offerLetters.verificationToken, token));
    return result[0];
  }

  async updateOfferLetter(id: string, data: Partial<OfferLetter>): Promise<OfferLetter | undefined> {
    const result = await db.update(offerLetters)
      .set(data)
      .where(eq(offerLetters.id, id))
      .returning();
    return result[0];
  }

  // ============== VERIFICATION LOGS ==============

  async logVerification(log: Omit<VerificationLog, 'id' | 'createdAt'>): Promise<VerificationLog> {
    const result = await db.insert(verificationLogs).values({
      id: randomUUID(),
      ...log,
    }).returning();
    return result[0];
  }

  async getVerificationLogs(documentId: string): Promise<VerificationLog[]> {
    return await db.select().from(verificationLogs)
      .where(eq(verificationLogs.documentId, documentId))
      .orderBy(desc(verificationLogs.createdAt));
  }

  // ============== WEEKLY REPORTS ==============

  async createWeeklyReport(report: InsertWeeklyReport): Promise<WeeklyReport> {
    const result = await db.insert(weeklyReports).values({
      id: randomUUID(),
      ...report,
      status: "submitted",
    }).returning();
    return result[0];
  }

  async getWeeklyReports(applicationId: string): Promise<WeeklyReport[]> {
    return await db.select().from(weeklyReports)
      .where(eq(weeklyReports.applicationId, applicationId))
      .orderBy(weeklyReports.weekNumber);
  }

  async updateWeeklyReport(id: string, data: Partial<WeeklyReport>): Promise<WeeklyReport | undefined> {
    const result = await db.update(weeklyReports)
      .set(data)
      .where(eq(weeklyReports.id, id))
      .returning();
    return result[0];
  }

  // ============== EMPLOYEES ==============

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const count = await this.getEmployeeCount();
    const employeeId = generateEmployeeId(count);
    
    const result = await db.insert(employees).values({
      id: randomUUID(),
      employeeId,
      ...employee,
      status: "onboarding",
    }).returning();
    return result[0];
  }

  async getEmployees(filters?: { status?: string; department?: string }): Promise<Employee[]> {
    if (filters?.status && filters?.department) {
      return await db.select().from(employees)
        .where(and(
          eq(employees.status, filters.status),
          eq(employees.department, filters.department)
        ))
        .orderBy(desc(employees.createdAt));
    }
    if (filters?.status) {
      return await db.select().from(employees)
        .where(eq(employees.status, filters.status))
        .orderBy(desc(employees.createdAt));
    }
    if (filters?.department) {
      return await db.select().from(employees)
        .where(eq(employees.department, filters.department))
        .orderBy(desc(employees.createdAt));
    }
    return await db.select().from(employees).orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return result[0];
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee | undefined> {
    const result = await db.update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return result[0];
  }

  async getEmployeeCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(employees);
    return result[0]?.count || 0;
  }

  // ============== EMPLOYMENT DOCUMENTS ==============

  async createEmploymentDocument(doc: InsertEmploymentDocument): Promise<EmploymentDocument> {
    const result = await db.insert(employmentDocuments).values({
      id: randomUUID(),
      ...doc,
      isSubmitted: false,
      isVerified: false,
    }).returning();
    return result[0];
  }

  async getEmploymentDocuments(employeeId: string): Promise<EmploymentDocument[]> {
    return await db.select().from(employmentDocuments)
      .where(eq(employmentDocuments.employeeId, employeeId))
      .orderBy(employmentDocuments.documentType);
  }

  async updateEmploymentDocument(id: string, data: Partial<EmploymentDocument>): Promise<EmploymentDocument | undefined> {
    const result = await db.update(employmentDocuments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employmentDocuments.id, id))
      .returning();
    return result[0];
  }

  // ============== EMPLOYMENT HISTORY ==============

  async addEmploymentHistory(
    employeeId: string, 
    changeType: string, 
    previousValue: string | null, 
    newValue: string, 
    changedBy: string | null, 
    notes?: string
  ): Promise<EmploymentHistory> {
    const result = await db.insert(employmentHistory).values({
      id: randomUUID(),
      employeeId,
      changeType,
      previousValue,
      newValue,
      changedBy,
      notes,
    }).returning();
    return result[0];
  }

  async getEmploymentHistory(employeeId: string): Promise<EmploymentHistory[]> {
    return await db.select().from(employmentHistory)
      .where(eq(employmentHistory.employeeId, employeeId))
      .orderBy(desc(employmentHistory.createdAt));
  }

  // Employee Offer Letters
  async getEmployeeOfferLetterCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(employeeOfferLetters);
    return Number(result[0]?.count) || 0;
  }

  async createEmployeeOfferLetter(data: Omit<InsertEmployeeOfferLetter, "offerNumber" | "verificationToken">): Promise<EmployeeOfferLetter> {
    const count = await this.getEmployeeOfferLetterCount();
    const offerNumber = generateEmployeeOfferNumber(count);
    const verificationToken = generateVerificationToken();
    
    const result = await db.insert(employeeOfferLetters).values({
      id: randomUUID(),
      offerNumber,
      verificationToken,
      ...data,
    }).returning();
    return result[0];
  }

  async getEmployeeOfferLetter(id: string): Promise<EmployeeOfferLetter | undefined> {
    const results = await db.select().from(employeeOfferLetters).where(eq(employeeOfferLetters.id, id));
    return results[0];
  }

  async getEmployeeOfferLetterByToken(token: string): Promise<EmployeeOfferLetter | undefined> {
    const results = await db.select().from(employeeOfferLetters).where(eq(employeeOfferLetters.verificationToken, token));
    return results[0];
  }

  async getEmployeeOfferLettersByEmployee(employeeId: string): Promise<EmployeeOfferLetter[]> {
    return await db.select().from(employeeOfferLetters)
      .where(eq(employeeOfferLetters.employeeId, employeeId))
      .orderBy(desc(employeeOfferLetters.createdAt));
  }

  async updateEmployeeOfferLetter(id: string, updates: Partial<EmployeeOfferLetter>): Promise<EmployeeOfferLetter | undefined> {
    const result = await db.update(employeeOfferLetters).set(updates).where(eq(employeeOfferLetters.id, id)).returning();
    return result[0];
  }

  // ============== COLLEGE MoUs ==============

  async getCollegeMouCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(collegeMous);
    return Number(result[0]?.count) || 0;
  }

  async createCollegeMou(mou: InsertCollegeMou): Promise<CollegeMou> {
    const count = await this.getCollegeMouCount();
    const mouNumber = generateMouNumber(count);
    const verificationToken = generateVerificationToken();
    
    const result = await db.insert(collegeMous).values({
      id: randomUUID(),
      mouNumber,
      verificationToken,
      ...mou,
    }).returning();
    return result[0];
  }

  async getCollegeMous(): Promise<CollegeMou[]> {
    return await db.select().from(collegeMous).orderBy(desc(collegeMous.createdAt));
  }

  async getCollegeMou(id: string): Promise<CollegeMou | undefined> {
    const results = await db.select().from(collegeMous).where(eq(collegeMous.id, id));
    return results[0];
  }

  async getCollegeMouByToken(token: string): Promise<CollegeMou | undefined> {
    const results = await db.select().from(collegeMous).where(eq(collegeMous.verificationToken, token));
    return results[0];
  }

  async getCollegeMouByNumber(mouNumber: string): Promise<CollegeMou | undefined> {
    const results = await db.select().from(collegeMous).where(eq(collegeMous.mouNumber, mouNumber));
    return results[0];
  }

  async updateCollegeMou(id: string, updates: Partial<CollegeMou>): Promise<CollegeMou | undefined> {
    const result = await db.update(collegeMous).set({
      ...updates,
      updatedAt: new Date()
    }).where(eq(collegeMous.id, id)).returning();
    return result[0];
  }
}

export const dbStorage = new DatabaseStorage();
