import { Redirect } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user.role !== "admin") return <Redirect to="/dashboard" />;
  return children;
}
