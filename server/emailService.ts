// Email Service using Resend Integration
import { Resend } from 'resend';

let cachedCredentials: { apiKey: string; fromEmail: string } | null = null;

async function getCredentials(): Promise<{ apiKey: string; fromEmail: string }> {
  // Return cached credentials if available
  if (cachedCredentials) {
    return cachedCredentials;
  }
  
  // First try conventional env vars (works in all environments)
  if (process.env.RESEND_API_KEY) {
    cachedCredentials = {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'hr@veridantai.in'
    };
    return cachedCredentials;
  }
  
  // Try Replit connector integration
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error('No email credentials available. Set RESEND_API_KEY or configure Resend integration.');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  
  cachedCredentials = { 
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email || 'hr@veridantai.in'
  };
  return cachedCredentials;
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail || 'hr@veridantai.in'
  };
}

const COMPANY_NAME = "VERIDANT AI SOLUTION PRIVATE LTD";
const COMPANY_WEBSITE = "www.veridantai.in";
const COMPANY_EMAIL = "hr@veridantai.in";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const result = await client.emails.send({
      from: `VeridantAI <${fromEmail}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Email Templates
function getEmailHeader(): string {
  return `
    <div style="background: linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-family: Arial, sans-serif; font-size: 28px;">
        <span style="color: #e2e8f0;">Veridant</span><span style="color: white;">AI</span>
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">AI Solutions for Tomorrow</p>
    </div>
  `;
}

function getEmailFooter(): string {
  return `
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #64748b; font-size: 12px; font-family: Arial, sans-serif;">
        ${COMPANY_NAME}<br>
        Website: <a href="https://${COMPANY_WEBSITE}" style="color: #0EA5E9;">${COMPANY_WEBSITE}</a> | 
        Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #0EA5E9;">${COMPANY_EMAIL}</a>
      </p>
      <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 11px; font-family: Arial, sans-serif;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  `;
}

// 1. Application Submitted - Confirmation Email
export async function sendApplicationConfirmation(
  email: string,
  firstName: string,
  lastName: string,
  programTitle: string,
  applicationNumber: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getEmailHeader()}
        <div style="padding: 30px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0;">Application Received!</h2>
          <p style="color: #475569; line-height: 1.6;">Dear ${firstName} ${lastName},</p>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for submitting your application for the <strong>${programTitle}</strong> at VeridantAI. 
            We have successfully received your application.
          </p>
          <div style="background: #f0f9ff; border-left: 4px solid #0EA5E9; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1; font-weight: bold;">Application Number</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 18px; font-weight: bold;">${applicationNumber}</p>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            Please save this application number for future reference. You can use it to track your application status.
          </p>
          <h3 style="color: #1e293b; margin: 25px 0 15px 0;">What's Next?</h3>
          <ul style="color: #475569; line-height: 1.8;">
            <li>Our team will review your application</li>
            <li>You will receive an email notification when your status changes</li>
            <li>Shortlisted candidates will be contacted for further steps</li>
          </ul>
          <p style="color: #475569; line-height: 1.6; margin-top: 25px;">
            Best regards,<br>
            <strong>HR Team</strong><br>
            VeridantAI
          </p>
        </div>
        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Application Received - ${programTitle} | ${applicationNumber}`,
    html
  });
}

// 2. Application Status Change Email
export async function sendStatusChangeNotification(
  email: string,
  firstName: string,
  lastName: string,
  programTitle: string,
  applicationNumber: string,
  newStatus: string,
  notes?: string
): Promise<boolean> {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    under_review: {
      title: "Application Under Review",
      message: "Your application is currently being reviewed by our team. We will update you on the progress soon.",
      color: "#3B82F6"
    },
    shortlisted: {
      title: "Congratulations! You've Been Shortlisted",
      message: "We are pleased to inform you that your application has been shortlisted for further consideration. Our team will contact you soon with the next steps.",
      color: "#8B5CF6"
    },
    interview_scheduled: {
      title: "Interview Scheduled",
      message: "Your interview has been scheduled. Please check your email for the interview details and prepare accordingly.",
      color: "#6366F1"
    },
    selected: {
      title: "Congratulations! You've Been Selected",
      message: "We are delighted to inform you that you have been selected for the internship program! You will receive your offer letter shortly.",
      color: "#10B981"
    },
    rejected: {
      title: "Application Update",
      message: "Thank you for your interest in VeridantAI. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We encourage you to apply for future opportunities.",
      color: "#EF4444"
    },
    completed: {
      title: "Internship Completed",
      message: "Congratulations on successfully completing your internship! Your certificate will be available for download shortly.",
      color: "#059669"
    }
  };

  const statusInfo = statusMessages[newStatus] || {
    title: "Application Status Update",
    message: `Your application status has been updated to: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
    color: "#64748B"
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getEmailHeader()}
        <div style="padding: 30px;">
          <h2 style="color: ${statusInfo.color}; margin: 0 0 20px 0;">${statusInfo.title}</h2>
          <p style="color: #475569; line-height: 1.6;">Dear ${firstName} ${lastName},</p>
          <p style="color: #475569; line-height: 1.6;">${statusInfo.message}</p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Program:</td>
                <td style="padding: 5px 0; color: #1e293b; font-weight: bold;">${programTitle}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Application No:</td>
                <td style="padding: 5px 0; color: #1e293b; font-weight: bold;">${applicationNumber}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Status:</td>
                <td style="padding: 5px 0;">
                  <span style="background: ${statusInfo.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                    ${newStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          ${notes ? `
          <div style="background: #fef3c7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">Note from Admin:</p>
            <p style="margin: 5px 0 0 0; color: #78350f;">${notes}</p>
          </div>
          ` : ''}
          <p style="color: #475569; line-height: 1.6; margin-top: 25px;">
            If you have any questions, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #0EA5E9;">${COMPANY_EMAIL}</a>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Best regards,<br>
            <strong>HR Team</strong><br>
            VeridantAI
          </p>
        </div>
        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${statusInfo.title} - ${programTitle} | ${applicationNumber}`,
    html
  });
}

