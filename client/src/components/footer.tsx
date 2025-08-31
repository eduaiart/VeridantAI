import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl">VaridantAI</span>
            </div>
            <p className="text-muted-foreground">
              Innovating daily life through AI solutions. Based in Patna, Bihar, serving India and beyond.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Patna, Bihar 800001</p>
              <p>India</p>
              <p>contact@veridantai.in</p>
            </div>
          </div>
          
          {/* Solutions */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Solutions</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Education Technology</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Healthcare Solutions</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Financial Technology</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">AI Software</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Custom Development</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">News & Updates</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Data Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 VaridantAI.in. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
