import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Award, 
  Mail,
  LogOut,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Briefcase,
  UserPlus,
  Building2,
  Loader2,
  GraduationCap,
  Plus
} from "lucide-react";
import type { InternshipApplication, InternshipProgram, Employee, CollegeMou } from "@shared/schema";

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  shortlisted: number;
  selected: number;
  rejected: number;
  activePrograms: number;
  certificatesIssued: number;
  applicationsByStatus: Record<string, number>;
}

const statusColors: Record<string, string> = {
  submitted: "bg-gray-100 text-gray-700",
  under_review: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interview_scheduled: "bg-indigo-100 text-indigo-700",
  selected: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-emerald-100 text-emerald-700",
  withdrawn: "bg-orange-100 text-orange-700",
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertingApplication, setConvertingApplication] = useState<any>(null);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    salary: "",
    joiningDate: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showNewMouModal, setShowNewMouModal] = useState(false);
  const [newMouForm, setNewMouForm] = useState({
    collegeName: "",
    collegeAddress: "",
    collegeCity: "",
    collegeState: "",
    collegePincode: "",
    tpoName: "",
    tpoEmail: "",
    tpoPhone: "",
    signedDate: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      setLocation("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }
    
    setUser(parsedUser);
  }, []);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<(InternshipApplication & { programTitle: string })[]>({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const response = await fetch("/api/applications", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: programs = [] } = useQuery<InternshipProgram[]>({
    queryKey: ["/api/programs"],
    enabled: !!user,
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
    queryFn: async () => {
      const response = await fetch("/api/employees", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch employees");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: mous = [], isLoading: mousLoading } = useQuery<CollegeMou[]>({
    queryKey: ["/api/mous"],
    queryFn: async () => {
      const response = await fetch("/api/mous", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch MoUs");
      return response.json();
    },
    enabled: !!user,
  });

  const createMouMutation = useMutation({
    mutationFn: async (data: typeof newMouForm) => {
      const response = await fetch("/api/mous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create MoU");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mous"] });
      toast({
        title: "MoU Created",
        description: "The Memorandum of Understanding has been created successfully.",
      });
      setShowNewMouModal(false);
      setNewMouForm({
        collegeName: "",
        collegeAddress: "",
        collegeCity: "",
        collegeState: "",
        collegePincode: "",
        tpoName: "",
        tpoEmail: "",
        tpoPhone: "",
        signedDate: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadMouMutation = useMutation({
    mutationFn: async (mouId: string) => {
      const response = await fetch(`/api/mous/${mouId}/download`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to download MoU");
      const blob = await response.blob();
      return { blob, mouId };
    },
    onSuccess: ({ blob }, mouId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const mou = mous.find(m => m.id === mouId);
      a.download = `MoU-${mou?.mouNumber || mouId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMouStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/mous/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update MoU status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mous"] });
      toast({
        title: "Status Updated",
        description: "MoU status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const generateCertificateMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ applicationId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate certificate");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Certificate Generated",
        description: `Certificate ${data.certificateNumber} has been created.`,
      });
      // Download with authentication
      const response = await fetch(`/api/certificates/${data.id}/download`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${data.certificateNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateOfferLetterMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await fetch("/api/offer-letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ applicationId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate offer letter");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Offer Letter Generated",
        description: `Offer letter ${data.offerNumber} has been created.`,
      });
      // Download with authentication
      const response = await fetch(`/api/offer-letters/${data.id}/download`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offer-letter-${data.offerNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: typeof newEmployeeForm) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          designation: data.designation,
          department: data.department,
          salary: data.salary || null,
          joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : null,
          status: "onboarding",
          employmentType: "full_time",
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          pincode: data.pincode || null,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create employee");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setShowNewEmployeeModal(false);
      setNewEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        salary: "",
        joiningDate: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      toast({
        title: "Employee Created",
        description: "New employee has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEmployeeStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update employee status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setShowEmployeeModal(false);
      toast({
        title: "Status Updated",
        description: "Employee status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      });
    },
  });

  const convertInternMutation = useMutation({
    mutationFn: async ({ applicationId, designation, department, salary, joiningDate }: {
      applicationId: string;
      designation: string;
      department: string;
      salary?: number;
      joiningDate: string;
    }) => {
      const response = await fetch("/api/employees/convert-intern", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ applicationId, designation, department, salary, joiningDate }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to convert intern");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setShowConvertModal(false);
      setConvertingApplication(null);
      toast({
        title: "Intern Converted",
        description: "Intern has been successfully converted to employee.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateEmployeeOfferLetterMutation = useMutation({
    mutationFn: async ({ employeeId, salary, probationPeriod, noticePeriod }: {
      employeeId: string;
      salary?: string;
      probationPeriod?: string;
      noticePeriod?: string;
    }) => {
      const response = await fetch("/api/employee-offer-letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ employeeId, salary, probationPeriod, noticePeriod }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate offer letter");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Offer Letter Generated",
        description: `Offer letter ${data.offerNumber} has been created.`,
      });
      // Download with authentication
      const response = await fetch(`/api/employee-offer-letters/${data.id}/download`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employee-offer-letter-${data.offerNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-bold text-xl">
              <span className="text-slate-600">Veridant</span>
              <span className="text-[#0EA5E9]">AI</span>
              <span className="text-muted-foreground text-sm ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.firstName || user.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview" data-testid="tab-admin-overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-admin-applications">
              <FileText className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="programs" data-testid="tab-admin-programs">
              <Users className="w-4 h-4 mr-2" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-admin-certificates">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="employees" data-testid="tab-admin-employees">
              <Briefcase className="w-4 h-4 mr-2" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="mous" data-testid="tab-admin-mous">
              <GraduationCap className="w-4 h-4 mr-2" />
              College MoUs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                        <p className="text-3xl font-bold">{stats?.totalApplications || 0}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-3xl font-bold">{stats?.pendingReview || 0}</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-100">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Selected</p>
                        <p className="text-3xl font-bold">{stats?.selected || 0}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Programs</p>
                        <p className="text-3xl font-bold">{stats?.activePrograms || 0}</p>
                      </div>
                      <div className="p-3 rounded-full bg-purple-100">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Application Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.entries(stats?.applicationsByStatus || {}).map(([status, count]) => (
                      <div key={status} className="text-center p-4 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {status.replace(/_/g, " ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest 5 applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{app.firstName} {app.lastName}</p>
                            <p className="text-sm text-muted-foreground">{app.programTitle}</p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {app.resumeUrl && <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">CV</span>}
                              {app.collegeIdUrl && <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">ID</span>}
                              {app.marksheetUrl && <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-1.5 py-0.5 rounded">MS</span>}
                              {(app.governmentIdUrl || app.bonafideCertificateUrl || app.panCardUrl) && <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.5 rounded">+Docs</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                              <Button variant="outline" size="sm" className="gap-1" data-testid={`button-download-resume-${app.id}`}>
                                <Download className="w-4 h-4" />
                                CV
                              </Button>
                            </a>
                          )}
                          {app.collegeIdUrl && (
                            <a href={app.collegeIdUrl} target="_blank" rel="noopener noreferrer" download>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="w-4 h-4" />
                                ID
                              </Button>
                            </a>
                          )}
                          {app.marksheetUrl && (
                            <a href={app.marksheetUrl} target="_blank" rel="noopener noreferrer" download>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="w-4 h-4" />
                                MS
                              </Button>
                            </a>
                          )}
                          <Button variant="secondary" size="sm" onClick={() => setSelectedApplication(app)} data-testid={`button-view-${app.id}`}>
                            View All
                          </Button>
                          <Badge className={statusColors[app.status || "submitted"]}>
                            {(app.status || "submitted").replace(/_/g, " ").toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(app.createdAt || "").toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Applications</CardTitle>
                    <CardDescription>Manage and review internship applications</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                        data-testid="input-search-applications"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40" data-testid="select-status-filter">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                        <SelectItem value="selected">Selected</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Application #</th>
                          <th className="text-left py-3 px-4 font-medium">Candidate</th>
                          <th className="text-left py-3 px-4 font-medium">Program</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((app) => (
                          <tr key={app.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {app.applicationNumber}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium flex items-center gap-2">
                                  {app.firstName} {app.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                  {app.resumeUrl && (
                                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">CV</span>
                                  )}
                                  {app.collegeIdUrl && (
                                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">ID</span>
                                  )}
                                  {app.marksheetUrl && (
                                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-1.5 py-0.5 rounded">MS</span>
                                  )}
                                  {(app.governmentIdUrl || app.bonafideCertificateUrl || app.panCardUrl) && (
                                    <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.5 rounded">+Docs</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{app.programTitle}</td>
                            <td className="py-3 px-4">
                              <Select 
                                value={app.status || "submitted"}
                                onValueChange={(value) => updateStatusMutation.mutate({ 
                                  id: app.id, 
                                  status: value 
                                })}
                              >
                                <SelectTrigger className="w-40">
                                  <Badge className={statusColors[app.status || "submitted"]}>
                                    {(app.status || "submitted").replace(/_/g, " ").toUpperCase()}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="submitted">Submitted</SelectItem>
                                  <SelectItem value="under_review">Under Review</SelectItem>
                                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                                  <SelectItem value="selected">Selected</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(app.createdAt || "").toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                                data-testid={`button-view-${app.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Detail Modal */}
            {selectedApplication && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Application Details</CardTitle>
                        <CardDescription>{selectedApplication.applicationNumber}</CardDescription>
                      </div>
                      <Button variant="ghost" onClick={() => setSelectedApplication(null)}>
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Program</p>
                        <p className="font-medium">{selectedApplication.programTitle}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {selectedApplication.address ? (
                            <>
                              {selectedApplication.address}
                              {selectedApplication.city && `, ${selectedApplication.city}`}
                              {selectedApplication.state && `, ${selectedApplication.state}`}
                              {selectedApplication.pincode && ` - ${selectedApplication.pincode}`}
                            </>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Qualification</p>
                        <p className="font-medium">{selectedApplication.highestQualification}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Institution</p>
                        <p className="font-medium">{selectedApplication.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <p className="font-medium capitalize">{selectedApplication.currentStatus || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CGPA</p>
                        <p className="font-medium">{selectedApplication.cgpa || "Not specified"}</p>
                      </div>
                    </div>
                    
                    {selectedApplication.coverLetter && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Cover Letter</p>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Document Downloads */}
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-medium">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.resumeUrl && (
                          <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="default" size="sm" className="gap-1" data-testid="button-download-resume">
                              <Download className="w-4 h-4" />
                              Resume
                            </Button>
                          </a>
                        )}
                        {selectedApplication.collegeIdUrl && (
                          <a href={selectedApplication.collegeIdUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="secondary" size="sm" className="gap-1" data-testid="button-download-college-id">
                              <Download className="w-4 h-4" />
                              College ID
                            </Button>
                          </a>
                        )}
                        {selectedApplication.bonafideCertificateUrl && (
                          <a href={selectedApplication.bonafideCertificateUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="secondary" size="sm" className="gap-1" data-testid="button-download-bonafide">
                              <Download className="w-4 h-4" />
                              Bonafide
                            </Button>
                          </a>
                        )}
                        {selectedApplication.governmentIdUrl && (
                          <a href={selectedApplication.governmentIdUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="secondary" size="sm" className="gap-1" data-testid="button-download-govt-id">
                              <Download className="w-4 h-4" />
                              Govt ID
                            </Button>
                          </a>
                        )}
                        {selectedApplication.marksheetUrl && (
                          <a href={selectedApplication.marksheetUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="secondary" size="sm" className="gap-1" data-testid="button-download-marksheet">
                              <Download className="w-4 h-4" />
                              Marksheet
                            </Button>
                          </a>
                        )}
                        {selectedApplication.panCardUrl && (
                          <a href={selectedApplication.panCardUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button variant="secondary" size="sm" className="gap-1" data-testid="button-download-pan">
                              <Download className="w-4 h-4" />
                              PAN Card
                            </Button>
                          </a>
                        )}
                      </div>
                      {!selectedApplication.resumeUrl && !selectedApplication.collegeIdUrl && 
                       !selectedApplication.bonafideCertificateUrl && !selectedApplication.governmentIdUrl && 
                       !selectedApplication.marksheetUrl && !selectedApplication.panCardUrl && (
                        <p className="text-sm text-muted-foreground">No documents uploaded</p>
                      )}
                    </div>

                    {/* External Links */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedApplication.linkedinUrl && (
                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">LinkedIn</Button>
                        </a>
                      )}
                      {selectedApplication.githubUrl && (
                        <a href={selectedApplication.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">GitHub</Button>
                        </a>
                      )}
                      {selectedApplication.portfolioUrl && (
                        <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">Portfolio</Button>
                        </a>
                      )}
                    </div>

                    {/* Generate Certificate/Offer Letter - Only for selected/completed status */}
                    {(selectedApplication.status === "selected" || selectedApplication.status === "completed") && (
                      <div className="space-y-3 pt-4 border-t">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Generate Documents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            onClick={() => generateOfferLetterMutation.mutate(selectedApplication.id)}
                            disabled={generateOfferLetterMutation.isPending}
                            className="gap-2"
                            data-testid="button-generate-offer-letter"
                          >
                            <FileText className="w-4 h-4" />
                            {generateOfferLetterMutation.isPending ? "Generating..." : "Generate Offer Letter"}
                          </Button>
                          <Button 
                            variant="secondary"
                            onClick={() => generateCertificateMutation.mutate(selectedApplication.id)}
                            disabled={generateCertificateMutation.isPending}
                            className="gap-2"
                            data-testid="button-generate-certificate"
                          >
                            <Award className="w-4 h-4" />
                            {generateCertificateMutation.isPending ? "Generating..." : "Generate Certificate"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PDFs will include QR codes for verification at veridantai.in/verify
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Internship Programs</CardTitle>
                <CardDescription>Manage available internship programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programs.map((program) => (
                    <Card key={program.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold">{program.title}</h3>
                          <Badge variant={program.isActive ? "default" : "secondary"}>
                            {program.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stipend:</span>
                            <span>{program.stipend || "Unpaid"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Seats:</span>
                            <span>{program.seats}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificates & Offer Letters</CardTitle>
                <CardDescription>Issue and manage certificates for completed internships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Certificate issuance feature coming soon.</p>
                  <p className="text-sm">Select completed interns to issue certificates.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <div className="space-y-6">
              {/* Employee Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Employees</p>
                        <p className="text-2xl font-bold">{employees.length}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Onboarding</p>
                        <p className="text-2xl font-bold">{employees.filter(e => e.status === "onboarding").length}</p>
                      </div>
                      <UserPlus className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{employees.filter(e => e.status === "active").length}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">On Leave</p>
                        <p className="text-2xl font-bold">{employees.filter(e => e.status === "on_leave").length}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Resigned/Terminated</p>
                        <p className="text-2xl font-bold">{employees.filter(e => e.status === "resigned" || e.status === "terminated").length}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Employee List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Employee Directory
                  </CardTitle>
                  <CardDescription>Manage company employees and their onboarding status</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeesLoading ? (
                    <div className="text-center py-8">Loading employees...</div>
                  ) : employees.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No employees yet.</p>
                      <p className="text-sm">Convert completed interns to employees or add new employees.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Employee ID</th>
                            <th className="text-left py-3 px-4 font-medium">Name</th>
                            <th className="text-left py-3 px-4 font-medium">Designation</th>
                            <th className="text-left py-3 px-4 font-medium">Department</th>
                            <th className="text-left py-3 px-4 font-medium">Joining Date</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((employee) => (
                            <tr key={employee.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <span className="font-mono text-sm">{employee.employeeId}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">{employee.designation}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">{employee.department}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={
                                  employee.status === "active" ? "bg-green-100 text-green-700" :
                                  employee.status === "onboarding" ? "bg-yellow-100 text-yellow-700" :
                                  employee.status === "on_leave" ? "bg-orange-100 text-orange-700" :
                                  "bg-red-100 text-red-700"
                                }>
                                  {employee.status?.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowEmployeeModal(true);
                                }}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Convert Interns Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Convert Completed Interns</CardTitle>
                  <CardDescription>Interns who have completed their internship can be converted to employees</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.filter(a => a.status === "completed").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No completed internships available for conversion.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.filter(a => a.status === "completed").map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{app.firstName} {app.lastName}</p>
                            <p className="text-sm text-muted-foreground">{app.email} • {app.applicationNumber}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => {
                            setConvertingApplication(app);
                            setShowConvertModal(true);
                          }}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Convert to Employee
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add New Employee Button */}
              <div className="flex justify-end">
                <Button onClick={() => setShowNewEmployeeModal(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Employee
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* College MoUs Tab */}
          <TabsContent value="mous">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">College MoU Management</h2>
                  <p className="text-sm text-muted-foreground">Manage partnership agreements with educational institutions</p>
                </div>
                <Button onClick={() => setShowNewMouModal(true)} data-testid="btn-new-mou">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New MoU
                </Button>
              </div>

              {mousLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : mous.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No MoUs Created</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first college partnership agreement.</p>
                    <Button onClick={() => setShowNewMouModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First MoU
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {mous.map((mou) => (
                    <Card key={mou.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{mou.collegeName}</h3>
                              <Badge
                                className={
                                  mou.status === "active" ? "bg-green-100 text-green-700" :
                                  mou.status === "draft" ? "bg-gray-100 text-gray-700" :
                                  mou.status === "expired" ? "bg-orange-100 text-orange-700" :
                                  "bg-red-100 text-red-700"
                                }
                              >
                                {mou.status?.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Ref: {mou.mouNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {mou.collegeAddress}
                              {mou.collegeCity && `, ${mou.collegeCity}`}
                              {mou.collegeState && `, ${mou.collegeState}`}
                            </p>
                            {mou.tpoName && (
                              <p className="text-sm text-muted-foreground">
                                TPO: {mou.tpoName} {mou.tpoEmail && `(${mou.tpoEmail})`}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                              {mou.signedDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Signed: {new Date(mou.signedDate).toLocaleDateString("en-IN")}
                                </span>
                              )}
                              {mou.validTo && (
                                <span className="flex items-center gap-1">
                                  Valid until: {new Date(mou.validTo).toLocaleDateString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {mou.status === "draft" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMouStatusMutation.mutate({ id: mou.id, status: "active" })}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Activate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadMouMutation.mutate(mou.id)}
                              disabled={downloadMouMutation.isPending}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee Details Modal */}
      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>View and manage employee information</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Employee ID</Label>
                  <p className="font-mono">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Select
                      value={selectedEmployee.status || "onboarding"}
                      onValueChange={(value) => {
                        updateEmployeeStatusMutation.mutate({ id: selectedEmployee.id, status: value });
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="resigned">Resigned</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{selectedEmployee.phone || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Designation</Label>
                  <p>{selectedEmployee.designation}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joining Date</Label>
                  <p>{selectedEmployee.joiningDate ? new Date(selectedEmployee.joiningDate).toLocaleDateString() : "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Salary</Label>
                  <p>{selectedEmployee.salary ? `₹${Number(selectedEmployee.salary).toLocaleString()}` : "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Employment Type</Label>
                  <p className="capitalize">{selectedEmployee.employmentType?.replace("_", " ") || "Full Time"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                if (selectedEmployee) {
                  generateEmployeeOfferLetterMutation.mutate({
                    employeeId: selectedEmployee.id,
                    salary: selectedEmployee.salary ? `₹${Number(selectedEmployee.salary).toLocaleString()}` : undefined,
                    probationPeriod: "3 months",
                    noticePeriod: "30 days",
                  });
                }
              }}
              disabled={generateEmployeeOfferLetterMutation.isPending}
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            >
              {generateEmployeeOfferLetterMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Offer Letter
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Employee Modal */}
      <Dialog open={showNewEmployeeModal} onOpenChange={setShowNewEmployeeModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter employee details to create a new record</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newEmployeeForm.firstName}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newEmployeeForm.lastName}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmployeeForm.email}
                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                placeholder="john.doe@veridantai.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newEmployeeForm.phone}
                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newEmployeeForm.address}
                onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, address: e.target.value })}
                placeholder="123 Main Street, Colony Name"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newEmployeeForm.city}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, city: e.target.value })}
                  placeholder="Patna"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newEmployeeForm.state}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, state: e.target.value })}
                  placeholder="Bihar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newEmployeeForm.pincode}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, pincode: e.target.value })}
                  placeholder="800001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={newEmployeeForm.designation}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, designation: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newEmployeeForm.department}
                  onValueChange={(value) => setNewEmployeeForm({ ...newEmployeeForm, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (₹)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newEmployeeForm.salary}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, salary: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={newEmployeeForm.joiningDate}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, joiningDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEmployeeModal(false)}>Cancel</Button>
            <Button
              onClick={() => createEmployeeMutation.mutate(newEmployeeForm)}
              disabled={createEmployeeMutation.isPending || !newEmployeeForm.firstName || !newEmployeeForm.lastName || !newEmployeeForm.email || !newEmployeeForm.designation || !newEmployeeForm.department}
            >
              {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Intern Modal */}
      <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Convert Intern to Employee</DialogTitle>
            <DialogDescription>
              {convertingApplication && `Converting ${convertingApplication.firstName} ${convertingApplication.lastName} to an employee`}
            </DialogDescription>
          </DialogHeader>
          {convertingApplication && (
            <ConvertInternForm
              application={convertingApplication}
              onSubmit={(data) => convertInternMutation.mutate(data)}
              isPending={convertInternMutation.isPending}
              onCancel={() => setShowConvertModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New MoU Modal */}
      <Dialog open={showNewMouModal} onOpenChange={setShowNewMouModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New College MoU</DialogTitle>
            <DialogDescription>Enter college details to generate a Memorandum of Understanding</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mou-collegeName">College Name *</Label>
              <Input
                id="mou-collegeName"
                value={newMouForm.collegeName}
                onChange={(e) => setNewMouForm({ ...newMouForm, collegeName: e.target.value })}
                placeholder="ABC College of Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mou-collegeAddress">College Address *</Label>
              <Textarea
                id="mou-collegeAddress"
                value={newMouForm.collegeAddress}
                onChange={(e) => setNewMouForm({ ...newMouForm, collegeAddress: e.target.value })}
                placeholder="Full street address of the college"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mou-collegeCity">City</Label>
                <Input
                  id="mou-collegeCity"
                  value={newMouForm.collegeCity}
                  onChange={(e) => setNewMouForm({ ...newMouForm, collegeCity: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mou-collegeState">State</Label>
                <Input
                  id="mou-collegeState"
                  value={newMouForm.collegeState}
                  onChange={(e) => setNewMouForm({ ...newMouForm, collegeState: e.target.value })}
                  placeholder="State"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mou-collegePincode">Pincode</Label>
              <Input
                id="mou-collegePincode"
                value={newMouForm.collegePincode}
                onChange={(e) => setNewMouForm({ ...newMouForm, collegePincode: e.target.value })}
                placeholder="800001"
              />
            </div>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">TPO / Contact Person (Optional)</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mou-tpoName">TPO Name</Label>
                  <Input
                    id="mou-tpoName"
                    value={newMouForm.tpoName}
                    onChange={(e) => setNewMouForm({ ...newMouForm, tpoName: e.target.value })}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mou-tpoEmail">Email</Label>
                    <Input
                      id="mou-tpoEmail"
                      type="email"
                      value={newMouForm.tpoEmail}
                      onChange={(e) => setNewMouForm({ ...newMouForm, tpoEmail: e.target.value })}
                      placeholder="tpo@college.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mou-tpoPhone">Phone</Label>
                    <Input
                      id="mou-tpoPhone"
                      value={newMouForm.tpoPhone}
                      onChange={(e) => setNewMouForm({ ...newMouForm, tpoPhone: e.target.value })}
                      placeholder="+91-9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mou-signedDate">MoU Date</Label>
              <Input
                id="mou-signedDate"
                type="date"
                value={newMouForm.signedDate}
                onChange={(e) => setNewMouForm({ ...newMouForm, signedDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowNewMouModal(false)}>Cancel</Button>
            <Button
              onClick={() => createMouMutation.mutate(newMouForm)}
              disabled={createMouMutation.isPending || !newMouForm.collegeName || !newMouForm.collegeAddress}
            >
              {createMouMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create MoU"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConvertInternForm({ 
  application, 
  onSubmit, 
  isPending, 
  onCancel 
}: { 
  application: any; 
  onSubmit: (data: any) => void; 
  isPending: boolean; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    designation: "",
    department: "",
    salary: "",
    joiningDate: new Date().toISOString().split('T')[0],
  });

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Intern Details</p>
        <p className="font-medium">{application.firstName} {application.lastName}</p>
        <p className="text-sm">{application.email}</p>
        <p className="text-sm text-muted-foreground">Application: {application.applicationNumber}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="conv-designation">Designation</Label>
        <Input
          id="conv-designation"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          placeholder="Junior Software Engineer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conv-department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => setFormData({ ...formData, department: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="conv-salary">Salary (₹)</Label>
          <Input
            id="conv-salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="50000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-joiningDate">Joining Date</Label>
          <Input
            id="conv-joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSubmit({
            applicationId: application.id,
            designation: formData.designation,
            department: formData.department,
            salary: formData.salary ? parseFloat(formData.salary) : undefined,
            joiningDate: formData.joiningDate,
          })}
          disabled={isPending || !formData.designation || !formData.department || !formData.joiningDate}
        >
          {isPending ? "Converting..." : "Convert to Employee"}
        </Button>
      </DialogFooter>
    </div>
  );
}
