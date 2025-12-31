# VeridantAI Document Generation Strategy

## Analysis of Your Templates

### ✅ What's Great About Your Templates:

1. **Legally Comprehensive** - Cover all important clauses
2. **Professional Format** - Proper structure and language
3. **Clear Terms** - Well-defined obligations and rights
4. **Indian Law Compliant** - References to IT Act, Indian regulations
5. **Detailed IP Clauses** - Strong intellectual property protection
6. **Both Paid/Unpaid** - Separate templates for different scenarios

### 📋 Template Analysis:

| Document | Pages | Dynamic Fields | Complexity |
|----------|-------|----------------|------------|
| NDA | 11 | ~25 fields | High |
| Paid Offer | 4 | ~20 fields | Medium |
| Unpaid Offer | 7 | ~25 fields | Medium |

---

## Recommended Approach: Multi-Strategy Solution

I recommend a **hybrid approach** combining multiple methods:

### Strategy 1: Template-Based PDF Generation (RECOMMENDED)
**Best for: Your use case**

#### Method A: HTML to PDF (Puppeteer/WeasyPrint)
**Pros:**
- ✅ Full design control with HTML/CSS
- ✅ Easy to preview before generating
- ✅ Can include company logo, branding
- ✅ Responsive and modern layouts
- ✅ Easy to maintain and update templates

**Cons:**
- ⚠️ Requires browser engine (Puppeteer) or Python library

**Implementation:**

```javascript
// Using Puppeteer (Node.js)
const puppeteer = require('puppeteer');

async function generateOfferLetter(data, type) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load HTML template
  const html = generateHTMLTemplate(data, type);
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  // Generate PDF with professional settings
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    printBackground: true,
    preferCSSPageSize: true
  });
  
  await browser.close();
  return pdf;
}

function generateHTMLTemplate(data, type) {
  // type: 'paid', 'unpaid', 'nda'
  const templates = {
    paid: paidOfferTemplate,
    unpaid: unpaidOfferTemplate,
    nda: ndaTemplate
  };
  
  return templates[type](data);
}
```

---

### Strategy 2: PDF Form Filling (ALTERNATIVE)
**Best for: If you want editable PDFs**

Create fillable PDF forms and populate them programmatically.

```javascript
// Using pdf-lib (JavaScript)
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function fillPDFForm(templatePath, data) {
  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  // Fill form fields
  form.getTextField('internName').setText(data.fullName);
  form.getTextField('position').setText(data.position);
  form.getTextField('startDate').setText(data.startDate);
  form.getTextField('stipend').setText(data.stipend);
  // ... fill all fields
  
  // Flatten form (make non-editable)
  form.flatten();
  
  const filledPdfBytes = await pdfDoc.save();
  return filledPdfBytes;
}
```

**Pros:**
- ✅ Preserves exact formatting
- ✅ Can reuse existing designed PDFs

**Cons:**
- ⚠️ Need to create fillable PDF first (Adobe Acrobat)
- ⚠️ Less flexible for layout changes

---

### Strategy 3: ReportLab/Platypus (Python)
**Best for: Server-side generation without browser**

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, Image
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from datetime import datetime

