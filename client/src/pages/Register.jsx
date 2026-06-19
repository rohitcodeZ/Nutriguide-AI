
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
} from "lucide-react";

const goals = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "weight_gain", label: "Weight Gain" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "maintenance", label: "Maintenance" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    goal: "maintenance",
    mode: "veg",
    age: "",
    weight: "",
    height: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP STATES
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const set = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: v,
    }));

  /*
  ========================================
  SEND OTP
  ========================================
  */

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("OTP sent successfully");
        setOtpSent(true);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  REGISTER
  ========================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        ...form,
        otp,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight
          ? parseFloat(form.weight)
          : null,
        height: form.height
          ? parseFloat(form.height)
          : null,
      });

      setLocation("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Registration failed. Please try again."
      );

      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 right-1/3 w-[500px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl neon-btn flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>

              <span className="orbitron text-xl font-bold text-primary neon-glow">
                NutriGuide AI
              </span>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 neon-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="orbitron text-2xl font-bold">
                Create Account
              </h1>

              <p className="text-muted-foreground text-sm mt-1">
                Step {step} of 2
              </p>
            </div>

            <div className="flex gap-2">
              <div
                className={`w-8 h-1.5 rounded-full transition-all ${
                  step >= 1
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />

              <div
                className={`w-8 h-1.5 rounded-full transition-all ${
                  step >= 2
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={
              step === 2
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    setStep(2);
                  }
            }
          >
            {step === 1 && (
              <div className="space-y-4">
                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      set("name", e.target.value)
                    }
                    required
                    placeholder="Your name"
                    className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      set("email", e.target.value)
                    }
                    required
                    placeholder="you@example.com"
                    className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                  />

                  {/* SEND OTP BUTTON */}

                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="mt-3 w-full neon-btn py-3 rounded-xl font-semibold text-sm"
                  >
                    {loading
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </button>

                  {/* OTP INPUT */}

                  {otpSent && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">
                        Enter OTP
                      </label>

                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        placeholder="Enter 6 digit OTP"
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                      />
                    </div>
                  )}
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPass ? "text" : "password"
                      }
                      value={form.password}
                      onChange={(e) =>
                        set("password", e.target.value)
                      }
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPass(!showPass)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full neon-btn-solid py-3.5 rounded-xl font-bold text-sm"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* GOALS */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Health Goal
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {goals.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() =>
                          set("goal", g.value)
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          form.goal === g.value
                            ? "neon-btn text-primary border-primary/40"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MODE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Diet Preference
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {["veg", "non_veg"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          set("mode", m)
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          form.mode === m
                            ? "neon-btn text-primary border-primary/40"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {m === "veg"
                          ? "Vegetarian"
                          : "Non-Vegetarian"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BODY DETAILS */}

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["age", "Age"],
                    ["weight", "Weight (kg)"],
                    ["height", "Height (cm)"],
                  ].map(([k, label]) => (
                    <div key={k}>
                      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                        {label}
                      </label>

                      <input
                        type="number"
                        value={form[k]}
                        onChange={(e) =>
                          set(k, e.target.value)
                        }
                        placeholder="—"
                        min="0"
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>

                {/* BUTTONS */}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 neon-btn py-3.5 rounded-xl font-semibold text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 neon-btn-solid py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}

                    {loading
                      ? "Creating..."
                      : "Create Account"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-primary font-semibold cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
