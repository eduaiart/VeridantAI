import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Download
} from "lucide-react";
import type { InternshipApplication, InternshipProgram } from "@shared/schema";

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
    onSuccess: (data) => {
      toast({
        title: "Certificate Generated",
        description: `Certificate ${data.certificateNumber} has been created.`,
      });
      window.open(`/api/certificates/${data.id}/download`, "_blank");
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
    onSuccess: (data) => {
      toast({
        title: "Offer Letter Generated",
        description: `Offer letter ${data.offerNumber} has been created.`,
      });
      window.open(`/api/offer-letters/${data.id}/download`, "_blank");
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
        </Tabs>
      </div>
    </div>
  );
}
