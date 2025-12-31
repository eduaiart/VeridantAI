import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { applicationFormSchema, type InternshipProgram } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  IndianRupee, 
  Users, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Search,
  BookOpen,
  Code,
  PenTool,
  TrendingUp,
  Shield,
  FileUp,
  FileCheck
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

export default function InternshipsPage() {
  const [selectedProgram, setSelectedProgram] = useState<InternshipProgram | null>(null);
  const [activeTab, setActiveTab] = useState("programs");
  const [applicationNumber, setApplicationNumber] = useState("");
  const { toast } = useToast();

  const { data: programs = [], isLoading } = useQuery<InternshipProgram[]>({
    queryKey: ["/api/programs"],
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      programId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
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
      setActiveTab("track");
      setApplicationNumber(data.application.applicationNumber);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const trackMutation = useMutation({
    mutationFn: async (appNumber: string) => {
      const response = await fetch(`/api/track/${appNumber}`);
      if (!response.ok) {
        throw new Error("Application not found");
      }
      return response.json();
    },
  });

  const handleApply = (program: InternshipProgram) => {
    setSelectedProgram(program);
    form.setValue("programId", program.id);
    setActiveTab("apply");
  };

  const onSubmit = (data: ApplicationFormData) => {
    applicationMutation.mutate(data);
  };

  const handleTrack = () => {
    if (applicationNumber) {
      trackMutation.mutate(applicationNumber);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4" data-testid="badge-internship">
              <GraduationCap className="w-4 h-4 mr-2" />
              Internship Program 2025
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Launch Your AI Career with VeridantAI
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our internship program and gain hands-on experience working on cutting-edge 
              AI projects. Learn from industry experts and build your career in technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setActiveTab("programs")}
                data-testid="button-view-programs"
              >
                View Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setActiveTab("track")}
                data-testid="button-track-application"
              >
                Track Application
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground text-sm">Interns Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-muted-foreground text-sm">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-muted-foreground text-sm">Programs Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">₹15K</div>
              <div className="text-muted-foreground text-sm">Avg. Stipend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
              <TabsTrigger value="programs" data-testid="tab-programs">Programs</TabsTrigger>
              <TabsTrigger value="apply" data-testid="tab-apply">Apply</TabsTrigger>
              <TabsTrigger value="track" data-testid="tab-track">Track</TabsTrigger>
            </TabsList>

            {/* Programs Tab */}
            <TabsContent value="programs" className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-3xl font-bold mb-4">Available Internship Programs</h2>
                <p className="text-muted-foreground">
                  Choose from our diverse range of internship opportunities across AI, engineering, design, and more.
                </p>
              </div>

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programs.map((program) => {
                    const Icon = departmentIcons[program.department] || Briefcase;
                    const colorClass = departmentColors[program.department] || "bg-gray-100 text-gray-700";
                    
                    return (
                      <Card 
                        key={program.id} 
                        className="hover:shadow-lg transition-shadow duration-300 group"
                        data-testid={`card-program-${program.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${colorClass}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary">
                              {program.seats} seats
                            </Badge>
                          </div>
                          <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                            {program.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {program.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2" />
                              {program.duration}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2" />
                              {program.location}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <IndianRupee className="w-4 h-4 mr-2" />
                              {program.stipend || "Unpaid"}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              {program.startDate ? new Date(program.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "TBD"}
                            </div>
                          </div>

                          {program.skills && program.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {program.skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {program.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{program.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <Button 
                            className="w-full" 
                            onClick={() => handleApply(program)}
                            data-testid={`button-apply-${program.id}`}
                          >
                            Apply Now
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Apply Tab */}
            <TabsContent value="apply">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>
                    {selectedProgram ? `Apply for ${selectedProgram.title}` : "Internship Application"}
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below to submit your application. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Program Selection */}
                      <FormField
                        control={form.control}
                        name="programId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Program *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-program">
                                  <SelectValue placeholder="Choose a program" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {programs.map((program) => (
                                  <SelectItem key={program.id} value={program.id}>
                                    {program.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                  <Input {...field} placeholder="Enter first name" data-testid="input-first-name" />
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
                                  <Input {...field} placeholder="Enter last name" data-testid="input-last-name" />
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
                                  <Input {...field} type="email" placeholder="your@email.com" data-testid="input-email" />
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
                                  <Input {...field} placeholder="+91 XXXXXXXXXX" data-testid="input-phone" />
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
                                    <SelectTrigger data-testid="select-qualification">
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
                                  <Input {...field} placeholder="University/College name" data-testid="input-institution" />
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
                                  <Input {...field} placeholder="e.g., Computer Science" data-testid="input-field-of-study" />
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
                                  <Input {...field} placeholder="e.g., 8.5 or 85%" data-testid="input-cgpa" />
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
                                    <SelectTrigger data-testid="select-status">
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
                                  <Input {...field} placeholder="https://linkedin.com/in/..." data-testid="input-linkedin" />
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
                                  <Input {...field} placeholder="https://github.com/..." data-testid="input-github" />
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
                                  <Input {...field} placeholder="https://..." data-testid="input-portfolio" />
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
                                data-testid="textarea-cover-letter"
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
                          {/* Resume */}
                          <div className="space-y-2">
                            <Label>Resume/CV</Label>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleDocumentUpload(e, "resumeUrl", "Resume")}
                              disabled={uploadingField === "resumeUrl"}
                              data-testid="input-resume"
                            />
                            {uploadedFiles.resumeUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.resumeUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">PDF or DOC format</p>
                          </div>

                          {/* College ID */}
                          <div className="space-y-2">
                            <Label>College ID Card</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "collegeIdUrl", "College ID", true)}
                              disabled={uploadingField === "collegeIdUrl"}
                              data-testid="input-college-id"
                            />
                            {uploadedFiles.collegeIdUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.collegeIdUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">PDF or Image</p>
                          </div>

                          {/* Bonafide Certificate */}
                          <div className="space-y-2">
                            <Label>Bonafide Certificate</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload(e, "bonafideCertificateUrl", "Bonafide Certificate")}
                              disabled={uploadingField === "bonafideCertificateUrl"}
                              data-testid="input-bonafide"
                            />
                            {uploadedFiles.bonafideCertificateUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.bonafideCertificateUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">PDF format</p>
                          </div>

                          {/* Government ID */}
                          <div className="space-y-2">
                            <Label>Government ID</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "governmentIdUrl", "Government ID", true)}
                              disabled={uploadingField === "governmentIdUrl"}
                              data-testid="input-govt-id"
                            />
                            {uploadedFiles.governmentIdUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.governmentIdUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">Aadhaar/Passport</p>
                          </div>

                          {/* Latest Marksheet */}
                          <div className="space-y-2">
                            <Label>Latest Marksheet</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleDocumentUpload(e, "marksheetUrl", "Marksheet")}
                              disabled={uploadingField === "marksheetUrl"}
                              data-testid="input-marksheet"
                            />
                            {uploadedFiles.marksheetUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.marksheetUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">PDF format</p>
                          </div>

                          {/* PAN Card */}
                          <div className="space-y-2">
                            <Label>PAN Card (Optional)</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,image/*"
                              onChange={(e) => handleDocumentUpload(e, "panCardUrl", "PAN Card", true)}
                              disabled={uploadingField === "panCardUrl"}
                              data-testid="input-pan"
                            />
                            {uploadedFiles.panCardUrl && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {uploadedFiles.panCardUrl}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">If available</p>
                          </div>
                        </div>
                        {uploadingField && (
                          <p className="text-sm text-muted-foreground">Uploading document...</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={applicationMutation.isPending || !!uploadingField}
                        data-testid="button-submit-application"
                      >
                        {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Track Tab */}
            <TabsContent value="track">
              <Card className="max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-6 h-6" />
                    Track Your Application
                  </CardTitle>
                  <CardDescription>
                    Enter your application number to check the status of your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input 
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                      placeholder="e.g., VAI-2025-0001"
                      data-testid="input-track-number"
                    />
                    <Button 
                      onClick={handleTrack}
                      disabled={!applicationNumber || trackMutation.isPending}
                      data-testid="button-track"
                    >
                      {trackMutation.isPending ? "Checking..." : "Track"}
                    </Button>
                  </div>

                  {trackMutation.isSuccess && trackMutation.data && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Application Number</span>
                            <span className="font-semibold">{trackMutation.data.applicationNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Program</span>
                            <span className="font-semibold">{trackMutation.data.programTitle}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={
                              trackMutation.data.status === "selected" ? "bg-green-100 text-green-700" :
                              trackMutation.data.status === "rejected" ? "bg-red-100 text-red-700" :
                              trackMutation.data.status === "shortlisted" ? "bg-blue-100 text-blue-700" :
                              "bg-yellow-100 text-yellow-700"
                            }>
                              {trackMutation.data.status.replace(/_/g, " ").toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Submitted On</span>
                            <span>{new Date(trackMutation.data.submittedAt).toLocaleDateString("en-IN")}</span>
                          </div>
                          {trackMutation.data.interviewDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Interview Date</span>
                              <span>{new Date(trackMutation.data.interviewDate).toLocaleDateString("en-IN")}</span>
                            </div>
                          )}
                          {trackMutation.data.statusNotes && (
                            <div className="pt-4 border-t">
                              <span className="text-muted-foreground text-sm">Notes:</span>
                              <p className="mt-1">{trackMutation.data.statusNotes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {trackMutation.isError && (
                    <div className="text-center p-6 bg-red-50 rounded-lg">
                      <p className="text-red-600">Application not found. Please check your application number.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join VeridantAI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our internship program is designed to give you real-world experience and prepare you for a successful career in AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code,
                title: "Real Projects",
                description: "Work on actual products that impact thousands of users"
              },
              {
                icon: Users,
                title: "Mentorship",
                description: "Learn directly from experienced industry professionals"
              },
              {
                icon: GraduationCap,
                title: "Certificate",
                description: "Receive a verified completion certificate"
              },
              {
                icon: Shield,
                title: "Job Opportunity",
                description: "Top performers get full-time job offers"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
