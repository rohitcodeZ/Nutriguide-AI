import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles, ChefHat, Scan, MapPin, Activity, ArrowRight,
  Zap, Shield, Globe, Brain, Star, TrendingUp
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI Diet Plans", desc: "Personalized plans for weight loss, gain, muscle building & maintenance", color: "from-green-500/20 to-emerald-500/10" },
  { icon: ChefHat, title: "Recipe Generator", desc: "Enter ingredients and get AI-curated Indian & global recipes instantly", color: "from-cyan-500/20 to-blue-500/10" },
  { icon: Scan, title: "Food Analyzer", desc: "Analyze any food's nutrition, calories, macros and health score", color: "from-purple-500/20 to-violet-500/10" },
  { icon: MapPin, title: "Regional Diets", desc: "Discover authentic diet plans from every Indian state and global region", color: "from-orange-500/20 to-amber-500/10" },
  { icon: Globe, title: "Weather-Based Tips", desc: "Smart food suggestions based on your local season and climate", color: "from-teal-500/20 to-green-500/10" },
  { icon: TrendingUp, title: "Analytics Dashboard", desc: "Track calories, water, macros with stunning real-time charts", color: "from-pink-500/20 to-rose-500/10" },
];

const stats = [
  { value: "50K+", label: "Users Tracked" },
  { value: "2000+", label: "Recipes Available" },
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "28", label: "Indian States Covered" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background grid-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg neon-btn flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="orbitron text-lg font-bold text-primary neon-glow">NutriGuide AI</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <button className="neon-btn-solid px-5 py-2 rounded-xl text-sm font-bold">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-muted-foreground hover:text-foreground text-sm transition-colors px-4 py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="neon-btn-solid px-5 py-2 rounded-xl text-sm font-bold">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-btn mb-8 text-xs font-semibold tracking-widest uppercase"
          >
            <Zap className="w-3 h-3" />
            AI-Powered Nutrition Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="orbitron text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Your Personal
            <br />
            <span className="text-primary neon-glow">AI Nutritionist</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover personalized Indian & global diet plans, analyze food nutrition,
            generate recipes from ingredients — all powered by cutting-edge AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <button className="neon-btn-solid px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 group">
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="neon-btn px-8 py-4 rounded-2xl text-base font-semibold">
                Sign In
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="glass-card rounded-3xl border border-primary/15 p-6 animate-pulse-glow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-4 glass rounded-2xl">
                  <div className="orbitron text-2xl md:text-3xl font-black text-primary neon-glow">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="orbitron text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="text-primary neon-glow"> Eat Right</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From ancient Indian superfoods to global nutrition science — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 neon-border-hover transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl border border-primary/20 p-10 md:p-16 text-center relative overflow-hidden animate-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
              </div>
              <h2 className="orbitron text-3xl md:text-4xl font-black mb-4">
                Start Your <span className="text-primary neon-glow">Health Journey</span> Today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands of users who've transformed their nutrition with AI-powered guidance.
              </p>
              <Link href="/register">
                <button className="neon-btn-solid px-10 py-4 rounded-2xl text-base font-bold">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="orbitron text-xs text-primary">NutriGuide AI</span>
        </div>
        <p>AI-powered nutrition intelligence for a healthier tomorrow.</p>
      </footer>
    </div>
  );
}
