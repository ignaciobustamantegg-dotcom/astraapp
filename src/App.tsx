import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JourneyMap from "./components/JourneyMap";
import DayExperience from "./pages/DayExperience";
import DayExperience2 from "./pages/DayExperience2";
import DayExperience3 from "./pages/DayExperience3";
import DayExperience4 from "./pages/DayExperience4";
import DayExperience5 from "./pages/DayExperience5";
import DayExperience6 from "./pages/DayExperience6";
import DayExperience7 from "./pages/DayExperience7";
import Quiz from "./pages/Quiz";

import PostCheckout from "./pages/PostCheckout";
import GatedApp from "./pages/GatedApp";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/checkout" element={<Navigate to="/quiz" replace />} />
            <Route path="/post-checkout" element={<PostCheckout />} />
            <Route path="/app" element={<GatedApp />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/journey" element={<JourneyMap />} />
              <Route path="/journey/day/1" element={<DayExperience />} />
              <Route path="/journey/day/2" element={<DayExperience2 />} />
              <Route path="/journey/day/3" element={<DayExperience3 />} />
              <Route path="/journey/day/4" element={<DayExperience4 />} />
              <Route path="/journey/day/5" element={<DayExperience5 />} />
              <Route path="/journey/day/6" element={<DayExperience6 />} />
              <Route path="/journey/day/7" element={<DayExperience7 />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Navigate to="/journey" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
