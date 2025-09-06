import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function HeroSection() {
  const { t } = useLanguage();
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSolutions = () => {
    document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative enhanced-gradient text-white py-20 lg:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slower"></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rotate-45 animate-float-fast"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-300/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-blue-300/40 rotate-12 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-white/15 rounded-full animate-float"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {t('hero.title')} 
                <span className="text-accent-foreground">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToContact}
                className="bg-white text-primary px-8 py-4 h-auto text-lg font-semibold hover:bg-white/90 shadow-lg"
                data-testid="button-hero-demo"
              >
                {t('hero.getDemo')}
              </Button>
              <Button 
                onClick={scrollToSolutions}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 h-auto text-lg font-semibold hover:bg-white/10 bg-transparent"
                data-testid="button-hero-explore"
              >
                {t('hero.exploreSolutions')}
              </Button>
            </div>
            
            <div className="text-white/80">
              <p className="text-sm">{t('hero.trustedBy')}</p>
            </div>
          </div>
          
          <div className="relative animate-float">
            {/* Product Demo Video Thumbnail */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="VeridantAI Platform Demo" 
                className="rounded-2xl shadow-2xl w-full h-auto transition-transform duration-300 group-hover:scale-105" 
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-all duration-300 group-hover:scale-110">
                  <div className="w-0 h-0 border-l-[16px] border-l-primary border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                </div>
              </div>
              
              {/* Demo Badge */}
              <div className="absolute top-4 left-4 bg-white/95 text-primary px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                🎬 Watch Demo
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Demo Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">2 min</div>
                <div className="text-white/80 text-sm">Quick Overview</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">Live</div>
                <div className="text-white/80 text-sm">Interactive Demo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
