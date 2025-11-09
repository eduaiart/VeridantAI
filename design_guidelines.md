# VeridantAI Website Design Guidelines

## Design Approach
**Reference-Based**: Drawing from enterprise AI leaders (OpenAI, Anthropic, Scale AI) with modern tech-forward aesthetics. Focus on credibility, innovation, and accessibility for the Indian enterprise market.

## Core Typography
- **Headings**: Inter font family - Bold (700) for H1, Semibold (600) for H2-H3
- **Body**: Inter Regular (400) and Medium (500)
- **Scale**: H1 (48-64px), H2 (36-40px), H3 (24-28px), Body (16-18px)
- **Bilingual Support**: Consistent weight/size hierarchy for Hindi (use Noto Sans Devanagari fallback)

## Layout System
**Spacing Units**: Tailwind 4, 6, 8, 12, 16, 24 for consistent rhythm
- Section padding: py-20 (desktop), py-12 (mobile)
- Component spacing: gap-8 for grids, gap-6 for cards
- Container: max-w-7xl with px-6

## Page Structure (7 Sections)

### 1. Hero Section (100vh)
**Large hero image** featuring abstract AI visualization/neural networks with subtle motion (parallax scroll)
- Centered headline + subheadline overlay with blurred-background CTA buttons
- Language toggle (EN/HI) in top-right navigation
- Trust indicator: "Trusted by 200+ Indian Enterprises"

### 2. Value Proposition (3-column grid)
Icon-led feature cards showcasing AI capabilities
- Each card: Large icon, headline, 2-line description
- Hover: Subtle lift effect (translate-y)

### 3. Product Showcase (Asymmetric 2-column)
Left: Large product interface screenshot with floating UI elements
Right: Feature list with checkmarks, CTA to demo

### 4. Case Studies (2-column masonry grid)
Client logo + metric-driven success stories
- Format: "[Company] achieved [X%] improvement in [metric]"
- Background images with gradient overlays

### 5. Technology Stack (Horizontal scroll cards)
Visual representation of AI models/technologies
- Cards with tech logos, brief descriptions
- Smooth scroll-snap behavior

### 6. Testimonials (3-column)
Client photos, quotes, company logos
- Rotating carousel on mobile (single column)

### 7. Contact/CTA Section (Split layout)
Left: Contact form (Name, Email, Company, Message)
Right: Office locations (if applicable) or additional CTAs
- Footer: Navigation links, social media, bilingual support notice

## Component Library

**Navigation**: Sticky header with logo left, links center, language toggle + CTA right
**Buttons**: Primary (filled), Secondary (outline) - both with blurred backgrounds when over images
**Cards**: Rounded corners (border-radius: 12px), subtle shadows (shadow-lg)
**Forms**: Clean inputs with bottom borders, floating labels
**Icons**: Heroicons via CDN for consistency

## Animations (Minimal, Purposeful)
- Hero: Subtle parallax on scroll (0.5x speed)
- Cards: Fade-up on viewport entry (intersection observer)
- Product screenshot: Floating effect (gentle vertical motion)
- NO complex scroll-triggered animations, NO spinning elements

## Images Required
1. **Hero**: Abstract AI neural network visualization (futuristic, tech-forward) - full viewport width
2. **Product Screenshots**: Dashboard/interface mockups showing AI analytics
3. **Case Study Backgrounds**: Subtle tech patterns or client workspace images
4. **Client Logos**: High-contrast, monochrome versions for consistency

## Accessibility
- WCAG AA contrast ratios throughout
- Focus states on all interactive elements (2px outline)
- Keyboard navigation support
- Alt text for all images
- Semantic HTML5 structure

## Mobile Responsiveness
- All multi-column layouts stack to single column below 768px
- Touch-friendly button sizes (min 44px height)
- Hamburger menu for navigation
- Hero height: 70vh on mobile

**Critical**: Every section is fully designed and purposeful. This is a complete, production-ready specification optimized for quick implementation while maintaining enterprise-grade quality.