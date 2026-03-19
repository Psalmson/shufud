import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_SLOTS = ["Breakfast", "Lunch", "Dinner"];

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (monday) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts = { day: "numeric", month: "short" };
  return `${monday.toLocaleDateString("en-GB", opts)} – ${sunday.toLocaleDateString("en-GB", opts)}`;
};

const formatDate = (monday, dayIndex) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const isToday = (monday, dayIndex) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const plannerStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .planner-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .planner-title { font-family: 'Spectral', serif; font-size: 1.5rem; color: var(--green); }
  .planner-week-nav { display: flex; align-items: center; gap: 10px; }
  .planner-week-label { font-size: 0.88rem; color: var(--muted); font-weight: 500; min-width: 160px; text-align: center; }
  .planner-nav-btn { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 0.88rem; color: var(--muted); transition: all 0.2s; font-family: 'Afacad Flux', sans-serif; }
  .planner-nav-btn:hover { border-color: var(--teal); color: var(--teal); }
  .planner-today-btn { background: var(--teal-pale); border: 1.5px solid var(--teal); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 0.82rem; color: var(--teal); font-family: 'Afacad Flux', sans-serif; font-weight: 600; transition: all 0.2s; }
  .planner-today-btn:hover { background: var(--teal); color: white; }

  .planner-ai-btn { width: 100%; padding: 14px; background: var(--green); color: white; border: none; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; letter-spacing: 0.02em; }
  .planner-ai-btn:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(46,83,57,0.3); }
  .planner-ai-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .planner-grid { display: flex; flex-direction: column; gap: 16px; }

  .planner-day-card { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); }
  .planner-day-card.today { border-color: var(--orange); box-shadow: 0 4px 20px rgba(255,87,10,0.12); }

  .planner-day-header { padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--border); }
  .planner-day-card.today .planner-day-header { background: var(--orange-pale); }
  .planner-day-name { font-family: 'Spectral', serif; font-size: 1rem; color: var(--charcoal); font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .planner-today-badge { background: var(--orange); color: white; font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .planner-day-date { font-size: 0.78rem; color: var(--muted); }

  .planner-slots { padding: 12px 18px; display: flex; flex-direction: column; gap: 10px; }

  .planner-slot { display: flex; align-items: center; gap: 10px; }
  .planner-slot-label { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600; min-width: 80px; flex-shrink: 0; }
  .planner-slot-input { flex: 1; padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; color: var(--charcoal); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .planner-slot-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(5,178,220,0.12); }
  .planner-slot-input::placeholder { color: #9ab5a2; }
  .planner-slot-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 1rem; padding: 4px; transition: color 0.15s; flex-shrink: 0; }
  .planner-slot-remove:hover { color: var(--orange); }

  .planner-add-slot { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
  .planner-add-slot-input { flex: 1; padding: 6px 10px; border: 1.5px dashed var(--border); border-radius: 8px; background: transparent; font-family: 'Afacad Flux', sans-serif; font-size: 0.85rem; color: var(--muted); outline: none; transition: border-color 0.2s; }
  .planner-add-slot-input:focus { border-color: var(--teal); color: var(--charcoal); }
  .planner-add-slot-btn { background: var(--teal-pale); border: 1.5px solid var(--teal); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 0.78rem; color: var(--teal); font-family: 'Afacad Flux', sans-serif; font-weight: 600; transition: all 0.2s; white-space: nowrap; }
  .planner-add-slot-btn:hover { background: var(--teal); color: white; }

  .planner-status { font-size: 0.75rem; color: var(--muted); text-align: right; margin-bottom: 8px; }
  .planner-status.saving { color: var(--teal); }
  .planner-status.error { color: var(--orange); }

  .planner-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: plannerSpin 0.8s linear infinite; display: inline-block; }
  @keyframes plannerSpin { to { transform: rotate(360deg); } }

  .planner-empty { text-align: center; padding: 40px 24px; color: var(--muted); font-size: 0.92rem; }
  .planner-error-box { background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 12px; padding: 14px 18px; color: var(--orange); font-size: 0.92rem; margin-bottom: 16px; }
`;

export default function MealPlanner({ session, pantryIngredients }) {
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
  const [plan, setPlan] = useState({});
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [newSlotInputs, setNewSlotInputs] = useState({});
  const [status, setStatus] = useState("saved");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const saveTimerRef = useRef(null);
  const sessionRef = useRef(session);

  useEffect(() => { sessionRef.current = session; }, [session]);

  const weekKey = currentMonday.toISOString().split("T")[0];

  useEffect(() => {
    loadPlan();
  }, [weekKey]);

  const loadPlan = async () => {
    if (!sessionRef.current) return;
    setStatus("loading");
    try {
      const { data } = await supabase.from("meal_plan")
        .select("*")
        .eq("user_id", sessionRef.current.user.id)
        .eq("week_start", weekKey)
        .single();
      if (data) {
        setPlan(data.plan || {});
        if (data.slots) setSlots(data.slots);
      } else {
        setPlan({});
      }
    } catch (err) {
      setPlan({});
    } finally { setStatus("saved"); }
  };

  const scheduleSave = (newPlan, newSlots) => {
    setStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePlan(newPlan, newSlots), 2000);
  };

  const savePlan = async (currentPlan, currentSlots) => {
    const s = sessionRef.current;
    if (!s) return;
    setStatus("saving");
    try {
      const { error } = await supabase.from("meal_plan").upsert({
        user_id: s.user.id,
        week_start: weekKey,
        plan: currentPlan,
        slots: currentSlots,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,week_start" });
      if (error) throw error;
      setStatus("saved");
    } catch (err) {
      setStatus("error");
    }
  };

  const updateMeal = (day, slot, value) => {
    const newPlan = {
      ...plan,
      [day]: { ...(plan[day] || {}), [slot]: value }
    };
    setPlan(newPlan);
    scheduleSave(newPlan, slots);
  };

  const addSlot = (day) => {
    const val = (newSlotInputs[day] || "").trim();
    if (!val) return;
    const newSlots = slots.includes(val) ? slots : [...slots, val];
    setSlots(newSlots);
    setNewSlotInputs(p => ({ ...p, [day]: "" }));
    scheduleSave(plan, newSlots);
  };

  const removeSlot = (slot) => {
    if (DEFAULT_SLOTS.includes(slot)) return;
    const newSlots = slots.filter(s => s !== slot);
    const newPlan = { ...plan };
    DAYS.forEach(day => { if (newPlan[day]) delete newPlan[day][slot]; });
    setSlots(newSlots);
    setPlan(newPlan);
    scheduleSave(newPlan, newSlots);
  };

  const fillWithAI = async () => {
    setError("");
    setAiLoading(true);
    const pantryItems = Object.values(pantryIngredients).flat();
    const pantryContext = pantryItems.length > 0
      ? `The user has these pantry items: ${pantryItems.join(", ")}.`
      : "The user has a general pantry.";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: `You are Shufud, a Nigerian/African meal planning assistant. Generate a 7-day meal plan with ${slots.join(", ")} for each day. Favour Nigerian and West African dishes. Respond ONLY with valid JSON in this exact format:
{
  "plan": {
    "Monday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Tuesday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Wednesday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Thursday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Friday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Saturday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" },
    "Sunday": { "Breakfast": "meal name", "Lunch": "meal name", "Dinner": "meal name" }
  }
}
Only include the slots: ${slots.join(", ")}. Keep meal names short (2-5 words). Be culturally authentic.`,
          messages: [{ role: "user", content: `${pantryContext} Generate a varied, balanced 7-day Nigerian/African meal plan for the week of ${formatWeekLabel(currentMonday)}.` }]
        })
      });

      const data = await res.json();
      if (res.status === 429) { setError(data.message); return; }
      if (!res.ok) { setError("AI generation failed. Please try again."); return; }

      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const newPlan = parsed.plan || {};
      setPlan(newPlan);
      scheduleSave(newPlan, slots);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally { setAiLoading(false); }
  };

  const goToPrevWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() - 7);
    setCurrentMonday(d);
  };

  const goToNextWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + 7);
    setCurrentMonday(d);
  };

  const goToToday = () => setCurrentMonday(getMonday(new Date()));

  return (
    <>
      <style>{plannerStyle}</style>

      <div className="planner-header">
        <div className="planner-title">🗓 Meal Planner</div>
        <div className="planner-week-nav">
          <button className="planner-nav-btn" onClick={goToPrevWeek}>‹ Prev</button>
          <span className="planner-week-label">{formatWeekLabel(currentMonday)}</span>
          <button className="planner-nav-btn" onClick={goToNextWeek}>Next ›</button>
          <button className="planner-today-btn" onClick={goToToday}>Today</button>
        </div>
      </div>

      <div className={`planner-status ${status === "saving" ? "saving" : status === "error" ? "error" : ""}`}>
        {status === "saving" ? "⟳ Saving…" : status === "error" ? "⚠ Save failed" : status === "unsaved" ? "● Unsaved changes" : "✓ Saved"}
      </div>

      {error && <div className="planner-error-box">⚠ {error}</div>}

      <button className="planner-ai-btn" onClick={fillWithAI} disabled={aiLoading}>
        {aiLoading
          ? <><div className="planner-spinner" /> Generating your week…</>
          : "✦ AI Fill My Week"}
      </button>

      <div className="planner-grid">
        {DAYS.map((day, i) => (
          <div className={`planner-day-card ${isToday(currentMonday, i) ? "today" : ""}`} key={day}>
            <div className="planner-day-header">
              <div className="planner-day-name">
                {day}
                {isToday(currentMonday, i) && <span className="planner-today-badge">Today</span>}
              </div>
              <div className="planner-day-date">{formatDate(currentMonday, i)}</div>
            </div>
            <div className="planner-slots">
              {slots.map(slot => (
                <div className="planner-slot" key={slot}>
                  <span className="planner-slot-label">{slot}</span>
                  <input
                    className="planner-slot-input"
                    placeholder={`Add ${slot.toLowerCase()}…`}
                    value={plan[day]?.[slot] || ""}
                    onChange={e => updateMeal(day, slot, e.target.value)}
                  />
                  {!DEFAULT_SLOTS.includes(slot) && (
                    <button className="planner-slot-remove" onClick={() => removeSlot(slot)} title="Remove slot">×</button>
                  )}
                </div>
              ))}
              <div className="planner-add-slot">
                <input
                  className="planner-add-slot-input"
                  placeholder="+ Add meal slot (e.g. Supper)…"
                  value={newSlotInputs[day] || ""}
                  onChange={e => setNewSlotInputs(p => ({ ...p, [day]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && addSlot(day)}
                />
                <button className="planner-add-slot-btn" onClick={() => addSlot(day)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
