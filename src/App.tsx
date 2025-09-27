import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/common/header";

// Import pages
import HomePage from "@/app/page";
import DashboardPage from "@/app/dashboard/page";
import ResultsPageWrapper from "@/components/results/results-page-wrapper";
import SettingsPage from "@/app/settings/page";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import BillingPage from "@/app/billing/page";
import ContactPage from "@/app/contact/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative flex min-h-dvh flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/results/:id" element={<ResultsPageWrapper />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}