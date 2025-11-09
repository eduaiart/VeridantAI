import { Shield, Lock, FileCheck, Eye, Server, Award } from "lucide-react";

export default function SecurityComplianceSection() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Bank-level encryption, secure data centers, and multi-layer security protocols to protect your sensitive information."
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description: "Strict data privacy policies compliant with Indian regulations including IT Act 2000 and DPDP Act 2023."
    },
    {
      icon: FileCheck,
      title: "Compliance Certified",
      description: "Our systems meet industry standards and regulatory requirements for healthcare (NABH), education (AICTE), and finance."
    },
    {
      icon: Eye,
      title: "Transparent AI",
      description: "Explainable AI models with full transparency on data usage, decision-making processes, and algorithmic fairness."
    },
    {
      icon: Server,
      title: "99.9% Uptime SLA",
      description: "Highly available infrastructure with redundancy, backup systems, and 24/7 monitoring for uninterrupted service."
    },
    {
      icon: Award,
      title: "ISO Compliant",
      description: "Following ISO 27001 information security standards and best practices for quality management systems."
    }
  ];

  const certifications = [
    "ISO 27001",
    "DPDP Act 2023",
    "IT Act 2000",
    "NABH Standards",
    "AICTE Guidelines",
    "SOC 2 Type II"
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-slate-600">Security</span> & <span className="text-[#0EA5E9]">Compliance</span> First
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We take data security and regulatory compliance seriously. Your trust is our top priority, and we build every solution with security at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300"
              data-testid={`card-security-${feature.title.toLowerCase().replace(/ /g, '-')}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">Certifications & Compliance Standards</h3>
            <p className="text-muted-foreground">
              We adhere to international and Indian regulatory standards
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-muted rounded-lg border border-border font-semibold text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300"
                data-testid={`badge-cert-${cert.toLowerCase().replace(/ /g, '-')}`}
              >
                {cert}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">
              Have specific security or compliance requirements?
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
              data-testid="button-discuss-compliance"
            >
              Discuss Your Requirements
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
