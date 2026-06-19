import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  Flame, Droplets, Dumbbell, Zap, Plus, Trash2, Loader2,
  TrendingUp, Target, Brain, ArrowRight, Sparkles
} from "lucide-react";

const COLORS = ["#00ff78", "#00e5ff", "#ff6b35", "#a855f7"];

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

function StatCard({ icon: Icon, label, value, unit, max, color = "primary" }) {
  const pct = max ? Math.min((value / max) * 100, 100) : null;
  return (
    <div className="glass-card rounded-2xl p-5 neon-border-hover transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-black orbitron text-foreground">
        {value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </div>
      {pct !== null && (
        <div className="mt-3">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{Math.round(pct)}% of daily goal</div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logForm, setLogForm] = useState({ foodName: "", grams: 100, calories: "", protein: "", carbs: "", fat: "", water: "", mealType: "breakfast" });
  const [adding, setAdding] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const fetchAll = async () => {
    try {
      const [sRes, iRes, lRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/insights"),
        api.get("/logs?limit=8"),
      ]);
      setStats(sRes.data);
      setInsights(iRes.data);
      setLogs(lRes.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const addLog = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/logs", {
        ...logForm,
        calories: parseInt(logForm.calories) || 0,
        protein: logForm.protein ? parseFloat(logForm.protein) : null,
        carbs: logForm.carbs ? parseFloat(logForm.carbs) : null,
        fat: logForm.fat ? parseFloat(logForm.fat) : null,
        water: logForm.water ? parseFloat(logForm.water) : null,
      });
      setLogForm({ foodName: "", calories: "", protein: "", carbs: "", fat: "", water: "", mealType: "breakfast" });
      setShowLogForm(false);
      fetchAll();
    } catch { } finally { setAdding(false); }
  };

  const deleteLog = async (id) => {
    await api.delete(`/logs/${id}`);
    fetchAll();
  };
  const macroData = stats ? [
    { name: "Protein", value: Math.round(stats.todayProtein), fill: "#00ff78" },
    { name: "Carbs", value: Math.round(stats.todayCarbs), fill: "#00e5ff" },
    { name: "Fat", value: Math.round(stats.todayFat), fill: "#ff6b35" },
  ] : [];

  const insightColors = { info: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5", warning: "text-amber-400 border-amber-400/30 bg-amber-400/5", success: "text-primary border-primary/30 bg-primary/5", tip: "text-purple-400 border-purple-400/30 bg-purple-400/5" };

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-xl font-bold">
          Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {user?.goal?.replace("_", " ")} · {user?.mode === "veg" ? "Vegetarian" : "Non-Vegetarian"} · Track, Analyze, Thrive
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} label="Calories Today" value={stats?.todayCalories ?? 0} unit="kcal" max={stats?.calorieGoal ?? 2000} />
        <StatCard icon={Droplets} label="Water Intake" value={(stats?.todayWater ?? 0).toFixed(1)} unit="L" max={3} />
        <StatCard icon={Dumbbell} label="Protein" value={Math.round(stats?.todayProtein ?? 0)} unit="g" max={150} />
        <StatCard icon={Zap} label="Streak" value={stats?.streakDays ?? 0} unit="days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Weekly Calories
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats?.weeklyCalories ?? []}>
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,255,120,0.2)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#e5e7eb" }}
                cursor={{ fill: "rgba(0,255,120,0.05)" }}
              />
              <Bar dataKey="calories" fill="#00ff78" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Pie */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Today's Macros
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {macroData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,255,120,0.2)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {macroData.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: m.fill }} />
                  <span className="text-muted-foreground">{m.name}</span>
                </div>
                <span className="font-semibold">{m.value}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights + Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> AI Insights
          </h3>
          <div className="space-y-3">
            {insights.slice(0, 4).map((ins, i) => (
              <div key={i} className={`border rounded-xl px-4 py-3 text-sm ${insightColors[ins.severity]}`}>
                {ins.message}
              </div>
            ))}
            {insights.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">Log meals to get AI insights</p>
            )}
          </div>
          <Link href="/recommendations">
            <button className="w-full mt-4 neon-btn py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Get AI Diet Plan <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {/* Food Log */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" /> Today's Food Log
            </h3>
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="neon-btn-solid px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 font-bold"
            >
              <Plus className="w-3 h-3" /> Log Food
            </button>
          </div>

          {showLogForm && (
            <form onSubmit={addLog} className="mb-4 glass rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <input
                    placeholder="Food name *" required value={logForm.foodName}
                    onChange={async (e) => {

                      const value = e.target.value;

                      setLogForm({
                        ...logForm,
                        foodName: value
                      });

                      if (value.length > 2) {

                        try {

                          const res = await api.post(
                            "/food/analyze",
                            {

                              foodName: value,

                              grams: logForm.grams || 100

                            }
                          );
                          setLogForm(prev => ({

                            ...prev,

                            foodName: value,

                            calories:
                              res.data.calories || "",

                            protein:
                              res.data.macros?.protein || "",

                            carbs:
                              res.data.macros?.carbs || "",

                            fat:
                              res.data.macros?.fat || "",

                          }));

                        }

                        catch (err) {

                          console.log(err);

                        }

                      }

                    }}
                    className="w-full bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                  />
                </div>
                <input

                  placeholder="Quantity (grams)"
                  type="number"

                  value={logForm.grams}

                  onChange={e =>
                    setLogForm({
                      ...logForm,
                      grams: e.target.value
                    })
                  }

                  className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"

                  placeholder="Calories *" type="number" required value={logForm.calories}
                  onChange={e => setLogForm({ ...logForm, calories: e.target.value })}
                  className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <input
                  placeholder="Protein (g)" type="number" value={logForm.protein}
                  onChange={e => setLogForm({ ...logForm, protein: e.target.value })}
                  className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <input
                  placeholder="Carbs (g)" type="number" value={logForm.carbs}
                  onChange={e => setLogForm({ ...logForm, carbs: e.target.value })}
                  className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <input
                  placeholder="Water (L)" type="number" step="0.1" value={logForm.water}
                  onChange={e => setLogForm({ ...logForm, water: e.target.value })}
                  className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2">
                {mealTypes.map(m => (
                  <button key={m} type="button" onClick={() => setLogForm({ ...logForm, mealType: m })}
                    className={`flex-1 py-1.5 rounded-lg text-xs capitalize border transition-all ${logForm.mealType === m ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground"}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={adding} className="w-full neon-btn-solid py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Entry
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {logs.length === 0 && !showLogForm && (
              <p className="text-center text-muted-foreground text-sm py-6">No food logged today. Start tracking!</p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2.5 px-3 glass rounded-xl text-sm">
                <div>
                  <span className="font-medium">{log.foodName}</span>
                  <span className="text-xs text-muted-foreground ml-2 capitalize">{log.mealType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-xs">{log.calories} kcal</span>
                  <button onClick={() => deleteLog(log.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>

  );
}
