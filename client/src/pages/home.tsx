import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Client Logos Ticker */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground font-medium">Powering innovation for forward-thinking organizations</p>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-pulse">
              <div className="flex items-center space-x-12 flex-shrink-0">
                {['TechCorp', 'EduIndia', 'HealthPlus', 'FinNext', 'SmartSys', 'InnovateLab'].map((name) => (
                  <div key={name} className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      
      {/* Success Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Delivering measurable results across India
            </h2>
            <p className="text-xl text-muted-foreground">
              See how organizations are transforming their operations with VaridantAI solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">75%</div>
              <div className="text-lg font-semibold mb-2">Learning Efficiency Boost</div>
              <div className="text-muted-foreground">in partner educational institutions</div>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-lg font-semibold mb-2">Faster Diagnostics</div>
              <div className="text-muted-foreground">with AI-assisted healthcare tools</div>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-lg font-semibold mb-2">Financial Accuracy</div>
              <div className="text-muted-foreground">in fraud detection systems</div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      
      {/* Why Choose Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why choose VaridantAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We bring together cutting-edge AI technology, deep industry expertise, and a commitment to solving real problems for real people.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cross-Domain Expertise",
                description: "Unlike niche providers, we bring comprehensive expertise across education, healthcare, finance, and everyday applications.",
                color: "purple"
              },
              {
                title: "AI at the Core", 
                description: "Our products are powered by state-of-the-art artificial intelligence models, ensuring smarter, adaptive, and future-proof platforms.",
                color: "blue"
              },
              {
                title: "Scalable & Accessible",
                description: "Every solution is designed for scalability, from small organizations to global enterprises, accessible regardless of technical background.",
                color: "green"
              },
              {
                title: "Continuous Innovation",
                description: "We continuously research and implement the latest technological advancements to keep our solutions cutting-edge.",
                color: "indigo"
              },
              {
                title: "Human-Centered Design",
                description: "Our focus remains on solving real problems for real people, ensuring technology serves its ultimate purpose: improving quality of life.",
                color: "pink"
              },
              {
                title: "Ethical AI Practices",
                description: "We ensure all solutions respect user privacy, data security, and transparency, building responsible AI systems.",
                color: "yellow"
              }
            ].map((item, index) => (
              <div key={index} className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-6`}>
                  <div className={`w-8 h-8 text-${item.color}-600`}>⚡</div>
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to transform your business with AI?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join the growing number of organizations across India who trust VaridantAI to power their digital transformation. Let's build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/90 transition-all duration-200 shadow-lg"
                data-testid="button-schedule-demo"
              >
                Schedule a Demo
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200"
                data-testid="button-contact-team"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}