def generate_offer_letter(data, offer_type='paid'):
    """
    Generate offer letter PDF
    
    Args:
        data: Dictionary containing all required fields
        offer_type: 'paid' or 'unpaid'
    """
    filename = f"offer_letter_{data['application_id']}.pdf"
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        topMargin=20*mm,
        bottomMargin=20*mm,
        leftMargin=25*mm,
        rightMargin=25*mm
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    story = []
    
    # Custom styles
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=12,
        alignment=TA_CENTER
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # Add company logo (if available)
    # logo = Image('veridant_logo.png', width=60*mm, height=20*mm)
    # story.append(logo)
    # story.append(Spacer(1, 10*mm))
    
    # Company header
    story.append(Paragraph(
        "VERIDANT AI SOLUTION PRIVATE LTD",
        header_style
    ))
    story.append(Paragraph(
        f"Corporate Office: {data['company_address']}<br/>"
        f"Website: www.veridantAI.in | Email: hr@veridantAI.in",
        styles['Normal']
    ))
    story.append(Spacer(1, 8*mm))
    
    # Date and address
    story.append(Paragraph(f"Date: {data['date']}", body_style))
    story.append(Spacer(1, 5*mm))
    
    story.append(Paragraph(
        f"{data['intern_name']}<br/>"
        f"{data['address']}<br/>"
        f"{data['city']}, {data['state']} - {data['pincode']}",
        body_style
    ))
    story.append(Spacer(1, 5*mm))
    
    # Subject
    offer_text = "Paid" if offer_type == 'paid' else "Unpaid"
    story.append(Paragraph(
        f"<b>Re: {offer_text} Internship Offer</b>",
        body_style
    ))
    story.append(Spacer(1, 5*mm))
    
    # Opening paragraph
    story.append(Paragraph(
        f"Dear {data['intern_name']},",
        body_style
    ))
    story.append(Spacer(1, 3*mm))
    
    story.append(Paragraph(
        f"On behalf of Veridant AI Solution Private LTD (the \"Company\"), I am pleased to extend to you "
        f"this offer of {'temporary employment' if offer_type == 'paid' else 'an unpaid internship position'} "
        f"as a <b>{data['position']}</b>, reporting to {data['manager_name']}, {data['manager_designation']}. "
        f"If you accept this offer, you will begin your internship with the Company on <b>{data['start_date']}</b> "
        f"and will be expected to work {data['days_per_week']} days per week, {data['hours_per_day']} hours per day.",
        body_style
    ))
    story.append(Spacer(1, 5*mm))
    
    # Compensation section
    if offer_type == 'paid':
        story.append(Paragraph("<b>Compensation</b>", styles['Heading2']))
        story.append(Paragraph(
            f"You will be paid ₹{data['stipend_amount']} per month, less all applicable taxes and withholdings "
            f"as per Indian Income Tax regulations, payable on the last working day of each month. "
            f"Payment will be made via bank transfer to the account details you provide during onboarding.",
            body_style
        ))
    else:
        story.append(Paragraph("<b>Nature of Internship</b>", styles['Heading2']))
        story.append(Paragraph(
            "This is an unpaid educational internship designed to provide you with practical learning experience, "
            "skill development, and exposure to real-world applications of artificial intelligence and technology "
            "in a professional business environment.",
            body_style
        ))
    
    story.append(Spacer(1, 5*mm))
    
    # ... Continue adding all sections from template
    
    # Build PDF
    doc.build(story)
    return filename


# Example usage
def create_offer_for_candidate(application_data):
    """
    Create offer letter from application data
    """
    offer_data = {
        'application_id': application_data['id'],
        'date': datetime.now().strftime('%B %d, %Y'),
        'intern_name': application_data['full_name'],
        'address': application_data['current_address'],
        'city': application_data.get('city', ''),
        'state': application_data.get('state', ''),
        'pincode': application_data.get('pincode', ''),
        'position': application_data['department'],
        'manager_name': 'Dr. Sarah Johnson',
        'manager_designation': 'Head of AI Research',
        'start_date': application_data['preferred_start_date'],
        'days_per_week': '5',
        'hours_per_day': '6',
        'stipend_amount': '10,000',  # or None for unpaid
        'company_address': 'Plot No. 123, Tech Park, Bangalore - 560001'
    }
    
    offer_type = 'paid' if application_data.get('is_paid') else 'unpaid'
    
    return generate_offer_letter(offer_data, offer_type)
