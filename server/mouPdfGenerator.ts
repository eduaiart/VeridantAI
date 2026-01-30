import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { CollegeMou } from "@shared/schema";

const LOGO_PATH = path.join(
   process.cwd(),
   "attached_assets",
   "2nd_logo_highres_1767216390338.png"
);
const COMPANY_NAME = "Veridant AI Private Limited";
const COMPANY_CIN = "U62099BR2025PTC079060";
const COMPANY_ADDRESS = "Shivam Vihar Colony, Beur, Phulwari, Patna-800002, Bihar, India";
const COMPANY_WEBSITE = "www.veridantai.in";
const COMPANY_EMAIL = "info@veridantai.in";
const COMPANY_PHONE = "+91-8550970101";

export async function generateMouPDF(
   mou: CollegeMou,
   baseUrl: string
): Promise<Buffer> {
   return new Promise(async (resolve, reject) => {
      try {
         const doc = new PDFDocument({
            size: "A4",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
         });

         const chunks: Buffer[] = [];
         doc.on("data", (chunk) => chunks.push(chunk));
         doc.on("end", () => resolve(Buffer.concat(chunks)));
         doc.on("error", reject);

         const verificationUrl = `${baseUrl}/verify/${mou.verificationToken}`;
         const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 80 });

         const formatDate = (date: Date | null) => {
            if (!date) return "__________ (Date)";
            return new Date(date).toLocaleDateString("en-IN", {
               day: "numeric",
               month: "long",
               year: "numeric",
            });
         };

         const currentDate = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
         });

         // ============ PAGE 1 ============
         // Logo and Header (same style as Offer Letter)
         if (fs.existsSync(LOGO_PATH)) {
            doc.image(LOGO_PATH, (doc.page.width - 80) / 2, 40, { width: 80 });
         }

         doc.fontSize(16)
            .fillColor("#0EA5E9")
            .text(COMPANY_NAME, 0, 130, { align: "center" });

         doc.fontSize(9)
            .fillColor("#64748B")
            .text(`Corporate Office: ${COMPANY_ADDRESS}`, { align: "center" })
            .text(
               `Website: ${COMPANY_WEBSITE} | Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`,
               { align: "center" }
            );

         doc.moveDown(1.5);
         doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#e2e8f0");
         doc.moveDown(0.8);

         // Title
         doc.fontSize(14)
            .fillColor("#1e293b")
            .text("MEMORANDUM OF UNDERSTANDING", { align: "center" });
         doc.fontSize(10)
            .fillColor("#64748B")
            .text("Student Career Support & Placement Assistance Partnership", { align: "center" });
         doc.moveDown(0.8);

         // Date and Reference
         doc.fontSize(10)
            .fillColor("#374151")
            .text(`Date: ${formatDate(mou.signedDate)}`, 50)
            .text(`Reference: ${mou.mouNumber}`);
         doc.moveDown(1);

         // Parties
         doc.fontSize(10).fillColor("#374151").text("This MoU is entered between:");
         doc.moveDown(0.5);

         doc.fontSize(11).fillColor("#0EA5E9").text("FIRST PARTY:");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(`${COMPANY_NAME} ("RequireHire")`, { indent: 20 })
            .text(`CIN: ${COMPANY_CIN}`, { indent: 20 })
            .text("Patna, Bihar, India", { indent: 20 });
         doc.moveDown(0.5);

         doc.fontSize(11).fillColor("#0EA5E9").text("SECOND PARTY:");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(`${mou.collegeName} ("Institution")`, { indent: 20 });

         const collegeAddress = [
            mou.collegeAddress,
            mou.collegeCity,
            mou.collegeState,
            mou.collegePincode
         ].filter(Boolean).join(", ");
         if (collegeAddress) {
            doc.text(`Address: ${collegeAddress}`, { indent: 20 });
         }
         doc.moveDown(1);

         // Section 1: PURPOSE
         doc.fontSize(11).fillColor("#0EA5E9").text("1. PURPOSE");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "RequireHire is India's Interview-First Recruitment Platform that helps students get interviewed directly by companies. This MoU establishes a partnership to provide career support tools and placement assistance to the Institution's students.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 2: BENEFITS FOR STUDENTS
         doc.fontSize(11).fillColor("#0EA5E9").text("2. BENEFITS FOR STUDENTS");
         doc.fontSize(10).fillColor("#374151");
         const studentBenefits = [
            "• AI-Powered Mock Interviews - Practice with AI interviewer, get instant feedback",
            "• AI Resume Builder - Create professional resumes with AI assistance",
            "• AI Resume Checker - Get instant feedback and improve resume score",
            "• AI Cover Letter Generator - Create personalized cover letters for each job",
            "• AI Interview Preparation - Practice questions tailored for Indian job market",
            "• AI Skill Scores & Verified Profile Badge - Stand out to employers",
            "• Actual Company Interviews - If shortlisted in AI interview (first round), companies will connect directly and proceed with next rounds of interview",
         ];
         studentBenefits.forEach((item) => {
            doc.text(item, { indent: 20, lineGap: 2 });
         });
         doc.moveDown(0.8);

         // Section 3: BENEFITS FOR INSTITUTION
         doc.fontSize(11).fillColor("#0EA5E9").text("3. BENEFITS FOR INSTITUTION");
         doc.fontSize(10).fillColor("#374151");
         const institutionBenefits = [
            "• Enhanced placement support for students",
            "• AI-powered pre-screening before placement drives",
            "• Interview-ready students with verified skill scores",
            "• Access to RequireHire's employer network for campus placements",
         ];
         institutionBenefits.forEach((item) => {
            doc.text(item, { indent: 20, lineGap: 2 });
         });
         doc.moveDown(0.8);

         // Section 4: TERM
         doc.fontSize(11).fillColor("#0EA5E9").text("4. TERM");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "This MoU is valid for 3 years from the date of signing. Either party may terminate with 60 days written notice. RequireHire may terminate immediately for material breach.",
               { align: "justify", lineGap: 3 }
            );

         // ============ PAGE 2 ============
         doc.addPage();

         // Section 5: INSTITUTION RESPONSIBILITIES
         doc.fontSize(11).fillColor("#0EA5E9").text("5. INSTITUTION RESPONSIBILITIES");
         doc.fontSize(10).fillColor("#374151");
         const institutionResp = [
            "• Designate a TPO/SPOC for coordination",
            "• Promote the platform among eligible students",
            "• Provide venue/infrastructure for workshops (if conducted)",
            "• NOT share platform access with other institutions or third parties",
            "• NOT reverse engineer, copy, or replicate any part of the platform",
         ];
         institutionResp.forEach((item) => {
            doc.text(item, { indent: 20, lineGap: 2 });
         });
         doc.moveDown(0.8);

         // Section 6: INTELLECTUAL PROPERTY
         doc.fontSize(11).fillColor("#0EA5E9").text("6. INTELLECTUAL PROPERTY");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "All IP rights (software, algorithms, AI models, databases, trademarks) remain the exclusive property of RequireHire. This MoU grants NO ownership or license to the Institution. Any feedback provided becomes RequireHire's property.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 7: DATA & PRIVACY
         doc.fontSize(11).fillColor("#0EA5E9").text("7. DATA & PRIVACY");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "Student data is collected directly by RequireHire with individual consent per DPDPA 2023. We share anonymized interview results with employers - never personal details without candidate consent. Institution has no access to student data unless authorized.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 8: CONFIDENTIALITY
         doc.fontSize(11).fillColor("#0EA5E9").text("8. CONFIDENTIALITY");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "Institution shall keep confidential all business strategies, pricing, algorithms, employer information, and proprietary data. This obligation survives for 5 years after termination.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 9: DISCLAIMERS
         doc.fontSize(11).fillColor("#0EA5E9").text("9. DISCLAIMERS");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               'Platform provided "AS IS". RequireHire does NOT guarantee employment, job offers, or placement for any student. Services are supplementary to Institution\'s own placement efforts.',
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 10: INDEMNIFICATION
         doc.fontSize(11).fillColor("#0EA5E9").text("10. INDEMNIFICATION");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "Institution shall indemnify RequireHire against all claims arising from breach of this MoU, misrepresentation of student credentials, unauthorized platform use, or claims by students/third parties.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 11: NON-EXCLUSIVITY
         doc.fontSize(11).fillColor("#0EA5E9").text("11. NON-EXCLUSIVITY");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "This MoU is non-exclusive. RequireHire may partner with other institutions. Institution may use other recruitment platforms.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 12: NO FINANCIAL OBLIGATION
         doc.fontSize(11).fillColor("#0EA5E9").text("12. NO FINANCIAL OBLIGATION");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "This is a non-commercial partnership. Neither party has financial obligations unless separately agreed in writing. Institution shall NOT charge students for platform access.",
               { align: "justify", lineGap: 3 }
            );

         // ============ PAGE 3 ============
         doc.addPage();

         // Section 13: LOGO & NAME USAGE
         doc.fontSize(11).fillColor("#0EA5E9").text("13. LOGO & NAME USAGE");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "RequireHire may use the Institution's name and logo on its company website, marketing materials, and promotional content to showcase the partnership. Such use shall be limited to factual representation of the partnership.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(0.8);

         // Section 14: GOVERNING LAW & DISPUTES
         doc.fontSize(11).fillColor("#0EA5E9").text("14. GOVERNING LAW & DISPUTES");
         doc.fontSize(10)
            .fillColor("#374151")
            .text(
               "Governed by laws of India. Disputes to be resolved by arbitration in Patna, Bihar under Arbitration and Conciliation Act, 1996. Courts at Patna shall have exclusive jurisdiction.",
               { align: "justify", lineGap: 3 }
            );
         doc.moveDown(1.5);

         // Separator line
         doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#e2e8f0");
         doc.moveDown(1);

         // SIGNATURES SECTION
         doc.fontSize(12)
            .fillColor("#0EA5E9")
            .text("AGREED AND ACCEPTED", { align: "center" });
         doc.moveDown(1);

         // Two-column signature layout
         const leftCol = 50;
         const rightCol = doc.page.width / 2 + 20;
         const currentY = doc.y;

         // Left column - RequireHire
         doc.fontSize(11).fillColor("#0EA5E9").text("For RequireHire:", leftCol, currentY);
         doc.moveDown(0.3);
         doc.fontSize(10).fillColor("#374151");
         doc.text("Signature: _______________________", leftCol, doc.y);
         doc.moveDown(0.4);
         doc.text("Name: ___________________________", leftCol, doc.y);
         doc.moveDown(0.4);
         doc.text("Designation: _____________________", leftCol, doc.y);
         doc.moveDown(0.4);
         doc.text("Date: ____________________________", leftCol, doc.y);

         // Right column - Institution
         doc.fontSize(11).fillColor("#0EA5E9").text("For Institution:", rightCol, currentY);
         doc.fontSize(10).fillColor("#374151");
         doc.text("Signature: _______________________", rightCol, currentY + 15);
         doc.text("Name: ___________________________", rightCol, currentY + 30);
         doc.text("Designation: _____________________", rightCol, currentY + 45);
         doc.text("Date: ____________________________", rightCol, currentY + 60);
         doc.text("[Institution Seal]", rightCol, currentY + 85);

         doc.y = currentY + 120;
         doc.moveDown(1);

         // Separator line
         doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#e2e8f0");
         doc.moveDown(0.8);

         // CONTACT INFORMATION (left-aligned)
         doc.fontSize(11)
            .fillColor("#0EA5E9")
            .text("CONTACT INFORMATION", 50);
         doc.moveDown(0.5);

         doc.fontSize(10).fillColor("#374151");
         doc.text("RequireHire:", 50);
         doc.text("Email: partnerships@requirehire.com | Web: www.requirehire.com", 50, doc.y, { indent: 20 });
         doc.moveDown(0.5);
         doc.text("Institution TPO/SPOC:", 50);
         doc.text(`Name: ${mou.tpoName || "______________"} | Email: ${mou.tpoEmail || "______________"} | Phone: ${mou.tpoPhone || "______________"}`, 50, doc.y, { indent: 20 });
         doc.moveDown(1);

         // End of Agreement
         doc.fontSize(9)
            .fillColor("#64748B")
            .text("— End of Agreement —", 50);
         doc.moveDown(1);

         // QR Code and Verification (at bottom like Offer Letter)
         const printableBottom = doc.page.height - doc.page.margins.bottom;
         const qrY = printableBottom - 80;
         const footerY = printableBottom - 25;

         const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
         doc.image(qrBuffer, 50, qrY, { width: 60 });

         doc.fontSize(8).fillColor("#64748B");
         doc.text(`MoU Ref: ${mou.mouNumber}`, 120, qrY + 15, { lineBreak: false });
         doc.text("Scan QR code to verify", 120, qrY + 27, { lineBreak: false });
         doc.text(`Generated: ${currentDate}`, 120, qrY + 39, { lineBreak: false });

         // Footer (same style as Offer Letter)
         doc.fontSize(8).fillColor("#94a3b8");
         const companyText = COMPANY_NAME;
         const cinText = `CIN: ${COMPANY_CIN} | Website: ${COMPANY_WEBSITE}`;
         const companyTextWidth = doc.widthOfString(companyText);
         const cinTextWidth = doc.widthOfString(cinText);
         const pageCenter = doc.page.width / 2;

         doc.text(companyText, pageCenter - companyTextWidth / 2, footerY);
         doc.text(cinText, pageCenter - cinTextWidth / 2, footerY + 10);

         doc.end();
      } catch (error) {
         reject(error);
      }
   });
}
