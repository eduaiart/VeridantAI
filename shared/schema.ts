import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============== EXISTING TABLES ==============

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").default("candidate"), // 'admin' | 'candidate'
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  profileImage: text("profile_image"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  interest: text("interest"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============== INTERNSHIP PROGRAM TABLES ==============

export const internshipPrograms = pgTable("internship_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  department: text("department").notNull(), // 'engineering' | 'design' | 'marketing' | 'data-science' | 'product'
  duration: text("duration").notNull(), // e.g., "3 months", "6 months"
  durationWeeks: integer("duration_weeks").notNull(),
  stipend: text("stipend"), // e.g., "₹15,000/month"
  skills: text("skills").array(), // Required skills
  learningOutcomes: text("learning_outcomes").array(),
  eligibility: text("eligibility"),
  location: text("location").default("Remote"), // 'Remote' | 'Patna' | 'Hybrid'
  seats: integer("seats").default(10),
  applicationDeadline: timestamp("application_deadline"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============== APPLICATION TABLES ==============

export const internshipApplications = pgTable("internship_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationNumber: text("application_number").notNull().unique(), // e.g., "VAI-2025-0001"
  userId: varchar("user_id").references(() => users.id),
  programId: varchar("program_id").references(() => internshipPrograms.id).notNull(),
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  
  // Education
  highestQualification: text("highest_qualification").notNull(),
  institution: text("institution").notNull(),
  fieldOfStudy: text("field_of_study"),
  graduationYear: integer("graduation_year"),
  cgpa: text("cgpa"),
  
  // Professional
  currentStatus: text("current_status"), // 'student' | 'fresher' | 'working'
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  githubUrl: text("github_url"),
  
  // Documents
  resumeUrl: text("resume_url"),
  collegeIdUrl: text("college_id_url"),
  bonafideCertificateUrl: text("bonafide_certificate_url"),
  governmentIdUrl: text("government_id_url"),
  marksheetUrl: text("marksheet_url"),
  panCardUrl: text("pan_card_url"),
  coverLetter: text("cover_letter"),
  
  // Application Status
  status: text("status").default("submitted"), // 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected' | 'withdrawn' | 'completed'
  statusNotes: text("status_notes"),
  
  // Interview Details
  interviewDate: timestamp("interview_date"),
  interviewLink: text("interview_link"),
  interviewNotes: text("interview_notes"),
  interviewScore: integer("interview_score"),
  
  // Admin Notes
  adminNotes: text("admin_notes"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application Status History for tracking changes
export const applicationStatusHistory = pgTable("application_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => internshipApplications.id).notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  changedBy: varchar("changed_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============== CRM / MESSAGING TABLES ==============

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => internshipApplications.id),
  senderId: varchar("sender_id").references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  subject: text("subject"),
  content: text("content").notNull(),
  messageType: text("message_type").default("general"), // 'general' | 'status_update' | 'interview' | 'offer' | 'system'
  isRead: boolean("is_read").default(false),
  isEmailSent: boolean("is_email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email Templates for CRM
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  templateType: text("template_type").notNull(), // 'application_received' | 'status_update' | 'interview_scheduled' | 'offer_letter' | 'rejection' | 'certificate'
  variables: text("variables").array(), // Placeholder variables like {{firstName}}, {{programName}}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============== CERTIFICATE / VERIFICATION TABLES ==============

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull().unique(), // e.g., "CERT-VAI-2025-0001"
  applicationId: varchar("application_id").references(() => internshipApplications.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  
  // Certificate Details
  certificateType: text("certificate_type").notNull(), // 'completion' | 'excellence' | 'participation'
  recipientName: text("recipient_name").notNull(),
  programTitle: text("program_title").notNull(),
  issueDate: timestamp("issue_date").defaultNow(),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  
  // Performance
  grade: text("grade"), // 'A+' | 'A' | 'B+' | 'B' | 'C'
  completionPercentage: integer("completion_percentage"),
  projectTitle: text("project_title"),
  mentorName: text("mentor_name"),
  
  // Document
  certificateUrl: text("certificate_url"),
  verificationToken: text("verification_token").notNull().unique(),
  qrCodeUrl: text("qr_code_url"),
  
  // Status
  status: text("status").default("issued"), // 'draft' | 'issued' | 'revoked'
  revokedReason: text("revoked_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  issuedBy: varchar("issued_by").references(() => users.id),
});

export const offerLetters = pgTable("offer_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  offerNumber: text("offer_number").notNull().unique(), // e.g., "OFFER-VAI-2025-0001"
  applicationId: varchar("application_id").references(() => internshipApplications.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  
  // Offer Details
  recipientName: text("recipient_name").notNull(),
  programTitle: text("program_title").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  stipend: text("stipend"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  reportingTo: text("reporting_to"),
  location: text("location"),
  
  // Terms
  termsAndConditions: text("terms_and_conditions"),
  
  // Document
  offerLetterUrl: text("offer_letter_url"),
  verificationToken: text("verification_token").notNull().unique(),
  
  // Status
  status: text("status").default("pending"), // 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'revoked'
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  issuedBy: varchar("issued_by").references(() => users.id),
});

// Verification Logs for audit trail
export const verificationLogs = pgTable("verification_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentType: text("document_type").notNull(), // 'certificate' | 'offer_letter'
  documentId: varchar("document_id").notNull(),
  verificationToken: text("verification_token").notNull(),
  verifierIp: text("verifier_ip"),
  verifierUserAgent: text("verifier_user_agent"),
  verificationResult: text("verification_result").notNull(), // 'valid' | 'invalid' | 'revoked' | 'expired'
  createdAt: timestamp("created_at").defaultNow(),
});

// ============== WEEKLY REPORTS (for attendance tracking) ==============

export const weeklyReports = pgTable("weekly_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => internshipApplications.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  weekNumber: integer("week_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Work Summary
  tasksCompleted: text("tasks_completed"),
  challenges: text("challenges"),
  learnings: text("learnings"),
  nextWeekPlans: text("next_week_plans"),
  hoursWorked: integer("hours_worked"),
  
  // Mentor Feedback
  mentorFeedback: text("mentor_feedback"),
  mentorRating: integer("mentor_rating"), // 1-5
  
  status: text("status").default("submitted"), // 'draft' | 'submitted' | 'reviewed'
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
});

// ============== EMPLOYMENT MANAGEMENT TABLES ==============

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: text("employee_id").notNull().unique(), // e.g., "VAI-EMP-001"
  userId: varchar("user_id").references(() => users.id),
  applicationId: varchar("application_id").references(() => internshipApplications.id), // If converted from intern
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  
  // Employment Details
  designation: text("designation").notNull(), // Job title
  department: text("department").notNull(), // 'Engineering' | 'Finance' | 'HR' | 'Marketing' | 'Operations'
  employmentType: text("employment_type").default("full_time"), // 'full_time' | 'part_time' | 'contract' | 'intern_converted'
  joiningDate: timestamp("joining_date").notNull(),
  probationEndDate: timestamp("probation_end_date"),
  confirmationDate: timestamp("confirmation_date"),
  
  // Compensation
  salary: text("salary"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  ifscCode: text("ifsc_code"),
  panNumber: text("pan_number"),
  
  // Reporting
  reportingManagerId: varchar("reporting_manager_id").references(() => users.id),
  
  // Status
  status: text("status").default("onboarding"), // 'onboarding' | 'active' | 'on_leave' | 'resigned' | 'terminated'
  statusReason: text("status_reason"),
  lastWorkingDate: timestamp("last_working_date"),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const employmentDocuments = pgTable("employment_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  
  // Document Details
  documentType: text("document_type").notNull(), // 'id_proof' | 'pan_card' | 'address_proof' | 'education' | 'experience' | 'offer_letter' | 'nda' | 'bank_details' | 'photo'
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url"),
  
  // Verification
  isSubmitted: boolean("is_submitted").default(false),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employmentHistory = pgTable("employment_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  
  // Change Details
  changeType: text("change_type").notNull(), // 'status_change' | 'designation_change' | 'department_change' | 'salary_change' | 'document_verified'
  previousValue: text("previous_value"),
  newValue: text("new_value").notNull(),
  notes: text("notes"),
  
  // Metadata
  changedBy: varchar("changed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const employeeOfferLetters = pgTable("employee_offer_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  
  offerNumber: text("offer_number").notNull().unique(),
  recipientName: text("recipient_name").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  
  salary: text("salary"),
  joiningDate: timestamp("joining_date"),
  probationPeriod: text("probation_period").default("3 months"),
  noticePeriod: text("notice_period").default("30 days"),
  
  verificationToken: text("verification_token").notNull().unique(),
  pdfUrl: text("pdf_url"),
  
  issuedBy: varchar("issued_by").references(() => users.id),
  issuedAt: timestamp("issued_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============== INSERT SCHEMAS ==============

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  phone: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertInternshipProgramSchema = createInsertSchema(internshipPrograms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInternshipApplicationSchema = createInsertSchema(internshipApplications).omit({
  id: true,
  applicationNumber: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  isEmailSent: true,
  createdAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  certificateNumber: true,
  verificationToken: true,
  createdAt: true,
});

export const insertOfferLetterSchema = createInsertSchema(offerLetters).omit({
  id: true,
  offerNumber: true,
  verificationToken: true,
  createdAt: true,
});

export const insertWeeklyReportSchema = createInsertSchema(weeklyReports).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  employeeId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmploymentDocumentSchema = createInsertSchema(employmentDocuments).omit({
  id: true,
  isSubmitted: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeOfferLetterSchema = createInsertSchema(employeeOfferLetters).omit({
  id: true,
  offerNumber: true,
  verificationToken: true,
  createdAt: true,
});

// ============== TYPES ==============

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertInternshipProgram = z.infer<typeof insertInternshipProgramSchema>;
export type InternshipProgram = typeof internshipPrograms.$inferSelect;
export type InsertInternshipApplication = z.infer<typeof insertInternshipApplicationSchema>;
export type InternshipApplication = typeof internshipApplications.$inferSelect;
export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertOfferLetter = z.infer<typeof insertOfferLetterSchema>;
export type OfferLetter = typeof offerLetters.$inferSelect;
export type VerificationLog = typeof verificationLogs.$inferSelect;
export type InsertWeeklyReport = z.infer<typeof insertWeeklyReportSchema>;
export type WeeklyReport = typeof weeklyReports.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmploymentDocument = z.infer<typeof insertEmploymentDocumentSchema>;
export type EmploymentDocument = typeof employmentDocuments.$inferSelect;
export type EmploymentHistory = typeof employmentHistory.$inferSelect;
export type InsertEmployeeOfferLetter = z.infer<typeof insertEmployeeOfferLetterSchema>;
export type EmployeeOfferLetter = typeof employeeOfferLetters.$inferSelect;

// ============== VALIDATION SCHEMAS ==============

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export const applicationFormSchema = z.object({
  programId: z.string().min(1, "Please select a program"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  highestQualification: z.string().min(1, "Qualification is required"),
  institution: z.string().min(1, "Institution is required"),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.number().optional(),
  cgpa: z.string().optional(),
  currentStatus: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
  collegeIdUrl: z.string().optional(),
  bonafideCertificateUrl: z.string().optional(),
  governmentIdUrl: z.string().optional(),
  marksheetUrl: z.string().optional(),
  panCardUrl: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;
