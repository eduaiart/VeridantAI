import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import type { Certificate, OfferLetter } from "@shared/schema";

const COMPANY_NAME = "VERIDANT AI SOLUTION PRIVATE LTD";
const COMPANY_ADDRESS = "Shivam Vihar Colony, Beur, Phulwari, Patna-800002, Bihar, India";
const COMPANY_WEBSITE = "www.veridantai.in";
const COMPANY_EMAIL = "hr@veridantai.in";
const COMPANY_PHONE = "+91-8550970101";
const COMPANY_CIN = "U62099BR2025PTC079060";

// Get logo path
const LOGO_PATH = path.join(process.cwd(), "attached_assets", "2nd_logo_highres_1767216390338.png");

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
      doc.moveDown(2);
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
