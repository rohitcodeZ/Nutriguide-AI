import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplets, 
  Zap, 
  Trash2 
} from "lucide-react";

const goals = [
  { value: "weight_loss", label: "Weight Loss", emoji: "⚡" },
  { value: "weight_gain", label: "Weight Gain", emoji: "💪" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "🏋️" },
  { value: "maintenance", label: "Maintenance", emoji: "⚖️" },
];
const activities = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light Activity" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Very Active" },
  { value: "very_active", label: "Athlete" },
];

function MealCard({ meal }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <div className="font-bold text-white">{meal.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{meal.time}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-sm">{meal.calories} kcal</span>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {meal.protein && <div className="text-center glass rounded-lg py-2 text-xs"><div className="text-primary font-bold">{meal.protein}g</div><div className="text-muted-foreground">Protein</div></div>}
            {meal.carbs && <div className="text-center glass rounded-lg py-2 text-xs"><div className="text-cyan-400 font-bold">{meal.carbs}g</div><div className="text-muted-foreground">Carbs</div></div>}
            {meal.fat && <div className="text-center glass rounded-lg py-2 text-xs"><div className="text-orange-400 font-bold">{meal.fat}g</div><div className="text-muted-foreground">Fat</div></div>}
          </div>
          <ul className="space-y-1.5">
            {meal.items?.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ rec, onDelete }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Stop click bleeding
    if (deleting) return;
    
    setDeleting(true);
    try {
      // Direct integration call to your backend handler
      await api.delete(`/recommendations/${rec._id || rec.id}`);
      onDelete(rec._id || rec.id);
    } catch (err) {
      console.error("Failed to delete diet plan:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="glass-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-all"
    >
      {/* Top Header Row featuring Tag details and our brand new Delete button */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full neon-btn capitalize">
              {rec.goal?.replace("_", " ")}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{rec.mode?.replace("_", "-")}</span>
          </div>
          <h3 className="font-bold text-lg text-white mt-1">{rec.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
        </div>

        {/* RE-CONFIGURED DELETE CONTROL ACTUATOR LINK */}
        <button
          onClick={handleDeleteClick}
          disabled={deleting}
          className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
          title="Delete Diet Plan"
        >
          {deleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center glass rounded-xl py-3"><Flame className="w-4 h-4 text-primary mx-auto mb-1" /><div className="text-sm font-bold text-white">{rec.totalCalories}</div><div className="text-[10px] text-muted-foreground">kcal</div></div>
        <div className="text-center glass rounded-xl py-3"><Dumbbell className="w-4 h-4 text-green-400 mx-auto mb-1" /><div className="text-sm font-bold text-white">{rec.protein ?? "—"}g</div><div className="text-[10px] text-muted-foreground">Protein</div></div>
        <div className="text-center glass rounded-xl py-3"><Wheat className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><div className="text-sm font-bold text-white">{rec.carbs ?? "—"}g</div><div className="text-[10px] text-muted-foreground">Carbs</div></div>
        <div className="text-center glass rounded-xl py-3"><Droplets className="w-4 h-4 text-orange-400 mx-auto mb-1" /><div className="text-sm font-bold text-white">{rec.fat ?? "—"}g</div><div className="text-[10px] text-muted-foreground">Fat</div></div>
      </div>

      <button onClick={() => setOpen(!open)} className="w-full neon-btn py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-primary bg-primary/5">
        {open ? "Hide" : "View"} Meal Plan {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {rec.meals?.map((meal, i) => <MealCard key={i} meal={meal} />)}
        </div>
      )}
    </motion.div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    goal: user?.goal || "maintenance",
    mode: user?.mode || "veg",
    activityLevel: "moderate",
    age: user?.age || "",
    weight: user?.weight || "",
    height: user?.height || "",
  });

  useEffect(() => {
    api.get("/recommendations").then(r => setRecs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/recommendations", {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
      });
      setRecs([res.data, ...recs]);
    } catch { } finally { setGenerating(false); }
  };

  // State filtering sync handler to remove the card from the UI instantly
  const handleRemoveFromState = (id) => {
    setRecs(recs.filter(r => (r._id !== id && r.id !== id)));
  };

  return (
    <AppLayout title="AI Diet Plans">
      {/* Generator Panel */}
      <div className="glass-card rounded-3xl p-6 mb-6 border border-primary/15">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl neon-btn flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Diet Plan Generator</h2>
            <p className="text-sm text-muted-foreground">Get a personalized meal plan tailored to your goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Health Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map(g => (
                <button key={g.value} type="button" onClick={() => setForm({ ...form, goal: g.value })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${form.goal === g.value ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Diet Mode</label>
            <div className="space-y-2">
              {["veg", "non_veg"].map(m => (
                <button key={m} type="button" onClick={() => setForm({ ...form, mode: m })}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${form.mode === m ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {m === "veg" ? "🥦 Vegetarian" : "🍗 Non-Vegetarian"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Activity Level</label>
            <div className="space-y-2">
              {activities.slice(0, 4).map(a => (
                <button key={a.value} type="button" onClick={() => setForm({ ...form, activityLevel: a.value })}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-semibold border transition-all ${form.activityLevel === a.value ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {[["age", "Age (yrs)"], ["weight", "Weight (kg)"], ["height", "Height (cm)"]].map(([k, lbl]) => (
            <div key={k}>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{lbl}</label>
              <input
                type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                placeholder="—" min="0"
                className="w-28 bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-white"
              />
            </div>
          ))}
        </div>

        <button onClick={generate} disabled={generating}
          className="neon-btn-solid px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 disabled:opacity-60">
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {generating ? "Generating AI Plan..." : "Generate Diet Plan"}
        </button>
      </div>

      {/* Timeline Results Row Stack */}
      <div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : recs.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No plans yet. Generate your first AI diet plan above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {recs.map(rec => (
                <RecommendationCard 
                  key={rec._id || rec.id} 
                  rec={rec} 
                  onDelete={handleRemoveFromState} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}