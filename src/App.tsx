
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ScoreboardProvider } from "./context/ScoreboardContext";
import Layout from "./components/Layout";

// Pages
import LandingPage from "./pages/LandingPage";
import Scoreboard from "./pages/Scoreboard";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import EventManagement from "./pages/admin/EventManagement";
import ScoreManagement from "./pages/admin/ScoreManagement";
import MedalManagement from "./pages/admin/MedalManagement";
import PublishScores from "./pages/admin/PublishScores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ScoreboardProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<Layout />}>
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="teams" element={<TeamManagement />} />
                  <Route path="events" element={<EventManagement />} />
                  <Route path="scores" element={<ScoreManagement />} />
                  <Route path="medals" element={<MedalManagement />} />
                  <Route path="publish" element={<PublishScores />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ScoreboardProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
