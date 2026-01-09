import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import type { Certificate, OfferLetter, Employee } from "@shared/schema";

const COMPANY_NAME = "VERIDANT AI SOLUTION PRIVATE LTD";
const COMPANY_ADDRESS = "Shivam Vihar Colony, Beur, Phulwari, Patna-800002, Bihar, India";
const COMPANY_WEBSITE = "www.veridantai.in";
const COMPANY_EMAIL = "hr@veridantai.in";
const COMPANY_PHONE = "+91-8550970101";
const COMPANY_CIN = "U62099BR2025PTC079060";

// Get logo path
const LOGO_PATH = path.join(process.cwd(), "attached_assets", "2nd_logo_highres_1767216390338.png");
const SIGNATURE_PATH = path.join(process.cwd(), "attached_assets", "image_1767954911326.png");

export async function generateCertificatePDF(certificate: Certificate, baseUrl: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const verificationUrl = `${baseUrl}/verify/${certificate.verificationToken}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 100 });

      // Border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(3)
         .stroke("#0EA5E9");
      
      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
         .lineWidth(1)
         .stroke("#64748B");

      // Logo
      if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 60, 50, { width: 60 });
      }

      // Header
      doc.fontSize(14)
         .fillColor("#64748B")
         .text("Veridant", 130, 65, { continued: true })
         .fillColor("#0EA5E9")
         .text("AI", { continued: false });

      doc.fontSize(36)
         .fillColor("#1e293b")
         .text("CERTIFICATE", 0, 120, { align: "center" });
      
      doc.moveDown(0.3);
      doc.fontSize(18)
         .fillColor("#64748B")
         .text(`OF ${certificate.certificateType?.toUpperCase() || "COMPLETION"}`, { align: "center" });

      doc.moveDown(1);
      doc.fontSize(14)
         .fillColor("#475569")
         .text("This is to certify that", { align: "center" });

      doc.moveDown(0.5);
      doc.fontSize(28)
         .fillColor("#0EA5E9")
         .text(certificate.recipientName, { align: "center" });

      doc.moveDown(0.5);
      doc.fontSize(14)
         .fillColor("#475569")
         .text("has successfully completed the", { align: "center" });

      doc.moveDown(0.5);
      doc.fontSize(20)
         .fillColor("#1e293b")
         .text(certificate.programTitle, { align: "center" });

      if (certificate.grade) {
        doc.moveDown(0.5);
        doc.fontSize(14)
           .fillColor("#475569")
           .text(`with Grade: ${certificate.grade}`, { align: "center" });
      }

      if (certificate.validFrom && certificate.validTo) {
        doc.moveDown(0.5);
        doc.fontSize(12)
           .fillColor("#64748B")
           .text(`Duration: ${new Date(certificate.validFrom).toLocaleDateString()} - ${new Date(certificate.validTo).toLocaleDateString()}`, { align: "center" });
      }

      // Issue date
      doc.moveDown(1.5);
      doc.fontSize(12)
         .fillColor("#475569")
         .text(`Issued on: ${new Date(certificate.issueDate || new Date()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, { align: "center" });

      // Certificate number
      doc.fontSize(10)
         .fillColor("#94a3b8")
         .text(`Certificate No: ${certificate.certificateNumber}`, { align: "center" });

      // QR Code
      const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 80 });
      
      doc.fontSize(8)
         .fillColor("#64748B")
         .text("Scan to verify", doc.page.width - 150, doc.page.height - 65, { width: 80, align: "center" });

      // Footer
      doc.fontSize(10)
         .fillColor("#64748B")
         .text(COMPANY_NAME, 60, doc.page.height - 80);
      
      doc.fontSize(8)
         .fillColor("#94a3b8")
         .text(COMPANY_WEBSITE, 60, doc.page.height - 65);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

interface ApplicationDetails {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  institution?: string;
  fieldOfStudy?: string;
}

