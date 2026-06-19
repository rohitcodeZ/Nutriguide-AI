import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Recipes from "./pages/Recipes";
import FoodAnalyzer from "./pages/FoodAnalyzer";
import Suggestions from "./pages/Suggestions";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/recommendations">
        <ProtectedRoute><Recommendations /></ProtectedRoute>
      </Route>
      <Route path="/recipes">
        <ProtectedRoute><Recipes /></ProtectedRoute>
      </Route>
      <Route path="/food-analyzer">
        <ProtectedRoute><FoodAnalyzer /></ProtectedRoute>
      </Route>
      <Route path="/suggestions">
        <ProtectedRoute><Suggestions /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
      </Route>
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="orbitron text-6xl font-bold text-primary neon-glow mb-4">404</h1>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
