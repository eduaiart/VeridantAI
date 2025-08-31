import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSolutions = () => {
    document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative hero-gradient text-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                One AI platform to transform your 
                <span className="text-accent-foreground"> entire business</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                Revolutionize education, healthcare, finance, and productivity with intelligent AI solutions built for the Indian market.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToContact}
                className="bg-white text-primary px-8 py-4 h-auto text-lg font-semibold hover:bg-white/90 shadow-lg"
                data-testid="button-hero-demo"
              >
                Get a Demo
              </Button>
              <Button 
                onClick={scrollToSolutions}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 h-auto text-lg font-semibold hover:bg-white/10 bg-transparent"
                data-testid="button-hero-explore"
              >
                Explore Solutions
              </Button>
            </div>
            
            <div className="text-white/80">
              <p className="text-sm">Trusted by leading organizations across India</p>
            </div>
          </div>
          
          <div className="animate-float">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="AI technology abstract visualization" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
