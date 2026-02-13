import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Moon } from "lucide-react";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Moon className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
