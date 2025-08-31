import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
      data-testid="button-language-toggle"
    >
      {/* Flag Icons */}
      <div className="flex items-center space-x-1">
        {language === 'en' ? (
          <>
            <span className="text-lg">🇮🇳</span>
            <span className="text-sm font-medium">हिं</span>
          </>
        ) : (
          <>
            <span className="text-lg">🇺🇸</span>
            <span className="text-sm font-medium">EN</span>
          </>
        )}
      </div>
    </Button>
  );
}