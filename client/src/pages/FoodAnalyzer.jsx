import { useState, useRef } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

import {
  Scan,
  Loader2,
  Zap,
  Heart,
  CheckCircle,
  Search,
  Camera,
  X,
  VideoOff,
} from "lucide-react";

const quickFoods = [
  "Dal Makhani", "Paneer Tikka", "Biryani", "Dosa", "Idli", "Rajma",
  "Chole Bhature", "Samosa", "Butter Chicken", "Khichdi", "Aloo Paratha", "Poha",
];

function ScoreRing({ score }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#00ff78" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-black orbitron" style={{ color }}>{score}</div>
          <div className="text-[10px] text-muted-foreground">Health Score</div>
        </div>
      </div>
    </div>
  );
}

export default function FoodAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Camera & Image States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [image, setImage] = useState(null); // Holds the blob/file for upload
  const [preview, setPreview] = useState(""); // Holds string URL for UI render

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* ========================================
     FOOD NAME ANALYSIS
     ======================================== */
  const analyze = async (foodName) => {
    const name = foodName || input;
    if (!name.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/food/analyze", { foodName: name });
      setResult(res.data);
    } catch {
      setError("Could not analyze this food.");
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     IMAGE ANALYSIS
     ======================================== */
  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await api.post("/food/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch {
      setError("Could not analyze food image.");
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     IN-APP CAMERA ENGINE
     ======================================== */
  const startCamera = async () => {
    setError("");
    removeImage(); // Clear any previous snapshots

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Rear camera on mobile devices
        audio: false,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      setError("Camera access denied or device has no camera.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to blob so it behaves exactly like your native uploaded file input
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "food-capture.jpg", { type: "image/jpeg" });
        setImage(file);
        setPreview(URL.createObjectURL(file));
        stopCamera(); // Turn off camera stream once photo is taken
      }
    }, "image/jpeg");
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  return (
    <AppLayout title="Food Analyzer">
      <div className="max-w-3xl mx-auto">
        
        {/* MAIN CARD */}
        <div className="glass-card rounded-3xl p-6 mb-6 border border-primary/15">
          
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl neon-btn flex items-center justify-center">
              <Scan className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold">AI Food Analyzer</h2>
              <p className="text-sm text-muted-foreground">Analyze food using text or live camera view</p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder="e.g. Paneer, Biryani..."
                className="w-full bg-input/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => analyze()}
              disabled={loading || !input.trim()}
              className="neon-btn-solid px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Analyze
            </button>
          </div>

          {/* QUICK FOODS */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Quick Analyze</p>
            <div className="flex flex-wrap gap-2">
              {quickFoods.map((food) => (
                <button
                  key={food}
                  onClick={() => {
                    setInput(food);
                    analyze(food);
                  }}
                  className="px-3 py-1.5 glass rounded-xl text-xs border border-border hover:border-primary/40 hover:text-primary transition-all"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {/* REAL-TIME CAMERA SECTION */}
          <div className="glass rounded-2xl border border-dashed border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Food Image Analyzer</h3>
              </div>
              {isCameraActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>

            {/* BUTTON CONTROLS */}
            <div className="flex flex-wrap gap-3 mb-4">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="neon-btn-solid px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {preview ? "Retake Photo" : "Open Camera"}
                </button>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                  >
                    <Scan className="w-4 h-4" />
                    Snap Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-zinc-800 hover:bg-zinc-700 text-muted-foreground px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                  >
                    <VideoOff className="w-4 h-4" />
                    Close Camera
                  </button>
                </>
              )}

              {preview && !isCameraActive && (
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="neon-btn px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </button>
              )}
            </div>

            {/* LIVE CAMERA VIEWPORT */}
            {isCameraActive && (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video max-h-[350px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* SNAPSHOT PREVIEW */}
            {preview && !isCameraActive && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-[350px] object-cover rounded-2xl border border-border"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center transition-all hover:bg-black/80"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">AI analyzing food...</p>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* MAIN RESULT */}
            <div className="glass-card rounded-3xl p-6 border border-primary/15">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ScoreRing score={result.healthScore} />

                <div className="flex-1 text-center md:text-left">
                  <h2 className="orbitron text-2xl font-black text-foreground mb-1">
                    {result.foodName}
                  </h2>
                  <div className="text-4xl font-black text-primary neon-glow mb-2">
                    {result.calories}
                    <span className="text-lg font-normal text-muted-foreground"> kcal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">per 100g serving</p>
                </div>
              </div>

              {/* MACROS */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Protein", val: result.macros?.protein, unit: "g", color: "#00ff78" },
                  { label: "Carbs", val: result.macros?.carbs, unit: "g", color: "#00e5ff" },
                  { label: "Fat", val: result.macros?.fat, unit: "g", color: "#ff6b35" },
                  { label: "Fiber", val: result.macros?.fiber, unit: "g", color: "#a855f7" },
                ].map((m, i) => (
                  <div key={i} className="text-center glass rounded-2xl py-4">
                    <div className="text-xl font-black" style={{ color: m.color }}>
                      {m.val}{m.unit}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BENEFITS & ALTERNATIVES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Health Benefits
                </h3>
                <ul className="space-y-2">
                  {result.healthBenefits?.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Healthier Alternatives
                </h3>
                <div className="space-y-2">
                  {result.alternatives?.map((alt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(alt);
                        analyze(alt);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2.5 glass rounded-xl text-sm text-muted-foreground hover:text-primary hover:border-primary/30 border border-border transition-all"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}