import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { 
  MapPin, 
  CloudSun, 
  Loader2, 
  CheckCircle, 
  Compass,
  UtensilsCrossed 
} from "lucide-react";

// 🇮🇳 ALL 28 INDIAN STATES + PREMIUM UT BLUEPRINTS INCLUDED
const statesList = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
].sort(); // Sorted alphabetically for cleaner grid layout mapping

export default function Suggestions() {
  const [tab, setTab] = useState("region"); // "region" or "season"
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedSeason, setSelectedSeason] = useState("summer");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  ========================================
  FETCH HANDLER (DYNAMICALLY TRIGGERS ON STATE/TAB CHANGES)
  ========================================
  */
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      if (tab === "region") {
        const res = await api.get(`/location?state=${encodeURIComponent(selectedState)}`);
        setSuggestions(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        const res = await api.get(`/weather?season=${selectedSeason}`);
        setSuggestions(Array.isArray(res.data) ? res.data : [res.data]);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [tab, selectedState, selectedSeason]);

  // Simulated live location tracker setup
  const handleLiveLocation = () => {
    setSelectedState("Punjab"); 
    setTab("region");
  };

  return (
    <AppLayout title="Dietary Suggestions">
      {/* TAB CONTROLS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("region")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
            tab === "region"
              ? "neon-btn text-primary border-primary/40"
              : "border-border text-muted-foreground hover:border-primary/20"
          }`}
        >
          <MapPin className="w-4 h-4" /> By Region
        </button>
        <button
          onClick={() => setTab("season")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
            tab === "season"
              ? "neon-btn text-primary border-primary/40"
              : "border-border text-muted-foreground hover:border-primary/20"
          }`}
        >
          <CloudSun className="w-4 h-4" /> By Season
        </button>
      </div>

      {/* REGIONAL FILTER CONTROL PANEL */}
      {tab === "region" && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-border">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Compass className="text-primary w-5 h-5" /> Select Indian State
            </h3>
            <button
              onClick={handleLiveLocation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 animate-bounce" /> Use Live Location
            </button>
          </div>

          <div className="text-sm mb-4 text-muted-foreground">
            Current Selected Region: <span className="text-primary font-bold">{selectedState}</span>
          </div>

          {/* Grid of Indian States (Scrollable/Wrap layout responsive container) */}
          <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {statesList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedState === st
                    ? "bg-primary/20 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEASONAL FILTER CONTROL PANEL */}
      {tab === "season" && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-border">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <CloudSun className="text-primary w-5 h-5" /> Select Seasonal Climate
          </h3>
          <div className="flex flex-wrap gap-3">
            {["summer", "winter", "rainy", "spring"].map((se) => (
              <button
                key={se}
                onClick={() => setSelectedSeason(se)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                  selectedSeason === se
                    ? "bg-primary/20 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {se}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT TITLE BANNER HEADER */}
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Detected Diet Suggestion: {tab === "region" ? selectedState : selectedSeason} — {loading ? "..." : suggestions.length} Results
      </h4>

      {/* SUGGESTIONS LIST ROW STACK */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : suggestions.length === 0 || !suggestions[0]?.title ? (
          <div className="text-center py-20 bg-input/5 border border-dashed border-border rounded-2xl">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground text-sm">No dynamic suggestions found for this selection.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {suggestions.map((item, idx) => {
              const currentFoodsList = item.foods || item.meals || [];
              
              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 glass-card rounded-2xl border border-primary/15 bg-input/10"
                >
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags?.map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary">
                        {t}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1">{item.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-border/60">
                    {/* Foods List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-primary tracking-wide mb-2.5">Staple Components & Recipes</h4>
                      <ul className="space-y-2">
                        {currentFoodsList.map((food, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-white bg-input/30 px-3 py-2 rounded-xl border border-border/40">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits List */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wide mb-2.5">Health & Vitality Benefits</h4>
                      <ul className="space-y-2">
                        {(item.benefits || ["Promotes metabolic stabilization.", "Supports local ecosystem sourcing."]).map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}