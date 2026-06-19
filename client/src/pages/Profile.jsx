import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { User, Save, Loader2, CheckCircle, Activity } from "lucide-react";

const goals = ["weight_loss", "weight_gain", "muscle_gain", "maintenance"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    goal: user?.goal || "maintenance",
    mode: user?.mode || "veg",
    age: user?.age || "",
    weight: user?.weight || "",
    height: user?.height || "",
    state: user?.state || "",
    region: user?.region || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const bmi = form.weight && form.height
    ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1)
    : null;
  const bmiLabel = bmi ? (bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese") : null;
  const bmiColor = bmi ? (bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-primary" : bmi < 30 ? "text-amber-400" : "text-red-400") : "";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/auth/profile", {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
      });
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { } finally { setSaving(false); }
  };

  return (
    <AppLayout title="My Profile">
      <div className="max-w-2xl mx-auto">
        {/* Avatar & Info */}
        <div className="glass-card rounded-3xl p-6 mb-6 text-center border border-primary/10">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <span className="text-primary text-3xl font-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <h2 className="orbitron text-xl font-black text-foreground">{user?.name}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="px-3 py-1 neon-btn rounded-full text-xs font-bold text-primary capitalize">
              {user?.role}
            </span>
            {user?.goal && (
              <span className="px-3 py-1 glass rounded-full text-xs text-muted-foreground capitalize border border-border">
                {user.goal.replace("_", " ")}
              </span>
            )}
          </div>

          {/* BMI Card */}
          {bmi && (
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="glass rounded-2xl py-3"><div className="font-black text-lg">{form.age || "—"}</div><div className="text-xs text-muted-foreground">Age</div></div>
              <div className="glass rounded-2xl py-3">
                <div className={`font-black text-lg orbitron ${bmiColor}`}>{bmi}</div>
                <div className="text-xs text-muted-foreground">BMI · {bmiLabel}</div>
              </div>
              <div className="glass rounded-2xl py-3"><div className="font-black text-lg">{form.weight || "—"}<span className="text-xs font-normal">kg</span></div><div className="text-xs text-muted-foreground">Weight</div></div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 space-y-5">
          <h3 className="font-bold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Edit Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">State / Region</label>
              <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Punjab" className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground">Health Goal</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {goals.map(g => (
                <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all capitalize ${form.goal === g ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {g.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground">Diet Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {[["veg", "Vegetarian"], ["non_veg", "Non-Vegetarian"]].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setForm({ ...form, mode: v })}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${form.mode === v ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["age", "Age", "yrs"], ["weight", "Weight", "kg"], ["height", "Height", "cm"]].map(([k, lbl, unit]) => (
              <div key={k}>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{lbl} ({unit})</label>
                <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  placeholder="—" min="0"
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground" />
              </div>
            ))}
          </div>

          <button type="submit" disabled={saving}
            className="w-full neon-btn-solid py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
