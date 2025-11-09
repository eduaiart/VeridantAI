import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "@/components/language-toggle";
import logoPath from "@assets/Logo_1762664773643.jpg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logoPath} alt="VeridantAI Logo" className="h-10 w-10" />
            <span className="font-bold text-xl">
              <span className="text-slate-600">Veridant</span>
              <span className="text-[#0EA5E9]">AI</span>
            </span>
          </div>

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
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {t("navigation.caseStudies")}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {t("navigation.whitepapers")}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {t("navigation.blog")}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {t("navigation.documentation")}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {t("navigation.support")}
                  </a>
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
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <Button
              onClick={() => scrollToSection("contact")}
              className="hidden lg:inline-flex bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              data-testid="button-get-demo"
            >
              <span className="mr-2">🚀</span>
              {t("navigation.bookDemo")}
            </Button>

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
                  <a
                    href="#"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("navigation.caseStudies")}
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("navigation.blog")}
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("navigation.documentation")}
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("navigation.support")}
                  </a>
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
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 w-full font-semibold shadow-lg"
                data-testid="button-mobile-demo"
              >
                <span className="mr-2">🚀</span>
                {t("navigation.bookDemo")}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
