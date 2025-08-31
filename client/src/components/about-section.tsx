import { MapPin } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Building the future of AI in 
                <span className="text-enhanced-gradient"> Bihar and beyond</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Based in Patna, Bihar, VaridantAI is at the forefront of India's AI revolution. We combine global innovation with local expertise to create solutions that truly understand and serve the Indian market.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-muted-foreground">Years of Innovation</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground">AI Experts</div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Proudly Indian</h4>
                  <p className="text-muted-foreground text-sm">
                    Headquartered in Patna, Bihar, we understand the unique challenges and opportunities in the Indian market.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="AI technology abstract showing neural networks" 
              className="rounded-2xl shadow-xl w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
