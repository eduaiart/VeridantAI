import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import Home from "@/pages/home";
import InternshipsPage from "@/pages/internships";
import InternshipDetailPage from "@/pages/internship-detail";
import VerifyPage from "@/pages/verify";
import AdminDashboard from "@/pages/admin/dashboard";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import RequireHirePage from "@/pages/solutions/requirehire";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/internships" component={InternshipsPage} />
      <Route path="/internships/:id" component={InternshipDetailPage} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/verify/:token" component={VerifyPage} />
      <Route path="/solutions/requirehire" component={RequireHirePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
