import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Activity, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // 💥 Wait completely for token insertion & backend profile validation
      const loginResponse = await login(form.email, form.password);
      
      if (loginResponse) {
        // 🔥 ULTIMATE FIRST-CLICK FIX: 
        // Using window.location.replace forces the entire application context 
        // to reload with the newly set localStorage token. No stale state can stop this.
        window.location.replace("/dashboard");
      } else {
        setError("Invalid email or password layout.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl neon-btn flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="orbitron text-xl font-bold text-primary neon-glow">NutriGuide AI</span>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 neon-border">
          <h1 className="orbitron text-2xl font-bold text-center mb-2 text-white">Welcome Back</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neon-btn-solid py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors">
                Create one
              </span>
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-primary/5 border border-primary/15 rounded-xl text-xs text-muted-foreground text-center">
            <span className="text-primary font-semibold">Demo:</span> admin@nutriguide.ai / password123
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/"><span className="hover:text-primary cursor-pointer transition-colors">← Back to Home</span></Link>
        </p>
      </motion.div>
    </div>
  );
}