export async function generateOfferLetterPDF(offerLetter: OfferLetter, baseUrl: string, applicationDetails?: ApplicationDetails): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const verificationUrl = `${baseUrl}/verify/${offerLetter.verificationToken}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 80 });
      
      const startDate = offerLetter.startDate ? new Date(offerLetter.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "[Start Date]";
      const endDate = offerLetter.endDate ? new Date(offerLetter.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "[End Date]";
      const currentDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

      // ============ PAGE 1 ============
      // Logo and Header
      if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, (doc.page.width - 80) / 2, 40, { width: 80 });
      }

      doc.fontSize(16)
         .fillColor("#0EA5E9")
         .text(COMPANY_NAME, 0, 130, { align: "center" });
      
      doc.fontSize(9)
         .fillColor("#64748B")
         .text(`Corporate Office: ${COMPANY_ADDRESS}`, { align: "center" })
         .text(`Website: ${COMPANY_WEBSITE} | Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`, { align: "center" });

      doc.moveDown(1.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e2e8f0");
      doc.moveDown(1);

      // Date
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`Date: ${currentDate}`, 50);
      doc.moveDown(1);

      // Recipient Address
      const internAddress = applicationDetails?.address || "";
      const internCity = applicationDetails?.city || "";
      const internState = applicationDetails?.state || "";
      const internPincode = applicationDetails?.pincode || "";
      const fullAddress = [internAddress, internCity, internState, internPincode].filter(Boolean).join(", ") || "[Address not provided]";
      
      doc.fontSize(10)
         .fillColor("#1e293b")
         .text(offerLetter.recipientName)
         .text(fullAddress);
      doc.moveDown(1);

      // Subject
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Re: Unpaid Internship Offer", { underline: true });
      doc.moveDown(1);

      // Opening
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`Dear ${offerLetter.recipientName},`);
      doc.moveDown(0.5);

      doc.text(
        `On behalf of ${COMPANY_NAME} (the "Company"), I am pleased to extend to you this offer for an unpaid internship position as a ${offerLetter.position}, reporting to ${offerLetter.reportingTo || "Program Coordinator"}. If you accept this offer, you will begin your internship with the Company on ${startDate} and will be expected to work 5 days per week, 6 hours per day.`,
        { align: "justify", lineGap: 3 }
      );
      doc.moveDown(1);

      // Nature of Internship
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Nature of Internship");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "This is an unpaid educational internship designed to provide you with practical learning experience, skill development, and exposure to real-world applications of artificial intelligence and technology in a professional business environment. This internship is intended primarily for your educational benefit and professional development.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Compensation
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Compensation");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "This is an unpaid internship position. You will not receive any monetary compensation, stipend, salary, or wages for your participation in this internship program. However, upon successful completion of the internship, you will receive:",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(0.5);

      const benefits = [
        "• Internship Completion Certificate (subject to satisfactory performance)",
        "• Letter of Recommendation (subject to exceptional performance)",
        "• Valuable hands-on experience in AI technology and software development",
        "• Mentorship and guidance from experienced professionals",
        "• Opportunity to work on real-world projects",
        "• Networking opportunities within the industry"
      ];
      benefits.forEach(benefit => {
        doc.text(benefit, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Employment Status
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Employment Status");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "As an unpaid intern, you are not considered an employee of the Company. You will not receive any employee benefits, including but not limited to health insurance, provident fund, vacation or sick pay, paid holidays, bonus, gratuity, or participation in the Company's employee benefit plans.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Duration
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Duration and Termination");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `Your internship is expected to last from ${startDate} to ${endDate}. This internship is voluntary and may be terminated by either you or the Company at any time, with or without cause and with or without notice. The Company may, at its sole discretion, extend your internship period based on performance and mutual agreement.`,
           { align: "justify", lineGap: 3 }
         );

      // ============ PAGE 2 ============
      doc.addPage();

      // Confidentiality
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Confidentiality and Proprietary Information");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "During your internship, you may have access to trade secrets, proprietary algorithms, source code, artificial intelligence models, research data, business strategies, client information, and other confidential business information belonging to the Company. By accepting this offer, you acknowledge that you must:",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(0.5);

      const confidentialityItems = [
        "• Keep all of this information strictly confidential during and after your internship",
        "• Refrain from using it for your own purposes or for any third party",
        "• Not disclose it to anyone outside the Company without prior written authorization",
        "• Not remove, copy, or transmit any Company data or documents without permission",
        "• Not discuss Company projects, technologies, or business matters on social media"
      ];
      confidentialityItems.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Intellectual Property
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Intellectual Property");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "You agree that all work product, inventions, discoveries, designs, code, documentation, algorithms, models, or any intellectual property created by you during your internship, whether during scheduled hours or otherwise, using Company resources or related to Company business, shall be the sole and exclusive property of Veridant AI Solution Private Ltd.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Learning Objectives
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Learning Objectives and Responsibilities");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("During your internship, you will:", { lineGap: 3 });
      doc.moveDown(0.5);

      const responsibilities = [
        "• Work on assigned projects related to AI development/machine learning/software development",
        "• Participate in team meetings, code reviews, and learning sessions",
        "• Assist in research, testing, and documentation activities",
        "• Complete assigned tasks within agreed timelines",
        "• Follow Company coding standards, best practices, and quality guidelines",
        "• Actively seek feedback and demonstrate willingness to learn"
      ];
      responsibilities.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Company Policies
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Company Policies");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("By accepting this offer, you agree that throughout your internship, you will:", { lineGap: 3 });
      doc.moveDown(0.5);

      const policies = [
        "• Observe all policies and practices governing the conduct of our business",
        "• Comply with our policies prohibiting discrimination, harassment, and workplace misconduct",
        "• Adhere to our Code of Conduct and professional standards",
        "• Follow all data security and information technology policies",
        "• Maintain professional behavior, punctuality, and regular communication"
      ];
      policies.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Documents Required
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Documents Required");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("Please submit the following documents on or before your joining date:", { lineGap: 3 });
      doc.moveDown(0.5);

      const documents = [
        "1. Signed copy of this offer letter",
        "2. Signed Non-Disclosure Agreement (NDA)",
        "3. Copy of valid government-issued photo ID (Aadhaar/PAN/Passport)",
        "4. Recent passport-sized photographs (2 copies)",
        "5. College ID card / Enrollment proof",
        "6. Educational certificates or transcripts"
      ];
      documents.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });

      // ============ PAGE 3 ============
      doc.addPage();

      // Governing Law
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Governing Law");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "This agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this internship shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1.5);

      // Closing
      doc.text(
        "We are excited about the opportunity to support your educational and professional development. We look forward to welcoming you to Veridant AI Solution Private Ltd and hope this internship will be a valuable learning experience.",
        { align: "justify", lineGap: 3 }
      );
      doc.moveDown(2);

      doc.text("Very truly yours,");
      doc.moveDown(0.5);
      
      // Add signature image
      if (fs.existsSync(SIGNATURE_PATH)) {
        doc.image(SIGNATURE_PATH, 50, doc.y, { width: 100 });
        doc.y += 50;
      } else {
        doc.moveDown(1.5);
      }
      
      doc.text("_____________________________");
      doc.text("Authorized Signatory");
      doc.text("Human Resources Department");
      doc.text(COMPANY_NAME);
      doc.text(`Email: ${COMPANY_EMAIL}`);

      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e2e8f0");
      doc.moveDown(1);

      // Acceptance Section
      doc.fontSize(12)
         .fillColor("#0EA5E9")
         .text("ACCEPTANCE OF OFFER", { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `I, ${offerLetter.recipientName}, accept the unpaid internship position with ${COMPANY_NAME} on the terms and conditions set out in this letter. I confirm that I have read, understood, and agree to all the terms mentioned above.`,
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1.5);

      doc.text("Printed Name: _________________________________");
      doc.moveDown(0.5);
      doc.text("Signature: _________________________________");
      doc.moveDown(0.5);
      doc.text("Date: _________________________________");
      doc.moveDown(0.5);
      const institution = applicationDetails?.institution || "[Institution Name]";
      const fieldOfStudy = applicationDetails?.fieldOfStudy || "[Program]";
      doc.text(`College/University: ${institution}`);
      doc.moveDown(0.5);
      doc.text(`Degree/Program: ${fieldOfStudy}`);

      // Calculate safe positioning within printable area (avoid margin boundaries)
      const printableBottom = doc.page.height - doc.page.margins.bottom;
      const qrY = printableBottom - 80;
      const footerY = printableBottom - 25;

      // QR Code and Verification - positioned at bottom left of page 3
      const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      doc.image(qrBuffer, 50, qrY, { width: 60 });
      
      // QR text positioned manually next to QR code
      doc.fontSize(8).fillColor("#64748B");
      doc.text(`Offer No: ${offerLetter.offerNumber}`, 120, qrY + 15, { lineBreak: false });
      doc.text("Scan QR code to verify", 120, qrY + 27, { lineBreak: false });

      // Footer - centered manually using widthOfString
      doc.fontSize(8).fillColor("#94a3b8");
      const companyText = COMPANY_NAME;
      const cinText = `CIN: ${COMPANY_CIN} | Website: ${COMPANY_WEBSITE}`;
      const companyTextWidth = doc.widthOfString(companyText);
      const cinTextWidth = doc.widthOfString(cinText);
      const pageCenter = doc.page.width / 2;
      
      doc.text(companyText, pageCenter - companyTextWidth / 2, footerY, { lineBreak: false });
      doc.text(cinText, pageCenter - cinTextWidth / 2, footerY + 12, { lineBreak: false });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateQRCode(data: string, size: number = 200): Promise<string> {
  return QRCode.toDataURL(data, { width: size });
}

interface EmployeeOfferDetails {
  offerNumber: string;
  verificationToken: string;
  employee: Employee;
  salary?: string;
  probationPeriod?: string;
  noticePeriod?: string;
  workingHours?: string;
  workingDays?: string;
  reportingManager?: string;
  reportingManagerPhone?: string;
  reportingTime?: string;
  acceptanceDeadline?: string;
  paidLeave?: string;
  sickLeave?: string;
  casualLeave?: string;
  publicHolidays?: string;
}

export async function generateEmployeeOfferLetterPDF(details: EmployeeOfferDetails, baseUrl: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const { employee, offerNumber, verificationToken } = details;
      const verificationUrl = `${baseUrl}/verify/${verificationToken}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 80 });
      
      const joiningDate = employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "[Joining Date]";
      const currentDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      const salaryDisplay = details.salary || (employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : "[To be discussed]");
      const probationPeriod = details.probationPeriod || "3 months";
      const noticePeriod = details.noticePeriod || "30 days";
      const workingHours = details.workingHours || "9:30 AM to 6:30 PM";
      const workingDays = details.workingDays || "Monday to Friday";
      const reportingManager = details.reportingManager || "HR Department";
      const reportingManagerPhone = details.reportingManagerPhone || COMPANY_PHONE;
      const reportingTime = details.reportingTime || "9:30 AM";
      const paidLeave = details.paidLeave || "18 days per year";
      const sickLeave = details.sickLeave || "12 days per year";
      const casualLeave = details.casualLeave || "6 days per year";
      const publicHolidays = details.publicHolidays || "As per Government of India calendar";
      
      // Calculate acceptance deadline (14 days from current date)
      const acceptanceDate = new Date();
      acceptanceDate.setDate(acceptanceDate.getDate() + 14);
      const acceptanceDeadline = details.acceptanceDeadline || acceptanceDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

      // ============ PAGE 1 ============
      // Logo and Header
      if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, (doc.page.width - 80) / 2, 40, { width: 80 });
      }

      doc.fontSize(16)
         .fillColor("#0EA5E9")
         .text(COMPANY_NAME, 0, 130, { align: "center" });
      
      doc.fontSize(9)
         .fillColor("#64748B")
         .text(`Corporate Office: ${COMPANY_ADDRESS}`, { align: "center" })
         .text(`Website: ${COMPANY_WEBSITE} | Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`, { align: "center" });

      doc.moveDown(1.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e2e8f0");
      doc.moveDown(1);

      // Date and Offer Number
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`Date: ${currentDate}`, 50)
         .text(`Offer Number: ${offerNumber}`);
      doc.moveDown(1);

      // Recipient Address with Phone
      const fullAddress = [employee.address, employee.city, employee.state, employee.pincode].filter(Boolean).join(", ");
      
      doc.fontSize(10)
         .fillColor("#1e293b")
         .text(`${employee.firstName} ${employee.lastName}`)
         .text(fullAddress || "[Address to be updated]")
         .text(`Contact: ${employee.phone || "[Phone not provided]"}`);
      doc.moveDown(1);

      // Subject
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("Subject: Employment Offer Letter", { underline: true });
      doc.moveDown(1);

      // Opening
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`Dear ${employee.firstName} ${employee.lastName},`);
      doc.moveDown(0.5);

      doc.text(
        `On behalf of ${COMPANY_NAME} (the "Company"), we are pleased to extend to you this offer of employment for the position of ${employee.designation} in our ${employee.department} department. Your employment with the Company will commence on ${joiningDate}.`,
        { align: "justify", lineGap: 3 }
      );
      doc.moveDown(1);

      // Position Details
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("1. Position Details");
      doc.fontSize(10)
         .fillColor("#374151");
      
      const positionDetails = [
        `• Designation: ${employee.designation}`,
        `• Department: ${employee.department}`,
        `• Employment Type: ${employee.employmentType?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Full Time"}`,
        `• Joining Date: ${joiningDate}`,
        `• Reporting To: ${reportingManager}`,
        `• Reporting Location: ${COMPANY_ADDRESS}`
      ];
      positionDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Roles & Responsibilities
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("2. Roles & Responsibilities");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `As ${employee.designation} in the ${employee.department} department, your key responsibilities will include:`,
           { lineGap: 3 }
         );
      doc.moveDown(0.5);

      const responsibilities = getResponsibilitiesForRole(employee.designation, employee.department);
      responsibilities.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(0.5);
      doc.text(
        "Your detailed job description and key performance indicators will be discussed during your onboarding.",
        { lineGap: 3, indent: 20 }
      );
      doc.moveDown(1);

      // Compensation
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("3. Compensation & Benefits");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "Your compensation package includes the following:",
           { lineGap: 3 }
         );
      doc.moveDown(0.5);

      const compensationDetails = [
        `• Monthly Salary: ${salaryDisplay} (Cost to Company)`,
        "• Salary will be credited to your designated bank account on the last working day of each month",
        "• Provident Fund contribution as per statutory requirements (12% employer + 12% employee)",
        "• Professional Tax deductions as applicable",
        "• Gratuity as per the Payment of Gratuity Act, 1972"
      ];
      compensationDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });

      // ============ PAGE 2 ============
      doc.addPage();

      // Working Hours & Schedule
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("4. Working Hours & Schedule");
      doc.fontSize(10)
         .fillColor("#374151");
      
      const workingDetails = [
        `• Standard Working Hours: ${workingHours}`,
        `• Working Days: ${workingDays}`,
        "• Lunch Break: 1 hour (typically 1:00 PM - 2:00 PM)",
        "• Overtime Policy: Any overtime work must be pre-approved by your reporting manager. Compensatory time-off may be granted as per company policy.",
        "• Work from Home: As per company policy and manager discretion"
      ];
      workingDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Leave Policy
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("5. Leave Policy");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("You are entitled to the following leaves:", { lineGap: 3 });
      doc.moveDown(0.5);

      const leaveDetails = [
        `• Earned/Paid Leave: ${paidLeave} (accrues monthly, encashable up to 50%)`,
        `• Sick Leave: ${sickLeave} (requires medical certificate for 3+ consecutive days)`,
        `• Casual Leave: ${casualLeave}`,
        `• Public Holidays: ${publicHolidays}`,
        "• Maternity Leave: 26 weeks as per Maternity Benefit Act, 1961",
        "• Paternity Leave: 7 days",
        "• Bereavement Leave: 5 days for immediate family",
        "• Marriage Leave: 5 days (one-time)"
      ];
      leaveDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Probation Period
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("6. Probation Period");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `You will be on probation for a period of ${probationPeriod} from your date of joining. During the probation period, either party may terminate the employment with 7 days' written notice. Upon successful completion of probation based on performance evaluation, you will be confirmed as a permanent employee of the Company.`,
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Notice Period
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("7. Notice Period");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `After confirmation, either party may terminate the employment by providing ${noticePeriod} written notice. The Company reserves the right to accept payment in lieu of notice period or waive the notice period at its discretion. Failure to serve the complete notice period may result in recovery of salary for the shortfall period.`,
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Confidentiality
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("8. Confidentiality & Non-Disclosure");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "During your employment and for a period of 2 years thereafter, you agree to maintain strict confidentiality regarding all proprietary information, trade secrets, business strategies, client information, source code, algorithms, and any other confidential information belonging to the Company. You will be required to sign a separate Non-Disclosure Agreement (NDA) on your joining date.",
           { align: "justify", lineGap: 3 }
         );

      // ============ PAGE 3 ============
      doc.addPage();

      // Intellectual Property
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("9. Intellectual Property");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "All work product, inventions, discoveries, designs, code, documentation, and intellectual property created by you during your employment shall be the sole and exclusive property of the Company. You agree to assign all rights, title, and interest in such intellectual property to the Company.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Non-Compete & Non-Solicitation
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("10. Non-Compete & Non-Solicitation");
      doc.fontSize(10)
         .fillColor("#374151");
      
      const nonCompeteDetails = [
        "• During employment and for 12 months after, you shall not directly or indirectly engage in any business that competes with the Company within India.",
        "• You shall not solicit or attempt to solicit any employee, consultant, or contractor of the Company.",
        "• You shall not solicit or attempt to solicit any client or customer of the Company for a period of 12 months after termination."
      ];
      nonCompeteDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2, align: "justify" });
      });
      doc.moveDown(1);

      // Background Verification
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("11. Background Verification");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "This offer is contingent upon successful completion of background verification, which may include verification of educational credentials, previous employment history, criminal background check, and reference checks. Falsification of any information provided may result in immediate termination of employment.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Company Policies
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("12. Company Policies & Code of Conduct");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("As an employee, you are expected to:", { lineGap: 3 });
      doc.moveDown(0.5);

      const policies = [
        "• Adhere to all company policies, procedures, and code of conduct",
        "• Maintain professional behavior and integrity at all times",
        "• Follow data security and information technology policies",
        "• Comply with all applicable laws and regulations",
        "• Report any conflicts of interest or unethical behavior"
      ];
      policies.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });

      // ============ PAGE 4 ============
      doc.addPage();

      // Documents Required
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("13. Documents Required");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("Please submit the following documents on or before your joining date:", { lineGap: 3 });
      doc.moveDown(0.5);

      const documents = [
        "1. Signed copy of this offer letter",
        "2. Aadhaar Card (original for verification, photocopy to submit)",
        "3. PAN Card copy",
        "4. Recent passport-sized photographs (4 copies)",
        "5. Educational certificates and mark sheets (all degrees)",
        "6. Previous employment relieving letter (if applicable)",
        "7. Experience certificates from previous employers (if applicable)",
        "8. Last 3 months' salary slips (if applicable)",
        "9. Bank account details (cancelled cheque or passbook front page)",
        "10. Address proof (Utility bill / Rental agreement)",
        "11. Passport copy (if available)"
      ];
      documents.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // First Day Instructions
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("14. First Day Instructions");
      doc.fontSize(10)
         .fillColor("#374151");
      
      const firstDayDetails = [
        `• Reporting Date: ${joiningDate}`,
        `• Reporting Time: ${reportingTime}`,
        `• Report To: ${reportingManager}`,
        `• Contact Number: ${reportingManagerPhone}`,
        `• Location: ${COMPANY_ADDRESS}`,
        "• What to Bring: All documents listed above, original certificates for verification, and a valid photo ID"
      ];
      firstDayDetails.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1);

      // Governing Law
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("15. Governing Law");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           "This offer letter and your employment shall be governed by the laws of India. Any disputes arising out of or in connection with this employment shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar.",
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      // Acceptance Deadline
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("16. Acceptance Deadline");
      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `Please sign and return a copy of this offer letter by ${acceptanceDeadline} to confirm your acceptance. Failure to respond by this date may result in this offer being withdrawn. If you have any questions, please contact HR at ${COMPANY_EMAIL} or ${COMPANY_PHONE}.`,
           { align: "justify", lineGap: 3 }
         );

      // ============ PAGE 5 ============
      doc.addPage();

      // Additional Agreements
      doc.fontSize(11)
         .fillColor("#0EA5E9")
         .text("17. Additional Agreements");
      doc.fontSize(10)
         .fillColor("#374151")
         .text("On your joining date, you will be required to sign the following additional agreements:", { lineGap: 3 });
      doc.moveDown(0.5);

      const agreements = [
        "• Non-Disclosure Agreement (NDA)",
        "• Invention Assignment Agreement",
        "• Code of Conduct Acknowledgement",
        "• IT Security Policy Acknowledgement",
        "• Anti-Harassment Policy Acknowledgement"
      ];
      agreements.forEach(item => {
        doc.text(item, { indent: 20, lineGap: 2 });
      });
      doc.moveDown(1.5);

      // Closing
      doc.text(
        "We are excited to welcome you to the Veridant AI family. We believe your skills and experience will be valuable additions to our team. Should you have any questions regarding this offer, please do not hesitate to contact our HR department.",
        { align: "justify", lineGap: 3 }
      );
      doc.moveDown(1.5);

      doc.text("Yours sincerely,");
      doc.moveDown(0.5);
      
      // Add signature image
      if (fs.existsSync(SIGNATURE_PATH)) {
        doc.image(SIGNATURE_PATH, 50, doc.y, { width: 100 });
        doc.y += 50;
      } else {
        doc.moveDown(1.5);
      }
      
      doc.text("_____________________________");
      doc.text("Authorized Signatory");
      doc.text("Human Resources Department");
      doc.text(COMPANY_NAME);
      doc.text(`Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`);

      doc.moveDown(1.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e2e8f0");
      doc.moveDown(1);

      // Acceptance Section
      doc.fontSize(12)
         .fillColor("#0EA5E9")
         .text("ACCEPTANCE OF OFFER", { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(10)
         .fillColor("#374151")
         .text(
           `I, ${employee.firstName} ${employee.lastName}, hereby accept the employment offer from ${COMPANY_NAME} on the terms and conditions set out in this letter. I confirm that I have read, understood, and agree to all the terms mentioned above. I understand that this offer is contingent upon successful background verification.`,
           { align: "justify", lineGap: 3 }
         );
      doc.moveDown(1);

      doc.text("Printed Name: _________________________________");
      doc.moveDown(0.5);
      doc.text("Signature: _________________________________");
      doc.moveDown(0.5);
      doc.text("Date: _________________________________");
      doc.moveDown(0.5);
      doc.text("Place: _________________________________");

      // Calculate safe positioning within printable area
      const printableBottom = doc.page.height - doc.page.margins.bottom;
      const qrY = printableBottom - 80;
      const footerY = printableBottom - 25;

      // QR Code and Verification
      const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      doc.image(qrBuffer, 50, qrY, { width: 60 });
      
      doc.fontSize(8).fillColor("#64748B");
      doc.text(`Offer No: ${offerNumber}`, 120, qrY + 15, { lineBreak: false });
      doc.text("Scan QR code to verify", 120, qrY + 27, { lineBreak: false });

      // Footer
      doc.fontSize(8).fillColor("#94a3b8");
      const companyText = COMPANY_NAME;
      const cinText = `CIN: ${COMPANY_CIN} | Website: ${COMPANY_WEBSITE}`;
      const companyTextWidth = doc.widthOfString(companyText);
      const cinTextWidth = doc.widthOfString(cinText);
      const pageCenter = doc.page.width / 2;
      
      doc.text(companyText, pageCenter - companyTextWidth / 2, footerY, { lineBreak: false });
      doc.text(cinText, pageCenter - cinTextWidth / 2, footerY + 12, { lineBreak: false });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to get role-specific responsibilities
function getResponsibilitiesForRole(designation: string, department: string): string[] {
  const designationLower = designation.toLowerCase();
  const departmentLower = department.toLowerCase();
  
  if (designationLower.includes("consultant") || designationLower.includes("associate")) {
    return [
      "• Collaborate with cross-functional teams to deliver client projects on time",
      "• Analyze business requirements and propose technical solutions",
      "• Prepare project documentation, reports, and presentations",
      "• Participate in client meetings and stakeholder communications",
      "• Support senior team members in project planning and execution",
      "• Maintain project timelines and ensure quality deliverables"
    ];
  }
  
  if (departmentLower.includes("engineering") || designationLower.includes("developer") || designationLower.includes("engineer")) {
    return [
      "• Design, develop, and maintain software applications and systems",
      "• Write clean, efficient, and well-documented code",
      "• Participate in code reviews and maintain coding standards",
      "• Collaborate with product and design teams on feature development",
      "• Debug and resolve technical issues in a timely manner",
      "• Stay updated with latest technologies and best practices"
    ];
  }
  
  if (departmentLower.includes("finance") || designationLower.includes("accountant")) {
    return [
      "• Prepare and maintain financial statements and reports",
      "• Handle accounts payable and receivable processes",
      "• Ensure compliance with tax regulations and statutory requirements",
      "• Support budgeting, forecasting, and financial planning activities",
      "• Maintain accurate financial records and documentation",
      "• Assist in internal and external audit processes"
    ];
  }
  
  if (departmentLower.includes("hr") || designationLower.includes("human")) {
    return [
      "• Support recruitment, onboarding, and employee lifecycle management",
      "• Maintain employee records and HR documentation",
      "• Coordinate training and development programs",
      "• Handle employee queries and support HR operations",
      "• Assist in performance management processes",
      "• Ensure compliance with labor laws and company policies"
    ];
  }
  
  // Default responsibilities
  return [
    "• Perform duties as assigned by the reporting manager",
    "• Collaborate with team members to achieve departmental goals",
    "• Maintain documentation and reports as required",
    "• Participate in team meetings and planning sessions",
    "• Support cross-functional initiatives as needed",
    "• Continuously improve skills and knowledge relevant to the role"
  ];
}
