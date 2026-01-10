import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Target,
  Building2,
  GraduationCap,
  Globe,
  Sparkles,
  Video,
  FileText,
  MessageSquare,
  BarChart3,
  Clock,
  IndianRupee,
  Star,
  ArrowRight,
  Play,
  Award,
  TrendingUp,
  UserCheck,
  Search,
  Filter,
  Lock
} from "lucide-react";

export default function RequireHirePage() {
  const candidateBenefits = [
    {
      icon: IndianRupee,
      title: "100% Free Forever",
      description: "All features completely free for job seekers - no hidden charges, no premium upgrades needed."
    },
    {
      icon: Video,
      title: "AI-Powered Interviews",
      description: "Complete interviews at your convenience with our AI system. No scheduling hassles or waiting."
    },
    {
      icon: BarChart3,
      title: "Skill Score & Feedback",
      description: "Get instant AI-generated skill scores and detailed feedback to improve your performance."
    },
    {
      icon: Shield,
      title: "Privacy-First Approach",
      description: "Your personal details are never shared without your explicit consent. DPDPA 2023 compliant."
    },
    {
      icon: Target,
      title: "Direct HR Access",
      description: "Skip the resume pile. Get discovered by employers based on your interview performance."
    },
    {
      icon: FileText,
      title: "Free AI Tools",
      description: "Access AI Resume Builder, Resume Checker, Cover Letter Generator, and Interview Prep - all free."
    }
  ];

  const employerBenefits = [
    {
      icon: Filter,
      title: "Pre-Screened Candidates",
      description: "Access candidates already vetted through AI interviews with detailed skill assessments."
    },
    {
      icon: BarChart3,
      title: "Ranked Talent Pool",
      description: "Browse candidates ranked by AI skill scores. No more manual resume screening."
    },
    {
      icon: Clock,
      title: "Save 70% Hiring Time",
      description: "Skip initial screening - candidates come interview-ready with structured assessment reports."
    },
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "Every candidate is verified. No fake profiles, no resume padding, no time wasted."
    },
    {
      icon: Video,
      title: "Interview Recordings",
      description: "Review video recordings of AI interviews before deciding to connect with candidates."
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track hiring metrics, candidate quality scores, and optimize your recruitment process."
    }
  ];

  const howItWorksCandidate = [
    {
      step: "1",
      title: "Search Jobs",
      description: "Browse thousands of verified opportunities across India. Filter by role, location, salary, and company."
    },
    {
      step: "2",
      title: "Complete AI Interview",
      description: "Take a quick AI-powered interview at your convenience. Answer questions naturally - no pressure."
    },
    {
      step: "3",
      title: "Get Skill Scores",
      description: "Receive instant AI-generated skill scores and structured feedback on your performance."
    },
    {
      step: "4",
      title: "Get Discovered",
      description: "Top-scoring candidates get noticed by employers. Approve access requests and start real interviews!"
    }
  ];

  const howItWorksEmployer = [
    {
      step: "1",
      title: "Browse Ranked Candidates",
      description: "Access pre-screened talent ranked by AI skill scores. Filter by role, experience, and performance."
    },
    {
      step: "2",
      title: "View Interview Reports",
      description: "Review comprehensive AI interview summaries with skill scores and behavioral insights."
    },
    {
      step: "3",
      title: "Request Access",
      description: "Found a great match? Request to unlock their contact details with candidate approval."
    },
    {
      step: "4",
      title: "Hire with Confidence",
      description: "Conduct final interviews with candidates you already know are qualified. Faster decisions."
    }
  ];

  const useCases = [
    {
      icon: GraduationCap,
      title: "Campus Hiring",
      description: "AI-powered pre-screening for freshers before placement drives. Get interview-ready candidates with verified skill scores from Tier-1, 2, and 3 colleges.",
      highlight: "Perfect for: Mass recruitment, campus drives, fresher hiring"
    },
    {
      icon: Sparkles,
      title: "Startup Hiring",
      description: "Pre-vetted candidates with AI interview scores. No sourcing overhead - just browse ranked profiles and hire faster with affordable plans.",
      highlight: "Perfect for: Bootstrapped startups, early-stage companies"
    },
    {
      icon: Globe,
      title: "Pan-India Talent",
      description: "Verified interview performance from candidates across 50+ cities - Bangalore, Hyderabad, Pune, Chennai, Mumbai, Delhi NCR and beyond.",
      highlight: "Perfect for: Remote hiring, multi-location teams"
    }
  ];

  const pricing = [
    {
      name: "Candidate",
      price: "₹0",
      period: "forever",
      description: "100% FREE for job seekers",
      features: [
        "Unlimited interview opportunities",
        "AI-powered job matching",
        "Profile verification & badge",
        "Interview feedback reports",
        "AI Resume Builder & Checker",
        "AI Cover Letter Generator",
        "Interview Prep Tools",
        "24/7 support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Startup",
      price: "₹2,999",
      period: "/month",
      description: "For growing companies",
      features: [
        "Up to 50 interviews/month",
        "Advanced candidate filtering",
        "Custom interview templates",
        "Detailed analytics dashboard",
        "ATS integration",
        "Priority support",
        "Team collaboration tools",
        "7-day free trial"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹9,999",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited interviews",
        "Multi-location support",
        "White-label solution",
        "Advanced security features",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "30-day money back"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const stats = [
    { value: "50+", label: "Cities in India" },
    { value: "1000+", label: "Active Candidates" },
    { value: "100+", label: "Partner Companies" },
    { value: "70%", label: "Faster Hiring" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-sky-100 text-sky-700 hover:bg-sky-100">
                <Sparkles className="w-3 h-3 mr-1" />
                A VeridantAI Product
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get Interviewed.{" "}
                <span className="text-enhanced-gradient">Not Just Listed.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Direct access to company interviews — no more endless applications. 
                We verify your profile, companies interview you directly. 
                India's first interview-first hiring platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="hero-gradient text-white" asChild>
                  <a href="https://requirehire.com/register?role=candidate" target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4 mr-2" />
                    Start Your Interview Journey
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://requirehire.com/register?role=recruiter" target="_blank" rel="noopener noreferrer">
                    <Building2 className="w-4 h-4 mr-2" />
                    Find Talent Faster
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="text-enhanced-gradient">RequireHire?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're not just another job portal. We're revolutionizing how India hires.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-red-700">Traditional Job Portals</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        Bad resumes that waste screening time
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        Unqualified applicants flooding inbox
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        Time-wasting interviews with no-shows
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        Resume keyword stuffing & exaggeration
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        No way to verify claimed skills
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-green-700">RequireHire Delivers</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        Ranked candidates with AI skill scores
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        Structured summaries of interview performance
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        Interview-ready profiles with verified skills
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        Initial screening completed by AI
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        Strong profiles you can trust
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Table */}
              <div className="bg-card rounded-xl p-6 border">
                <div className="grid grid-cols-5 gap-4 text-center text-sm">
                  <div></div>
                  <div className="text-muted-foreground">Job Portals</div>
                  <div className="text-muted-foreground">Resume DBs</div>
                  <div className="text-muted-foreground">LinkedIn</div>
                  <div className="font-bold text-primary">RequireHire</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-center text-sm mt-4 py-3 border-t">
                  <div className="text-left text-muted-foreground">Pre-screened candidates</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>✅</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-center text-sm py-3 border-t">
                  <div className="text-left text-muted-foreground">AI skill scores</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>✅</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-center text-sm py-3 border-t">
                  <div className="text-left text-muted-foreground">Interview recordings</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>✅</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-center text-sm py-3 border-t">
                  <div className="text-left text-muted-foreground">Verified profiles</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>⚠️</div>
                  <div>✅</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Candidates */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700">For Job Seekers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to <span className="text-enhanced-gradient">Get Hired</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stop applying to hundreds of jobs. Let companies come to you based on your verified skills.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {candidateBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits for Employers */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-700">For Employers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hire <span className="text-enhanced-gradient">Interview-Ready</span> Talent
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Skip the resume pile. Get candidates who are already screened, scored, and ready to interview.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {employerBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="text-enhanced-gradient">RequireHire</span> Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Simple steps to transform your hiring or job search
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* For Candidates */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">
                  <Users className="w-6 h-6 inline mr-2 text-primary" />
                  For Candidates
                </h3>
                <div className="space-y-6">
                  {howItWorksCandidate.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Employers */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">
                  <Building2 className="w-6 h-6 inline mr-2 text-purple-600" />
                  For HR Teams
                </h3>
                <div className="space-y-6">
                  {howItWorksEmployer.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for the <span className="text-enhanced-gradient">Indian Market</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Designed specifically for India's unique recruitment challenges
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => {
                const IconComponent = useCase.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-4">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                      <p className="text-muted-foreground mb-4">{useCase.description}</p>
                      <p className="text-sm text-primary font-medium">{useCase.highlight}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Free Tools */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-700">100% Free</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Free AI Career Tools for <span className="text-enhanced-gradient">Candidates</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Level up your job search with our powerful AI-powered tools - completely free forever
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">AI Resume Builder</h3>
                  <p className="text-sm text-muted-foreground">Create professional resumes using AI templates</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Search className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">AI Resume Checker</h3>
                  <p className="text-sm text-muted-foreground">Get instant feedback and improve your score</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Cover Letter Generator</h3>
                  <p className="text-sm text-muted-foreground">Personalized cover letters for each job</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Video className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Interview Prep</h3>
                  <p className="text-sm text-muted-foreground">Practice with AI and ace your interviews</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Lock className="w-12 h-12 mx-auto mb-6 text-sky-400" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                100% Privacy-First Recruitment
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                We share anonymized interview results with employers - never personal details without candidate consent.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                  <Shield className="w-3 h-3 mr-1" />
                  DPDPA 2023 Compliant
                </Badge>
                <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  CAN-SPAM Safe
                </Badge>
                <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                  <Award className="w-3 h-3 mr-1" />
                  Ethical Recruiting
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Affordable Plans for <span className="text-enhanced-gradient">Every Need</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Transparent pricing designed for India's job market
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricing.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="hero-gradient text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'hero-gradient text-white' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <a href="https://requirehire.com/register" target="_blank" rel="noopener noreferrer">
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="max-w-3xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <IndianRupee className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-muted-foreground">UPI, Cards, Net Banking</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-muted-foreground">30-day Money Back</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <MessageSquare className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-muted-foreground">Hindi & English Support</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-muted-foreground">Scale as You Grow</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 hero-gradient text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of professionals who chose interviews over applications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="https://requirehire.com/register?role=candidate" target="_blank" rel="noopener noreferrer">
                    <Users className="w-4 h-4 mr-2" />
                    Start Interviewing Today
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <a href="https://requirehire.com/register?role=recruiter" target="_blank" rel="noopener noreferrer">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Find Talent Faster
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
