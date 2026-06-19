import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

import {
  ChefHat,
  Loader2,
  Clock,
  Flame,
  X,
  Sparkles,
  Wand2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl overflow-hidden neon-border-hover transition-all cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className={`h-1.5 ${recipe.mode === "veg" ? "bg-primary" : "bg-orange-500"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${recipe.mode === "veg" ? "border-primary/40 text-primary bg-primary/10" : "border-orange-500/40 text-orange-400 bg-orange-500/10"}`}>
                {recipe.mode === "veg" ? "🥦 VEG" : "🍗 NON-VEG"}
              </span>
              <span className="text-[10px] text-muted-foreground">{recipe.category}</span>
            </div>
            <h3 className="font-bold text-base">{recipe.name}</h3>
            {recipe.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{recipe.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-primary" />{recipe.calories} kcal</span>
          {recipe.prepTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Prep: {recipe.prepTime}m</span>}
          {recipe.cookTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Cook: {recipe.cookTime}m</span>}
        </div>

        {open && (
          <div className="mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Ingredients</h4>
              <div className="flex flex-wrap gap-1.5">
                {recipe.ingredients?.map((ing, i) => (
                  <span key={i} className="text-xs px-2 py-1 glass rounded-lg border border-border">{ing}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Instructions</h4>
              <ol className="space-y-1.5">
                {recipe.instructions?.map((step, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div className="text-xs text-primary/70 mt-2">{open ? "▲ Hide details" : "▼ View recipe"}</div>
      </div>
    </motion.div>
  );
}

function DietPlanCard({ plan, onDelete }) {
  const [showMeals, setShowMeals] = useState(false);
  const data = plan.data?.[0] || plan.data;

  const title = data?.title || "AI-Generated Diet Plan";
  const desc = data?.description || "Personalized target meal logs configured by AI.";
  const kcal = data?.totalCalories || 1560;
  const p = data?.protein || 53;
  const c = data?.carbs || 252;
  const f = data?.fat || 39;
  const mealsList = data?.meals || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="p-6 glass-card rounded-2xl border border-primary/20 mb-4 position-relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 capitalize">
            {data?.goalTag || "Maintenance"}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-muted/40 text-muted-foreground bg-input/40 capitalize">
            {data?.modeTag || "Veg"}
          </span>
          <span className="text-[10px] text-muted-foreground pt-0.5">{plan.timestamp}</span>
        </div>
        
        <button
          onClick={() => onDelete(plan.id)}
          className="p-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1 text-xs font-bold"
          title="Delete Plan"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
        <div className="bg-input/20 border border-border/60 rounded-xl p-3 text-center">
          <span className="text-primary block text-xs mb-1">🔥 Cal</span>
          <p className="font-bold text-white text-sm sm:text-base">{kcal}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">kcal</span></p>
        </div>
        <div className="bg-input/20 border border-border/60 rounded-xl p-3 text-center">
          <span className="text-emerald-400 block text-xs mb-1">🥩 Prot</span>
          <p className="font-bold text-white text-sm sm:text-base">{p}g</p>
        </div>
        <div className="bg-input/20 border border-border/60 rounded-xl p-3 text-center">
          <span className="text-cyan-400 block text-xs mb-1">🌾 Carbs</span>
          <p className="font-bold text-white text-sm sm:text-base">{c}g</p>
        </div>
        <div className="bg-input/20 border border-border/60 rounded-xl p-3 text-center">
          <span className="text-amber-500 block text-xs mb-1">🥑 Fat</span>
          <p className="font-bold text-white text-sm sm:text-base">{f}g</p>
        </div>
      </div>

      <button
        onClick={() => setShowMeals(!showMeals)}
        className="w-full py-2.5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all flex items-center justify-center gap-2 text-xs font-bold text-primary bg-primary/5"
      >
        {showMeals ? (
          <>Hide Meal Plan <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>View Meal Plan <ChevronDown className="w-4 h-4" /></>
        )}
      </button>

      {showMeals && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
          {["breakfast", "lunch", "dinner", "snacks"].map((mKey) => {
            const meal = mealsList[mKey];
            return (
              <div key={mKey} className="p-4 bg-input/10 border border-border rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1 capitalize">{mKey}</span>
                {meal ? (
                  <>
                    <h5 className="font-semibold text-sm text-white">{meal.name}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">{meal.description}</p>
                    <span className="text-[11px] block mt-2 font-medium text-primary/80">🔥 {meal.calories} kcal</span>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">Not specified</p>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Recipes() {
  const { user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState("all");
  const [ingInput, setIngInput] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [showGen, setShowGen] = useState(false);
  const [genMode, setGenMode] = useState("veg");

  const [diets, setDiets] = useState([]);
  const [loadingDiet, setLoadingDiet] = useState(false);

  useEffect(() => {
    api
      .get(`/recipes?mode=${mode}&search=&limit=20`)
      .then((r) => setRecipes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mode]);

  /*
  ========================================
  AI RECIPE GENERATOR (SMART FIELD UNPACKING)
  ========================================
  */
  const generateFromIngredients = async () => {
    if (!ingInput.trim()) return;

    setGenerating(true);
    // Automatically split comma-separated text input fields if users type multiple words
    const targetIngredientsList = ingInput
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    try {
      const res = await api.post("/recipes/generate", { 
        ingredients: targetIngredientsList, 
        mode: genMode 
      });
      setGeneratedRecipes(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setGenerating(false);
    }
  };

  const generateDiet = async () => {
    try {
      setLoadingDiet(true);
      const response = await api.post("/recipes/generate", {
        mode: user?.mode || "veg",
        goal: user?.goal || "maintenance",
        age: user?.age || 22,
        weight: user?.weight || 70,
        height: user?.height || 170,
      });

      const newPlan = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: response.data,
      };
      setDiets([newPlan, ...diets]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDiet(false);
    }
  };

  const deleteDietPlan = (planId) => {
    setDiets(diets.filter((p) => p.id !== planId));
  };

  return (
    <AppLayout title="Recipes">
      {/* UPGRADED PREMIUM CONFIG BAR ROW */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 w-full">
        <div className="flex flex-1 gap-3 w-full">
          {["all", "veg", "non_veg"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold capitalize border transition-all duration-200 tracking-wide ${
                mode === m
                  ? "neon-btn text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-white"
              }`}
            >
              {m === "non_veg" ? "Non-Veg Only" : m.charAt(0).toUpperCase() + m.slice(1) + " Recipes"}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
          <button 
            onClick={generateDiet} 
            className="neon-btn-solid sm:px-8 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.98] w-full sm:w-auto whitespace-nowrap"
          >
            {loadingDiet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loadingDiet ? "Compiling Matrix..." : "Generate AI Diet Plan"}
          </button>

          <button 
            onClick={() => setShowGen(!showGen)} 
            className={`px-6 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 border transition-all duration-200 w-full sm:w-auto whitespace-nowrap ${
              showGen 
                ? "bg-primary/20 border-primary text-primary" 
                : "neon-btn border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Recipes Tool
          </button>
        </div>
      </div>

      {/* AI GENERATED DIETS LIST ACCORDION */}
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {diets.map((plan) => (
            <DietPlanCard key={plan.id} plan={plan} onDelete={deleteDietPlan} />
          ))}
        </AnimatePresence>
      </div>

      {/* INGREDIENT GENERATOR INTERFACE MODULE (+ ICON REMOVED) */}
      {showGen && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-primary/15">
          <h3 className="font-bold mb-4 flex items-center gap-2"><ChefHat className="w-5 h-5 text-primary" />AI Recipe Generator</h3>
          <p className="text-sm text-muted-foreground mb-4 font-medium">Enter your ingredients below (separate multiple items with a comma)</p>

          <div className="flex flex-col gap-3 mb-4">
            <input
              value={ingInput}
              onChange={(e) => setIngInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), generateFromIngredients())}
              placeholder="e.g., Paneer, Tomato, Onion, Capsicum"
              className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 mb-5">
            {["veg", "non_veg"].map((m) => (
              <button key={m} onClick={() => setGenMode(m)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${genMode === m ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground"}`}>{m === "non_veg" ? "Non-Veg Diet" : "Veg Diet"}</button>
            ))}
          </div>

          {/* Button only unlocked when user writes anything into input box layout */}
          <button 
            onClick={generateFromIngredients} 
            disabled={generating || !ingInput.trim()} 
            className="neon-btn-solid px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Searching Groq Clusters..." : "Generate Recipes"}
          </button>

          {generatedRecipes.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full flex justify-between items-center mb-1">
                <h4 className="text-sm font-bold text-muted-foreground">Generated Results</h4>
                <button onClick={() => setGeneratedRecipes([])} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Clear Recipes</button>
              </div>
              {generatedRecipes.map((r, i) => (
                <RecipeCard
                  key={r.id || r._id || i}
                  recipe={{
                    id: r.id || i,
                    name: r.name || "Unnamed AI Recipe",
                    description: r.description || "",
                    calories: r.calories || 0,
                    protein: r.protein || 0,
                    carbs: r.carbs || 0,
                    fat: r.fat || 0,
                    mode: r.mode || genMode,
                    category: r.category || "AI Generated",
                    ingredients: Array.isArray(r.ingredients) ? r.ingredients : ingInput.split(","),
                    instructions: Array.isArray(r.instructions) ? r.instructions : ["Prepare and serve fresh."],
                    prepTime: r.prepTime || 10,
                    cookTime: r.cookTime || 15,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* NORMAL DEFAULT RECIPES GRID DISPLAY */}
      <div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((r) => <RecipeCard key={r._id || r.id} recipe={r} />)}
            {recipes.length === 0 && (
              <div className="col-span-full text-center py-16">
                <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recipes found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}