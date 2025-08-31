import { BookOpen, Heart, DollarSign, Lightbulb } from "lucide-react";

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
            <span className="text-gradient"> every industry</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From education to healthcare, finance to productivity - our comprehensive AI solutions empower organizations across India to achieve breakthrough results.
          </p>
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