// 3. Offer Letter Issued Email
export async function sendOfferLetterNotification(
  email: string,
  firstName: string,
  lastName: string,
  programTitle: string,
  offerNumber: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getEmailHeader()}
        <div style="padding: 30px;">
          <h2 style="color: #10B981; margin: 0 0 20px 0;">Your Offer Letter is Ready!</h2>
          <p style="color: #475569; line-height: 1.6;">Dear ${firstName} ${lastName},</p>
          <p style="color: #475569; line-height: 1.6;">
            Congratulations! Your offer letter for the <strong>${programTitle}</strong> has been generated and is now available for download.
          </p>
          <div style="background: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #047857; font-weight: bold;">Offer Details</p>
            <table style="margin-top: 10px;">
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #065f46;">Offer Number:</td>
                <td style="color: #1e293b; font-weight: bold;">${offerNumber}</td>
              </tr>
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #065f46;">Start Date:</td>
                <td style="color: #1e293b;">${startDate}</td>
              </tr>
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #065f46;">End Date:</td>
                <td style="color: #1e293b;">${endDate}</td>
              </tr>
            </table>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            Please log in to your candidate dashboard to download and review your offer letter. 
            Make sure to read all the terms and conditions carefully before signing.
          </p>
          <h3 style="color: #1e293b; margin: 25px 0 15px 0;">Next Steps:</h3>
          <ol style="color: #475569; line-height: 1.8;">
            <li>Download your offer letter from the dashboard</li>
            <li>Read and understand all terms and conditions</li>
            <li>Sign the offer letter and submit by the joining date</li>
            <li>Prepare the required documents mentioned in the offer letter</li>
          </ol>
          <p style="color: #475569; line-height: 1.6; margin-top: 25px;">
            Welcome to the VeridantAI family!<br><br>
            Best regards,<br>
            <strong>HR Team</strong><br>
            VeridantAI
          </p>
        </div>
        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Offer Letter Issued - ${programTitle} | ${offerNumber}`,
    html
  });
}

// 4. Certificate Issued Email
export async function sendCertificateNotification(
  email: string,
  firstName: string,
  lastName: string,
  programTitle: string,
  certificateNumber: string,
  certificateType: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getEmailHeader()}
        <div style="padding: 30px;">
          <h2 style="color: #8B5CF6; margin: 0 0 20px 0;">Your Certificate is Ready!</h2>
          <p style="color: #475569; line-height: 1.6;">Dear ${firstName} ${lastName},</p>
          <p style="color: #475569; line-height: 1.6;">
            Congratulations on successfully completing the <strong>${programTitle}</strong>! 
            Your ${certificateType.toLowerCase()} certificate has been generated and is now available for download.
          </p>
          <div style="background: #f5f3ff; border-left: 4px solid #8B5CF6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #6D28D9; font-weight: bold;">Certificate Details</p>
            <table style="margin-top: 10px;">
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #7C3AED;">Certificate Number:</td>
                <td style="color: #1e293b; font-weight: bold;">${certificateNumber}</td>
              </tr>
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #7C3AED;">Type:</td>
                <td style="color: #1e293b;">${certificateType}</td>
              </tr>
              <tr>
                <td style="padding: 3px 15px 3px 0; color: #7C3AED;">Program:</td>
                <td style="color: #1e293b;">${programTitle}</td>
              </tr>
            </table>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            Your certificate includes a QR code that can be scanned to verify its authenticity. 
            You can share this certificate on your LinkedIn profile or include it in your portfolio.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Please log in to your candidate dashboard to download your certificate.
          </p>
          <p style="color: #475569; line-height: 1.6; margin-top: 25px;">
            We wish you all the best in your future endeavors!<br><br>
            Best regards,<br>
            <strong>HR Team</strong><br>
            VeridantAI
          </p>
        </div>
        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Certificate Issued - ${programTitle} | ${certificateNumber}`,
    html
  });
}