```

---

## Complete Implementation Plan

### Database Schema for Templates

```sql
-- Document Templates
document_templates (
  id UUID PRIMARY KEY,
  template_type ENUM('offer_paid', 'offer_unpaid', 'nda', 'certificate', 'experience'),
  template_name VARCHAR NOT NULL,
  html_template TEXT NOT NULL,  -- Store HTML version
  pdf_template_url VARCHAR,     -- Store fillable PDF (optional)
  version VARCHAR DEFAULT '1.0',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Template Variables (for validation)
template_variables (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES document_templates(id),
  variable_name VARCHAR NOT NULL,
  variable_type VARCHAR NOT NULL, -- 'text', 'date', 'number', 'boolean'
  is_required BOOLEAN DEFAULT TRUE,
  default_value TEXT,
  validation_rules JSONB  -- e.g., {"min": 0, "max": 100000} for stipend
)
```

### Complete HTML Template Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 20mm 25mm;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #000;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20mm;
        }
        
        .company-name {
            font-size: 16pt;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5mm;
        }
        
        .company-details {
            font-size: 10pt;
            color: #666;
        }
        
        .date {
            margin-bottom: 10mm;
        }
        
        .recipient-address {
            margin-bottom: 10mm;
        }
        
        .subject {
            font-weight: bold;
            margin: 10mm 0;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 8mm;
            margin-bottom: 4mm;
            color: #2563eb;
        }
        
        .signature-section {
            margin-top: 20mm;
        }
        
        .signature-box {
            border-top: 1px solid #000;
            width: 200px;
            margin-top: 15mm;
        }
        
        .acceptance-section {
            margin-top: 20mm;
            padding: 10mm;
            border: 1px solid #ccc;
            background: #f9f9f9;
        }
        
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <!-- Logo can be added here -->
        <div class="company-name">VERIDANT AI SOLUTION PRIVATE LTD</div>
        <div class="company-details">
            Corporate Office: {{company_address}}<br>
            Website: www.veridantAI.in | Email: hr@veridantAI.in | Phone: {{company_phone}}
        </div>
    </div>
    
    <!-- Date -->
    <div class="date">Date: {{date}}</div>
    
    <!-- Recipient Address -->
    <div class="recipient-address">
        {{intern_name}}<br>
        {{address}}<br>
        {{city}}, {{state}} - {{pincode}}
    </div>
    
    <!-- Subject -->
    <div class="subject">
        Re: {{offer_type}} Internship Offer
    </div>
    
    <!-- Opening -->
    <p>Dear {{intern_name}},</p>
    
    <p>
        On behalf of Veridant AI Solution Private LTD (the "Company"), I am pleased to extend to you 
        this offer of {{employment_status}} as a <strong>{{position}}</strong>, reporting to 
        {{manager_name}}, {{manager_designation}}. If you accept this offer, you will begin your 
        internship with the Company on <strong>{{start_date}}</strong> and will be expected to work 
        {{days_per_week}} days per week, {{hours_per_day}} hours per day.
    </p>
    
    <!-- Compensation (conditional) -->
    {{#if is_paid}}
    <div class="section-title">Compensation</div>
    <p>
        You will be paid ₹{{stipend_amount}} per month, less all applicable taxes and withholdings 
        as per Indian Income Tax regulations, payable on the last working day of each month. 
        Payment will be made via bank transfer to the account details you provide during onboarding.
    </p>
    {{else}}
    <div class="section-title">Nature of Internship</div>
    <p>
        This is an unpaid educational internship designed to provide you with practical learning experience...
    </p>
    {{/if}}
    
    <!-- Continue with all sections... -->
    
    <!-- Signature Section -->
    <div class="signature-section">
        <p>Very truly yours,</p>
        <div class="signature-box">
            <br><br>
            {{signatory_name}}<br>
            {{signatory_title}}<br>
            Veridant AI Solution Private LTD
        </div>
    </div>
    
    <div class="page-break"></div>
    
    <!-- Acceptance Section -->
    <div class="acceptance-section">
        <div class="section-title">ACCEPTANCE OF OFFER</div>
        <p>
            I accept {{offer_type}} with Veridant AI Solution Private LTD on the terms and conditions 
            set out in this letter. I confirm that I have read, understood, and agree to all the terms 
            mentioned above.
        </p>
        
        <br><br>
        Printed Name: _________________________________<br><br>
        Signature: _________________________________<br><br>
        Date: _________________________________<br><br>
    </div>
</body>
</html>
```

### Template Rendering Engine

```javascript
// Using Handlebars for template rendering
const Handlebars = require('handlebars');

// Register custom helpers
Handlebars.registerHelper('formatCurrency', function(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
});

Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

function renderTemplate(templateHTML, data) {
  const template = Handlebars.compile(templateHTML);
  return template(data);
}

// Example
const templateHTML = `...`; // Your HTML template
const data = {
  intern_name: 'Rahul Sharma',
  position: 'AI/ML Engineering Intern',
  is_paid: true,
  stipend_amount: 15000,
  // ... all other fields
};

const renderedHTML = renderTemplate(templateHTML, data);
```

---

## Complete API Implementation

```javascript
// routes/documents.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const storage = require('../storage'); // Your file storage service

// Generate Offer Letter
router.post('/api/admin/documents/offer-letter', async (req, res) => {
  try {
    const { applicationId, offerType } = req.body; // 'paid' or 'unpaid'
    
    // Get application data
    const application = await db.query(
      'SELECT * FROM internship_applications WHERE id = $1',
      [applicationId]
    );
    
    if (!application.rows[0]) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const appData = application.rows[0];
    
    // Get template
    const template = await db.query(
      'SELECT html_template FROM document_templates WHERE template_type = $1 AND is_active = true',
      [`offer_${offerType}`]
    );
    
    if (!template.rows[0]) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Prepare data for template
    const templateData = {
      // Company details
      company_address: process.env.COMPANY_ADDRESS,
      company_phone: process.env.COMPANY_PHONE,
      
      // Intern details
      intern_name: appData.full_name,
      address: appData.current_address,
      city: appData.city || '',
      state: appData.state || '',
      pincode: appData.pincode || '',
      email: appData.email,
      phone: appData.phone,
      
      // Offer details
      offer_type: offerType === 'paid' ? 'Paid' : 'Unpaid',
      position: appData.department,
      start_date: formatDate(appData.preferred_start_date),
      end_date: calculateEndDate(appData.preferred_start_date, 3), // 3 months
      days_per_week: 5,
      hours_per_day: 6,
      
      // Compensation (if paid)
      is_paid: offerType === 'paid',
      stipend_amount: offerType === 'paid' ? '15,000' : null,
      
      // Signatory
      signatory_name: 'Dr. Amit Kumar',
      signatory_title: 'CEO & Founder',
      
      // Dates
      date: formatDate(new Date()),
      acceptance_deadline: formatDate(addDays(new Date(), 7)),
      
      // IDs
      application_id: appData.application_id,
      document_id: generateDocumentId('OFF')
    };
    
    // Render HTML
    const compiledTemplate = Handlebars.compile(template.rows[0].html_template);
    const html = compiledTemplate(templateData);
    
    // Generate PDF
    const pdfBuffer = await generatePDFFromHTML(html);
    
    // Upload to storage
    const documentUrl = await storage.upload(
      pdfBuffer,
      `offers/${applicationId}_offer_letter.pdf`
    );
    
    // Save to database
    const credential = await db.query(`
      INSERT INTO credentials (
        id, credential_id, application_id, credential_type,
        verification_token, document_url, issued_date, issued_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      uuidv4(),
      templateData.document_id,
      applicationId,
      'offer_letter',
      generateVerificationToken(),
      documentUrl,
      new Date(),
      req.user.id
    ]);
    
    // Send email to candidate
    await sendOfferEmail(appData.email, documentUrl, templateData);
    
    res.json({
      success: true,
      documentId: credential.rows[0].id,
      documentUrl: documentUrl,
      verificationToken: credential.rows[0].verification_token
    });
    
  } catch (error) {
    console.error('Error generating offer letter:', error);
    res.status(500).json({ error: 'Failed to generate offer letter' });
  }
});

