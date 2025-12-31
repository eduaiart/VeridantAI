import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import type { Certificate, OfferLetter } from "@shared/schema";

const COMPANY_NAME = "VeridantAI Solution Private Limited";
const COMPANY_ADDRESS = "Shivam Vihar Colony, Beur, Phulwari, Patna-800002, Bihar, India";
const COMPANY_WEBSITE = "www.veridantai.in";
const COMPANY_EMAIL = "info@veridantai.in";

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

      // Header
      doc.fontSize(14)
         .fillColor("#64748B")
         .text("Veridant", 60, 60, { continued: true })
         .fillColor("#0EA5E9")
         .text("AI", { continued: false });

      doc.fontSize(36)
         .fillColor("#1e293b")
         .text("CERTIFICATE", { align: "center" });
      
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

export async function generateOfferLetterPDF(offerLetter: OfferLetter, baseUrl: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 60, bottom: 60, left: 60, right: 60 }
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const verificationUrl = `${baseUrl}/verify/${offerLetter.verificationToken}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 80 });

      // Header
      doc.fontSize(18)
         .fillColor("#64748B")
         .text("Veridant", { continued: true })
         .fillColor("#0EA5E9")
         .text("AI");
      
      doc.fontSize(10)
         .fillColor("#64748B")
         .text(COMPANY_NAME);
      
      doc.fontSize(9)
         .fillColor("#94a3b8")
         .text(COMPANY_ADDRESS)
         .text(`Email: ${COMPANY_EMAIL} | Website: ${COMPANY_WEBSITE}`);

      doc.moveDown(2);
      doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).stroke("#e2e8f0");
      doc.moveDown(1);

      // Date and Reference
      doc.fontSize(10)
         .fillColor("#475569")
         .text(`Date: ${new Date(offerLetter.createdAt || new Date()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`);
      
      doc.text(`Ref: ${offerLetter.offerNumber}`);
      doc.moveDown(1.5);

      // Recipient
      doc.fontSize(11)
         .fillColor("#1e293b")
         .text(`Dear ${offerLetter.recipientName},`);
      doc.moveDown(1);

      // Subject
      doc.fontSize(12)
         .fillColor("#0EA5E9")
         .text(`Subject: Offer of Internship - ${offerLetter.position}`, { underline: true });
      doc.moveDown(1);

      // Body
      doc.fontSize(11)
         .fillColor("#374151")
         .text(`We are pleased to offer you the position of ${offerLetter.position} at VeridantAI Solution Private Limited.`, { lineGap: 4 });
      
      doc.moveDown(0.5);
      doc.text("The details of your internship are as follows:", { lineGap: 4 });
      doc.moveDown(0.5);

      // Details table
      const details = [
        ["Position", offerLetter.position],
        ["Department", offerLetter.department || "Engineering"],
        ["Stipend", offerLetter.stipend || "As per company policy"],
        ["Start Date", offerLetter.startDate ? new Date(offerLetter.startDate).toLocaleDateString("en-IN") : "To be communicated"],
        ["End Date", offerLetter.endDate ? new Date(offerLetter.endDate).toLocaleDateString("en-IN") : "To be communicated"],
        ["Location", offerLetter.location || "Remote"],
        ["Reporting To", offerLetter.reportingTo || "Program Mentor"],
      ];

      details.forEach(([label, value]) => {
        doc.fontSize(10)
           .fillColor("#64748B")
           .text(`${label}: `, { continued: true })
           .fillColor("#1e293b")
           .text(String(value));
      });

      doc.moveDown(1);
      doc.fontSize(11)
         .fillColor("#374151")
         .text("Please confirm your acceptance of this offer by the date mentioned below. We look forward to welcoming you to the VeridantAI team.", { lineGap: 4 });

      if (offerLetter.expiresAt) {
        doc.moveDown(0.5);
        doc.fontSize(10)
           .fillColor("#dc2626")
           .text(`This offer is valid until: ${new Date(offerLetter.expiresAt).toLocaleDateString("en-IN")}`);
      }

      doc.moveDown(2);
      doc.fontSize(11)
         .fillColor("#374151")
         .text("Best regards,");
      doc.moveDown(0.5);
      doc.text("HR Department");
      doc.text(COMPANY_NAME);

      // QR Code at bottom
      const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      doc.image(qrBuffer, doc.page.width - 140, doc.page.height - 140, { width: 70 });
      
      doc.fontSize(7)
         .fillColor("#64748B")
         .text("Scan to verify", doc.page.width - 140, doc.page.height - 65, { width: 70, align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateQRCode(data: string, size: number = 200): Promise<string> {
  return QRCode.toDataURL(data, { width: size });
}
