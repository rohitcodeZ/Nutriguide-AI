import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { ShieldCheck, Users, ChefHat, Activity, Loader2, TrendingUp, Zap } from "lucide-react";

const COLORS = ["#00ff78", "#00e5ff", "#ff6b35", "#a855f7", "#f59e0b"];

export default function Admin() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    Promise.all([api.get("/admin/analytics"), api.get("/admin/users")])
      .then(([a, u]) => { setAnalytics(a.data); setUsers(u.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      </AppLayout>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: analytics?.totalUsers ?? 0, color: "text-primary" },
    { icon: ChefHat, label: "Total Recipes", value: analytics?.totalRecipes ?? 0, color: "text-cyan-400" },
    { icon: Activity, label: "Total Logs", value: analytics?.totalLogs ?? 0, color: "text-orange-400" },
    { icon: Zap, label: "Active Users", value: analytics?.activeUsers ?? 0, color: "text-purple-400" },
  ];

  const goalData = (analytics?.topGoals ?? []).map(g => ({
    name: g.goal?.replace("_", " ") || "Unknown",
    count: g.count,
  }));

  return (
    <AppLayout title="Admin Dashboard">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl neon-btn flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold">Platform Administration</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage NutriGuide AI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["overview", "users"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${tab === t ? "neon-btn text-primary border-primary/40" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 neon-border-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`orbitron text-3xl font-black ${s.color}`}>{s.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Goals Chart */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> User Goals Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={goalData}>
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,255,120,0.2)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#00ff78" radius={[6, 6, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Goals Breakdown
              </h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={goalData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="count" paddingAngle={3}>
                      {goalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,255,120,0.2)", borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {goalData.map((g, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground capitalize">{g.name}</span>
                      <span className="font-bold ml-auto">{g.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Platform Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-primary">{analytics?.signupsThisWeek ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">New Users This Week</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-cyan-400">{analytics?.activeUsers ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Active Users</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-orange-400">{analytics?.totalLogs ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Food Logs</div>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-sm">All Users ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Goal</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Mode</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">{u.name?.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 glass rounded-lg text-xs capitalize text-muted-foreground border border-border">
                        {u.goal?.replace("_", " ") || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground capitalize text-xs">{u.mode?.replace("_", " ") || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${u.role === "admin" ? "text-primary border-primary/30 bg-primary/10" : "text-muted-foreground border-border"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
