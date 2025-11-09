import { Building2, GraduationCap, HeartPulse, Landmark, Tractor, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function IndustriesSection() {
  const { t } = useLanguage();

  const industries = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "Adaptive learning platforms, AI tutoring, virtual classrooms, and student performance analytics for K-12, higher education, and professional training.",
      stats: "200+ Institutions",
      color: "blue"
    },
    {
      icon: HeartPulse,
      title: "Healthcare",
      description: "AI-assisted diagnostics, hospital management systems, patient engagement platforms, and telemedicine solutions for better healthcare delivery.",
      stats: "150+ Hospitals",
      color: "green"
    },
    {
      icon: Landmark,
      title: "Finance & Banking",
      description: "Secure payment systems, AI-driven financial advisory, fraud detection, personal finance management, and digital banking solutions.",
      stats: "₹50Cr+ Processed",
      color: "purple"
    },
    {
      icon: Building2,
      title: "Enterprise & Government",
      description: "Workflow automation, intelligent chatbots, data analytics, document processing, and custom AI solutions for large organizations.",
      stats: "100+ Deployments",
      color: "indigo"
    },
    {
      icon: Tractor,
      title: "Agriculture",
      description: "Crop yield prediction, smart irrigation systems, pest detection, market price analysis, and farm management solutions for modern farming.",
      stats: "50+ AgriTech Projects",
      color: "amber"
    },
    {
      icon: ShoppingBag,
      title: "Retail & E-commerce",
      description: "Personalized recommendations, inventory management, customer analytics, demand forecasting, and automated customer service.",
      stats: "75+ Retailers",
      color: "pink"
    }
  ];

  return (
    <section id="industries" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Industries we <span className="text-primary">serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI solutions power innovation across diverse sectors, helping organizations achieve breakthrough results and drive digital transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => {
            const bgColorClass = industry.color === 'blue' ? 'bg-blue-100' :
                                 industry.color === 'green' ? 'bg-green-100' :
                                 industry.color === 'purple' ? 'bg-purple-100' :
                                 industry.color === 'indigo' ? 'bg-indigo-100' :
                                 industry.color === 'amber' ? 'bg-amber-100' : 'bg-pink-100';
            
            const textColorClass = industry.color === 'blue' ? 'text-blue-600' :
                                   industry.color === 'green' ? 'text-green-600' :
                                   industry.color === 'purple' ? 'text-purple-600' :
                                   industry.color === 'indigo' ? 'text-indigo-600' :
                                   industry.color === 'amber' ? 'text-amber-600' : 'text-pink-600';
            
            return (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 group hover:scale-105"
                data-testid={`card-industry-${industry.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <div className={`w-16 h-16 rounded-xl ${bgColorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className={`w-8 h-8 ${textColorClass}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{industry.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {industry.description}
                </p>
                <div className="flex items-center space-x-2 text-sm font-semibold text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{industry.stats}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Don't see your industry? We create custom AI solutions for any sector.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            data-testid="button-discuss-custom-solution"
          >
            Discuss Your Custom Solution
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