// Helper: Generate PDF from HTML
async function generatePDFFromHTML(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '25mm',
      bottom: '20mm',
      left: '25mm'
    },
    printBackground: true
  });
  
  await browser.close();
  return pdf;
}

// Helper: Generate document ID
function generateDocumentId(prefix) {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

// Helper: Generate verification token
function generateVerificationToken() {
  const crypto = require('crypto');
  return 'VRD-' + crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Helper: Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper: Calculate end date
function calculateEndDate(startDate, months) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return formatDate(date);
}

// Helper: Add days
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = router;
```

---

## Recommended Solution Summary

### 🎯 **Best Approach for VeridantAI:**

**Use HTML Templates + Puppeteer**

#### Why:
1. ✅ **Full control** over design and branding
2. ✅ **Easy to update** - just edit HTML/CSS
3. ✅ **Preview capability** - show HTML before generating PDF
4. ✅ **Consistent output** - exact same formatting every time
5. ✅ **Professional appearance** - can match your website design
6. ✅ **Variable complexity** - handle paid/unpaid/NDA with same system

#### Workflow:
```
1. Admin clicks "Generate Offer Letter"
2. System fetches application data
3. System loads HTML template
4. System renders template with data (Handlebars)
5. System converts HTML to PDF (Puppeteer)
6. System uploads PDF to storage
7. System saves reference in database
8. System sends email to candidate
9. Admin can preview/download/resend
```

---

## Action Items

### Immediate:
1. ✅ Convert your PDF templates to HTML format
2. ✅ Identify all variable fields (I count ~25 per document)
3. ✅ Set up Puppeteer in your backend
4. ✅ Create template rendering service

### Short-term:
1. ✅ Build document generation API
2. ✅ Add email notification system
3. ✅ Create admin UI for document generation
4. ✅ Test with real application data

### Optional Enhancements:
1. 📄 Digital signatures (DocuSign integration)
2. 🔐 Encrypted PDFs (password protection)
3. 📱 Mobile-optimized PDFs
4. 🌐 Multi-language support
5. ✍️ E-signature capture in UI

---

## Template Variables Needed

### Common (All Documents):
- `company_name`, `company_address`, `company_cin`, `company_email`, `company_phone`
- `intern_name`, `address`, `city`, `state`, `pincode`, `email`, `phone`
- `date`, `document_id`, `verification_token`

### Offer Letter Specific:
- `position`, `department`, `manager_name`, `manager_designation`
- `start_date`, `end_date`, `days_per_week`, `hours_per_day`
- `stipend_amount` (paid only)
- `acceptance_deadline`

### NDA Specific:
- `effective_date`, `aadhaar_number`, `pan_number`
- `role_description`

---

## Estimated Effort

| Task | Time | Priority |
|------|------|----------|
| Convert templates to HTML | 2-3 days | High |
| Set up Puppeteer | 1 day | High |
| Build API endpoints | 2 days | High |
| Create admin UI | 2 days | Medium |
| Email integration | 1 day | High |
| Testing & refinement | 2 days | High |

**Total: ~10-12 days**

---

## Questions Before Implementation:

1. **Digital Signatures**: Do you want e-signature capability or just PDF with signature boxes?
2. **Branding**: Do you have a logo and color scheme to include?
3. **Storage**: Where to store PDFs? (AWS S3, Replit Storage, Google Drive?)
4. **Email Service**: Which provider? (Resend, SendGrid, AWS SES?)
5. **Customization**: Will HR need to edit templates or just fill variables?
6. **Audit Trail**: Track all document versions and changes?
7. **Bulk Generation**: Need to generate multiple offers at once?

Your templates are excellent - they just need to be converted to HTML format and integrated into the automated system!
