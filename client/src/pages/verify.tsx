import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Award, 
  FileText,
  Calendar,
  User,
  Briefcase,
  AlertTriangle
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface CertificateVerification {
  valid: boolean;
  message?: string;
  reason?: string;
  certificate?: {
    certificateNumber: string;
    recipientName: string;
    programTitle: string;
    certificateType: string;
    issueDate: string;
    grade?: string;
    mentorName?: string;
  };
}

interface OfferVerification {
  valid: boolean;
  message?: string;
  offerLetter?: {
    offerNumber: string;
    recipientName: string;
    position: string;
    department?: string;
    startDate?: string;
    status: string;
  };
}

export default function VerifyPage() {
  const [, params] = useRoute("/verify/:token");
  const [verificationCode, setVerificationCode] = useState(params?.token || "");
  const [activeTab, setActiveTab] = useState("certificate");

  useEffect(() => {
    if (params?.token) {
      setVerificationCode(params.token);
      // Auto-verify if token is in URL
      certificateMutation.mutate(params.token);
    }
  }, [params?.token]);

  const certificateMutation = useMutation<CertificateVerification, Error, string>({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/verify/certificate/${token}`);
      return response.json();
    },
  });

  const offerMutation = useMutation<OfferVerification, Error, string>({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/verify/offer/${token}`);
      return response.json();
    },
  });

  const handleVerify = () => {
    if (!verificationCode) return;
    
    if (activeTab === "certificate") {
      certificateMutation.mutate(verificationCode);
    } else {
      offerMutation.mutate(verificationCode);
    }
  };

  const renderCertificateResult = () => {
    if (certificateMutation.isPending) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verifying certificate...</p>
        </div>
      );
    }

    if (!certificateMutation.data) return null;

    if (certificateMutation.data.valid && certificateMutation.data.certificate) {
      const cert = certificateMutation.data.certificate;
      return (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-green-700 mb-6">
              Certificate Verified Successfully
            </h3>
            
            <div className="space-y-4 bg-white rounded-lg p-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Number</p>
                  <p className="font-semibold">{cert.certificateNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Recipient Name</p>
                  <p className="font-semibold">{cert.recipientName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-semibold">{cert.programTitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <Badge>{cert.certificateType.replace(/_/g, " ").toUpperCase()}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-semibold">
                    {new Date(cert.issueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              
              {cert.grade && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-semibold">{cert.grade}</p>
                  </div>
                </div>
              )}
              
              {cert.mentorName && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mentor</p>
                    <p className="font-semibold">{cert.mentorName}</p>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              This certificate is issued by VeridantAI Solution Private Limited
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              {certificateMutation.data.reason ? (
                <AlertTriangle className="w-10 h-10 text-orange-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-red-700 mb-4">
            {certificateMutation.data.reason ? "Certificate Revoked" : "Certificate Not Found"}
          </h3>
          <p className="text-center text-muted-foreground">
            {certificateMutation.data.message}
          </p>
          {certificateMutation.data.reason && (
            <p className="text-center text-sm text-red-600 mt-2">
              Reason: {certificateMutation.data.reason}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderOfferResult = () => {
    if (offerMutation.isPending) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verifying offer letter...</p>
        </div>
      );
    }

    if (!offerMutation.data) return null;

    if (offerMutation.data.valid && offerMutation.data.offerLetter) {
      const offer = offerMutation.data.offerLetter;
      return (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-green-700 mb-6">
              Offer Letter Verified Successfully
            </h3>
            
            <div className="space-y-4 bg-white rounded-lg p-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Offer Number</p>
                  <p className="font-semibold">{offer.offerNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Recipient Name</p>
                  <p className="font-semibold">{offer.recipientName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-4 border-b">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-semibold">{offer.position}</p>
                </div>
              </div>
              
              {offer.department && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{offer.department}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={
                    offer.status === "accepted" ? "bg-green-100 text-green-700" :
                    offer.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }>
                    {offer.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              This offer letter is issued by VeridantAI Solution Private Limited
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-red-700 mb-4">
            Offer Letter Not Found
          </h3>
          <p className="text-center text-muted-foreground">
            {offerMutation.data.message}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Document Verification Portal</h1>
              <p className="text-muted-foreground">
                Verify the authenticity of certificates and offer letters issued by VeridantAI.
                Enter the verification code found on the document.
              </p>
            </div>

            {/* Verification Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Verify Document</CardTitle>
                <CardDescription>
                  Select the document type and enter the verification code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="certificate" data-testid="tab-verify-certificate">
                      <Award className="w-4 h-4 mr-2" />
                      Certificate
                    </TabsTrigger>
                    <TabsTrigger value="offer" data-testid="tab-verify-offer">
                      <FileText className="w-4 h-4 mr-2" />
                      Offer Letter
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                        placeholder="Enter verification code (e.g., A1B2C3D4E5F6)"
                        className="font-mono tracking-wider"
                        data-testid="input-verification-code"
                      />
                      <Button 
                        onClick={handleVerify}
                        disabled={!verificationCode || certificateMutation.isPending || offerMutation.isPending}
                        data-testid="button-verify"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      The verification code can be found at the bottom of your document or in the QR code.
                    </p>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Results */}
            {activeTab === "certificate" && certificateMutation.data && renderCertificateResult()}
            {activeTab === "offer" && offerMutation.data && renderOfferResult()}

            {/* Info Section */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Secure Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Each document has a unique verification code that cannot be forged.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instant Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Get immediate confirmation of document authenticity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
