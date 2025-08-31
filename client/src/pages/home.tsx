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
      
      {/* Client Logos Carousel */}
      <section className="py-12 bg-muted/50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground font-medium">Powering innovation for forward-thinking organizations across India</p>
          </div>
          
          {/* Scrolling Logo Container */}
          <div className="relative">
            {/* Fade effects */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-muted/50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-muted/50 to-transparent z-10"></div>
            
            <div className="overflow-hidden">
              <div className="flex animate-slide-left">
                <div className="flex items-center space-x-16 flex-shrink-0">
                  {/* First set of logos */}
                  {[
                    { name: 'TechCorp', desc: 'Enterprise Solutions' },
                    { name: 'EduVision', desc: 'Educational Platform' },
                    { name: 'HealthCare+', desc: 'Medical Systems' },
                    { name: 'FinanceAI', desc: 'Financial Services' },
                    { name: 'SmartGov', desc: 'Government Tech' },
                    { name: 'AgriTech', desc: 'Agricultural Innovation' },
                    { name: 'RetailPro', desc: 'Retail Solutions' },
                    { name: 'LogiMax', desc: 'Supply Chain' }
                  ].map((client) => (
                    <div key={client.name} className="flex flex-col items-center min-w-[140px] group">
                      <div className="w-32 h-20 bg-white/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 border border-border/50">
                        <div className="text-center">
                          <div className="text-foreground font-bold text-sm mb-1">{client.name}</div>
                          <div className="text-muted-foreground text-xs">{client.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Duplicate set for seamless loop */}
                  {[
                    { name: 'TechCorp', desc: 'Enterprise Solutions' },
                    { name: 'EduVision', desc: 'Educational Platform' },
                    { name: 'HealthCare+', desc: 'Medical Systems' },
                    { name: 'FinanceAI', desc: 'Financial Services' },
                    { name: 'SmartGov', desc: 'Government Tech' },
                    { name: 'AgriTech', desc: 'Agricultural Innovation' },
                    { name: 'RetailPro', desc: 'Retail Solutions' },
                    { name: 'LogiMax', desc: 'Supply Chain' }
                  ].map((client, index) => (
                    <div key={`${client.name}-${index}`} className="flex flex-col items-center min-w-[140px] group">
                      <div className="w-32 h-20 bg-white/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 border border-border/50">
                        <div className="text-center">
                          <div className="text-foreground font-bold text-sm mb-1">{client.name}</div>
                          <div className="text-muted-foreground text-xs">{client.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 flex justify-center items-center space-x-8 text-muted-foreground text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Active Clients</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      
      {/* Testimonials & Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by industry leaders across India
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how organizations are achieving breakthrough results with our AI solutions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Case Study 1 - Education */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">E</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">EduTech Institute</h4>
                  <p className="text-muted-foreground text-sm">Leading Educational Platform</p>
                </div>
              </div>
              
              <blockquote className="text-lg text-muted-foreground mb-6 italic">
                "VaridantAI's adaptive learning platform increased our student engagement by 85% and reduced dropout rates by 60%. The AI tutoring system has been transformational for our remote learning programs."
              </blockquote>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-xs text-muted-foreground">Engagement Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">60%</div>
                  <div className="text-xs text-muted-foreground">Dropout Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-xs text-muted-foreground">Students Impacted</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">DR</span>
                </div>
                <div>
                  <div className="font-semibold">Dr. Priya Sharma</div>
                  <div className="text-muted-foreground text-sm">Director of Technology</div>
                </div>
              </div>
            </div>
            
            {/* Case Study 2 - Healthcare */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Medicare Hospital Group</h4>
                  <p className="text-muted-foreground text-sm">Multi-specialty Healthcare Network</p>
                </div>
              </div>
              
              <blockquote className="text-lg text-muted-foreground mb-6 italic">
                "The AI diagnostic assistant has reduced our diagnosis time by 40% while improving accuracy by 25%. Patient satisfaction scores have reached an all-time high of 96%."
              </blockquote>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">40%</div>
                  <div className="text-xs text-muted-foreground">Faster Diagnosis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">25%</div>
                  <div className="text-xs text-muted-foreground">Better Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">96%</div>
                  <div className="text-xs text-muted-foreground">Patient Satisfaction</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AM</span>
                </div>
                <div>
                  <div className="font-semibold">Dr. Arjun Mehta</div>
                  <div className="text-muted-foreground text-sm">Chief Medical Officer</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/50 p-6 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">FS</span>
                </div>
                <div>
                  <div className="font-semibold">FinSecure Bank</div>
                  <div className="text-muted-foreground text-xs">Digital Banking</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic">
                "Fraud detection improved by 95% while reducing false positives by 70%. Outstanding results!"
              </p>
            </div>
            
            <div className="bg-white/50 p-6 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">ST</span>
                </div>
                <div>
                  <div className="font-semibold">SmartRetail Ltd</div>
                  <div className="text-muted-foreground text-xs">E-commerce</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic">
                "AI recommendations increased our sales by 45% and customer retention by 35%."
              </p>
            </div>
            
            <div className="bg-white/50 p-6 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AG</span>
                </div>
                <div>
                  <div className="font-semibold">AgroTech Solutions</div>
                  <div className="text-muted-foreground text-xs">Agriculture</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic">
                "Crop yield predictions helped us increase productivity by 30% and reduce waste by 50%."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Success Stories */}
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
            {/* Education Statistics */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-2xl">📚</div>
              </div>
              <div className="text-5xl font-bold text-primary mb-2 animate-count-up">75%</div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="text-lg font-semibold mb-2">Learning Efficiency Boost</div>
              <div className="text-muted-foreground">in 200+ partner educational institutions</div>
              <div className="mt-4 text-xs text-muted-foreground">
                Source: EdTech Impact Study 2024
              </div>
            </div>
            
            {/* Healthcare Statistics */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <div className="text-white text-2xl">🏥</div>
              </div>
              <div className="text-5xl font-bold text-primary mb-2 animate-count-up">40%</div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '40%'}}></div>
              </div>
              <div className="text-lg font-semibold mb-2">Faster Diagnostics</div>
              <div className="text-muted-foreground">with AI-assisted healthcare tools</div>
              <div className="mt-4 text-xs text-muted-foreground">
                Source: Healthcare Efficiency Report 2024
              </div>
            </div>
            
            {/* Finance Statistics */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-2xl">💰</div>
              </div>
              <div className="text-5xl font-bold text-primary mb-2 animate-count-up">95%</div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <div className="text-lg font-semibold mb-2">Financial Accuracy</div>
              <div className="text-muted-foreground">in fraud detection systems</div>
              <div className="mt-4 text-xs text-muted-foreground">
                Source: FinTech Security Analysis 2024
              </div>
            </div>
          </div>
          
          {/* Additional Impact Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary animate-count-up">500+</div>
              <div className="text-muted-foreground text-sm">Active Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary animate-count-up">₹50Cr+</div>
              <div className="text-muted-foreground text-sm">Cost Savings Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary animate-count-up">99.9%</div>
              <div className="text-muted-foreground text-sm">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary animate-count-up">24/7</div>
              <div className="text-muted-foreground text-sm">Support Coverage</div>
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
