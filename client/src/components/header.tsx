import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "@/components/language-toggle";
import logoPath from "@assets/Logo_1762664773643.jpg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();

  const isHomePage = location === "/";

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - clickable to go home */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity" data-testid="link-home-logo">
            <img src={logoPath} alt="VeridantAI Logo" className="h-10 w-10" />
            <span className="font-bold text-xl">
              <span className="text-slate-600">Veridant</span>
              <span className="text-[#0EA5E9]">AI</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-solutions"
            >
              {t("navigation.solutions")}
            </button>
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center">
                {t("navigation.resources")}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button
                    onClick={() => scrollToSection("solutions")}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    data-testid="link-resources-case-studies"
                  >
                    {t("navigation.caseStudies")}
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    data-testid="link-resources-whitepapers"
                  >
                    {t("navigation.whitepapers")}
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    data-testid="link-resources-blog"
                  >
                    {t("navigation.blog")}
                  </button>
                  <button
                    onClick={() => scrollToSection("solutions")}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    data-testid="link-resources-documentation"
                  >
                    {t("navigation.documentation")}
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    data-testid="link-resources-support"
                  >
                    {t("navigation.support")}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-about"
            >
              {t("navigation.about")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-contact"
            >
              {t("navigation.contact")}
            </button>
            <a
              href="/internships"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="nav-internships"
            >
              Internships
            </a>
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <a href="/login" data-testid="link-login">
              <Button variant="ghost" className="hidden md:inline-flex">
                Login
              </Button>
            </a>
            <a href="/register" data-testid="link-register-header">
              <Button
                className="hidden lg:inline-flex bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                Register
              </Button>
            </a>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("solutions")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left font-medium"
                data-testid="nav-mobile-solutions"
              >
                {t("navigation.solutions")}
              </button>
              <div className="text-left">
                <div className="text-muted-foreground font-medium mb-2">
                  {t("navigation.resources")}
                </div>
                <div className="pl-4 space-y-2">
                  <button
                    onClick={() => scrollToSection("solutions")}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-mobile-case-studies"
                  >
                    {t("navigation.caseStudies")}
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-mobile-blog"
                  >
                    {t("navigation.blog")}
                  </button>
                  <button
                    onClick={() => scrollToSection("solutions")}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-mobile-documentation"
                  >
                    {t("navigation.documentation")}
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-mobile-support"
                  >
                    {t("navigation.support")}
                  </button>
                </div>
              </div>
              <button
                onClick={() => scrollToSection("about")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left font-medium"
                data-testid="nav-mobile-about"
              >
                {t("navigation.about")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left font-medium"
                data-testid="nav-mobile-contact"
              >
                {t("navigation.contact")}
              </button>
              <a
                href="/internships"
                className="text-muted-foreground hover:text-foreground transition-colors text-left font-medium"
                data-testid="nav-mobile-internships"
              >
                Internships
              </a>
              <div className="flex gap-2 pt-2">
                <a href="/login" className="flex-1">
                  <Button variant="outline" className="w-full" data-testid="button-mobile-login">
                    Login
                  </Button>
                </a>
                <a href="/register" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-white" data-testid="button-mobile-register">
                    Register
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
