import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { applicationFormSchema, type InternshipProgram } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  IndianRupee, 
  Users, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  ArrowLeft,
  Code,
  PenTool,
  TrendingUp,
  BookOpen,
  FileUp,
  FileCheck,
  Target,
  Award,
  Lightbulb
} from "lucide-react";
import type { z } from "zod";

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

const departmentIcons: Record<string, any> = {
  engineering: Code,
  design: PenTool,
  marketing: TrendingUp,
  "data-science": BookOpen,
  product: Briefcase,
};

const departmentColors: Record<string, string> = {
  engineering: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  marketing: "bg-orange-100 text-orange-700",
  "data-science": "bg-green-100 text-green-700",
  product: "bg-indigo-100 text-indigo-700",
};

export default function InternshipDetailPage() {
  const [, params] = useRoute("/internships/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showApplication, setShowApplication] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const applicationFormRef = useRef<HTMLDivElement>(null);

  const handleApplyClick = () => {
    setShowApplication(true);
    setTimeout(() => {
      applicationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const programId = params?.id;

  const { data: program, isLoading, error } = useQuery<InternshipProgram>({
    queryKey: ["/api/programs", programId],
    queryFn: async () => {
      const response = await fetch(`/api/programs/${programId}`);
      if (!response.ok) throw new Error("Program not found");
      return response.json();
    },
    enabled: !!programId,
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      programId: programId || "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      highestQualification: "",
      institution: "",
      fieldOfStudy: "",
      graduationYear: undefined,
      cgpa: "",
      currentStatus: "",
      linkedinUrl: "",
      portfolioUrl: "",
      githubUrl: "",
      coverLetter: "",
      resumeUrl: "",
      collegeIdUrl: "",
      bonafideCertificateUrl: "",
      governmentIdUrl: "",
      marksheetUrl: "",
      panCardUrl: "",
    },
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof ApplicationFormData,
    label: string,
    allowImages: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${label} must be less than 5MB`,
        variant: "destructive",
      });
      return;
    }

    const pdfTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedTypes = allowImages ? [...pdfTypes, ...imageTypes] : pdfTypes;
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: allowImages ? "Please upload a PDF, Word document, or image" : "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setUploadingField(fieldName);
    try {
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");

      const { uploadURL, objectPath } = await response.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload file");

      form.setValue(fieldName, objectPath);
      setUploadedFiles(prev => ({ ...prev, [fieldName]: file.name }));
      toast({
        title: `${label} uploaded`,
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: `Failed to upload ${label}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setUploadingField(null);
    }
  };

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted!",
        description: `Your application number is ${data.application.applicationNumber}. Save this for tracking.`,
      });
      form.reset();
      setApplicationNumber(data.application.applicationNumber);
      setShowApplication(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    applicationMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-8">The internship program you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/internships")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  const Icon = departmentIcons[program.department] || Briefcase;
  const colorClass = departmentColors[program.department] || "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white mb-6"
              onClick={() => setLocation("/internships")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Internships
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className={`p-4 rounded-xl ${colorClass} w-fit`}>
                <Icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white">
                    {program.department.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    {program.seats} seats available
                  </Badge>
                  {program.isActive && (
                    <Badge className="bg-green-500 text-white">
                      Accepting Applications
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{program.title}</h1>
                <p className="text-xl text-white/90 mb-6">{program.description}</p>
                
                <div className="flex flex-wrap gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" />
                    <span>{program.stipend || "Unpaid"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Starts: {program.startDate ? new Date(program.startDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "TBD"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Message */}
        {applicationNumber && (
          <section className="py-6 bg-green-50 border-b border-green-200">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 text-green-700">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Application Submitted Successfully!</p>
                  <p className="text-sm">Your application number: <strong>{applicationNumber}</strong> - Save this to track your application.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Program Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Skills Required */}
                {program.skills && program.skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Skills You'll Learn & Use
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {program.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Learning Outcomes */}
                {program.learningOutcomes && program.learningOutcomes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Learning Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {program.learningOutcomes.map((outcome: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* What You'll Do */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      What You'll Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>Work on real-world projects with industry mentors</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>Collaborate with cross-functional teams</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>Participate in code reviews and design discussions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>Present your work to stakeholders</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>Build skills for a successful career in tech</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      What You'll Get
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Verified Certificate</p>
                          <p className="text-sm text-muted-foreground">Get a verified completion certificate</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Users className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Expert Mentorship</p>
                          <p className="text-sm text-muted-foreground">Learn from industry professionals</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Job Opportunity</p>
                          <p className="text-sm text-muted-foreground">Top performers get full-time offers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Code className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Real Projects</p>
                          <p className="text-sm text-muted-foreground">Work on production-level code</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Apply CTA */}
              <div className="space-y-6">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Apply Now</CardTitle>
                    <CardDescription>
                      Start your journey with VeridantAI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{program.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{program.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stipend</span>
                        <span className="font-medium">{program.stipend || "Unpaid"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats Left</span>
                        <span className="font-medium">{program.seats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span className="font-medium">
                          {program.startDate ? new Date(program.startDate).toLocaleDateString("en-IN") : "TBD"}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full hero-gradient text-white" 
                      size="lg"
                      onClick={handleApplyClick}
                      disabled={!program.isActive}
                    >
                      {program.isActive ? "Apply for This Position" : "Applications Closed"}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By applying, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Modal/Section */}
        {showApplication && (
          <section className="py-12 bg-muted/50" id="application-form" ref={applicationFormRef}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Apply for {program.title}</CardTitle>
                      <CardDescription>
                        Fill out the form below. All fields marked with * are required.
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowApplication(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Hidden Program ID */}
                      <input type="hidden" {...form.register("programId")} value={program.id} />

                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter first name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter last name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="your@email.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+91 XXXXXXXXXX" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Street address, Colony, Locality" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="City" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="State" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="6-digit pincode" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          Education
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="highestQualification"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Highest Qualification *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select qualification" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="10th">10th Standard</SelectItem>
                                    <SelectItem value="12th">12th Standard</SelectItem>
                                    <SelectItem value="diploma">Diploma</SelectItem>
                                    <SelectItem value="btech">B.Tech/B.E.</SelectItem>
                                    <SelectItem value="bsc">B.Sc</SelectItem>
                                    <SelectItem value="bca">BCA</SelectItem>
                                    <SelectItem value="mtech">M.Tech/M.E.</SelectItem>
                                    <SelectItem value="msc">M.Sc</SelectItem>
                                    <SelectItem value="mca">MCA</SelectItem>
                                    <SelectItem value="phd">PhD</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="University/College name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fieldOfStudy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field of Study</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Computer Science" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cgpa"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CGPA/Percentage</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 8.5 or 85%" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Professional Links */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Professional Links
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="currentStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="fresher">Fresher</SelectItem>
                                    <SelectItem value="working">Working Professional</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn URL</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://linkedin.com/in/..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="githubUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub URL</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://github.com/..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Portfolio URL</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <FormField
                        control={form.control}
                        name="coverLetter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Letter / Why should we select you?</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Tell us about yourself, your interests, and why you want to join this program..."
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Document Uploads */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileUp className="w-5 h-5" />
                          Upload Documents (All Optional, max 5MB each)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Resume/CV</Label>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleDocumentUpload(e, "resumeUrl", "Resume")}
                              disabled={uploadingField === "resumeUrl"}
                            />
                            {uploadedFiles.resumeUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.resumeUrl}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>College ID Card</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "collegeIdUrl", "College ID", true)}
                              disabled={uploadingField === "collegeIdUrl"}
                            />
                            {uploadedFiles.collegeIdUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.collegeIdUrl}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Bonafide Certificate</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload(e, "bonafideCertificateUrl", "Bonafide Certificate")}
                              disabled={uploadingField === "bonafideCertificateUrl"}
                            />
                            {uploadedFiles.bonafideCertificateUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.bonafideCertificateUrl}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Government ID (Aadhaar/Passport)</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "governmentIdUrl", "Government ID", true)}
                              disabled={uploadingField === "governmentIdUrl"}
                            />
                            {uploadedFiles.governmentIdUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.governmentIdUrl}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Latest Marksheet</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload(e, "marksheetUrl", "Marksheet")}
                              disabled={uploadingField === "marksheetUrl"}
                            />
                            {uploadedFiles.marksheetUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.marksheetUrl}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>PAN Card</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "panCardUrl", "PAN Card", true)}
                              disabled={uploadingField === "panCardUrl"}
                            />
                            {uploadedFiles.panCardUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.panCardUrl}
                              </p>
                            )}
                          </div>
                        </div>
                        {uploadingField && (
                          <p className="text-sm text-muted-foreground">Uploading document...</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full hero-gradient text-white" 
                        size="lg"
                        disabled={applicationMutation.isPending || !!uploadingField}
                      >
                        {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
