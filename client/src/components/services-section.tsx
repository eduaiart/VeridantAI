import { BookOpen, Heart, DollarSign, Lightbulb, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesSection() {
  const services = [
    {
      icon: BookOpen,
      title: "Education Technology",
      description: "Personalized learning platforms with adaptive AI tutoring, virtual classrooms, and intelligent performance insights.",
      features: [
        "Adaptive Learning Systems",
        "Virtual AI Tutoring", 
        "Interactive Classrooms"
      ]
    },
    {
      icon: Heart,
      title: "Healthcare Solutions",
      description: "AI-assisted diagnostics, hospital management systems, and patient engagement platforms for better healthcare delivery.",
      features: [
        "AI-Assisted Diagnostics",
        "Hospital Management",
        "Patient Engagement"
      ]
    },
    {
      icon: DollarSign,
      title: "Financial Technology",
      description: "Secure payment platforms, AI-driven financial advisory tools, and personal finance management solutions.",
      features: [
        "AI Financial Advisory",
        "Secure Payments",
        "Personal Finance Management"
      ]
    },
    {
      icon: Lightbulb,
      title: "AI Software Solutions",
      description: "Productivity tools, task automation, intelligent chatbots, and custom AI applications for everyday business needs.",
      features: [
        "Smart Automation",
        "AI Chatbots",
        "Custom Development"
      ]
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            The AI platform that transforms 
            <span className="text-enhanced-gradient"> every industry</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From education to healthcare, finance to productivity - our comprehensive AI solutions empower organizations across India to achieve breakthrough results.
          </p>
        </div>
        
        {/* Featured Product - RequireHire */}
        <div className="mb-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 border border-primary/20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Featured Product</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">RequireHire</h3>
              <p className="text-lg text-muted-foreground mb-6">
                India's first interview-first hiring platform. Get interviewed directly by companies - 
                no more endless applications. AI-powered screening, verified profiles, and direct HR access.
              </p>
              <ul className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  100% Free for Candidates
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  AI Skill Scoring
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Direct HR Access
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  50+ Indian Cities
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/solutions/requirehire">
                  <Button className="hero-gradient text-white">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="https://requirehire.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    Visit RequireHire.com
                  </Button>
                </a>
              </div>
            </div>
            <div className="w-full lg:w-80 h-48 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <Users className="w-16 h-16 mx-auto mb-2" />
                <div className="text-2xl font-bold">RequireHire</div>
                <div className="text-sm opacity-90">Interview-First Hiring</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
                data-testid={`card-service-${index}`}
              >
                <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-4 h-4 text-primary mr-2">✓</div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
