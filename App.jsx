import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./src/components/common/useAuth";
import { ParticleField } from "./src/components/common/Shared";

import Navbar          from "./src/components/common/Navbar";
import HomeSection     from "./src/components/common/HomeSection";
import RoleSelection   from "./src/components/common/RoleSelection";
import PoliceDashboard from "./src/components/police/PoliceDashboard";
import CaseDetails     from "./src/components/police/CaseDetails";

import LawyerDashboardPage   from "./src/components/lawyer/LawyerDashboardPage";
import LawyerCaseDetailsPage from "./src/components/lawyer/LawyerCaseDetailsPage";

import JudgeDashboardPage   from "./src/components/judge/JudgeDashboardPage";
import JudgeCaseDetailsPage from "./src/components/judge/JudgeCaseDetailsPage";

import "./App.css";

const LandingPage = () => (
  <>
    <HomeSection />
    <footer className="footer">
      <p>© 2025 Honora · Federal Evidence Management System · All Rights Reserved</p>
      <p className="footer-sub">Authorized Personnel Only · Unauthorized Access is a Federal Offense</p>
    </footer>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ParticleField />
        <Navbar />
        <Routes>
          <Route path="/"                          element={<LandingPage />} />
          <Route path="/role"                      element={<RoleSelection />} />
          <Route path="/dashboard/police"          element={<PoliceDashboard />} />
          <Route path="/dashboard/police/case/:id" element={<CaseDetails />} />

          <Route path="/dashboard/lawyer"          element={<LawyerDashboardPage />} />
          <Route path="/dashboard/lawyer/case/:id" element={<LawyerCaseDetailsPage />} />

          <Route path="/dashboard/judge"           element={<JudgeDashboardPage />} />
          <Route path="/dashboard/judge/case/:id"  element={<JudgeCaseDetailsPage />} />

          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}