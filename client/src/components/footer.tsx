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
                <a href="#" className="hover:text-foreground transition-colors">
                  Education Technology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Healthcare Solutions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Financial Technology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  AI Software
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Custom Development
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  News & Updates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Data Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Compliance
                </a>
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
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
