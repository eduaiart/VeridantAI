import { Twitter, Linkedin, Instagram, Phone, Mail, Globe } from "lucide-react";
import logoPath from "@assets/Logo_1762664773643.jpg";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="VeridantAI Logo" className="h-10 w-10" />
              <span className="font-bold text-xl">
                <span className="text-slate-600">Veridant</span>
                <span className="text-[#0EA5E9]">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Innovating daily life through AI solutions.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">VERIDANTAI SOLUTION PRIVATE LIMITED</p>
              <p>Shivam Vihar Colony, Beur</p>
              <p>Phulwari, Patna-800002</p>
              <p>Bihar, India</p>
              <div className="flex items-center space-x-2 pt-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@veridantai.in" className="hover:text-foreground transition-colors">
                  info@veridantai.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+918550970101" className="hover:text-foreground transition-colors">
                  +91-8550970101
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <a href="https://www.veridantai.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  www.veridantai.in
                </a>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Solutions</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-education">
                  Education Technology
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-healthcare">
                  Healthcare Solutions
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-fintech">
                  Financial Technology
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-ai-software">
                  AI Software
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-custom-dev">
                  Custom Development
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-about">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-team">
                  Our Team
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-careers">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-news">
                  News & Updates
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-contact">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-privacy">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-terms">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-security">
                  Data Security
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors text-left" data-testid="link-footer-compliance">
                  Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2025 VERIDANTAI SOLUTION PRIVATE LIMITED. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => window.open('https://twitter.com/veridantai', '_blank')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-twitter"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open('https://linkedin.com/company/veridantai', '_blank')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open('https://instagram.com/veridantai', '_blank')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
