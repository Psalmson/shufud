import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RECIPE_SYSTEM_PROMPT = `You are Shufud, a Nigerian/African recipe assistant. Give a detailed recipe with ingredients and steps.
Respond ONLY with valid JSON:
{
  "name": "Recipe Name",
  "cuisine": "Nigerian",
  "description": "One sentence description.",
  "time": "30 mins",
  "difficulty": "Easy",
  "servings": "4",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step one.", "Step two.", "Step three."]
}`;

const PLANNER_SYSTEM_PROMPT = `You are Shufud, a Nigerian/African meal planning assistant. Create a 7-day meal plan.
Respond ONLY with valid JSON:
{
  "plan": {
    "Mon": { "Breakfast": "Akara and Pap", "Lunch": "Jollof Rice", "Dinner": "Pepper Soup", "Snack": "Puff Puff" },
    "Tue": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." },
    "Wed": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." },
    "Thu": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." },
    "Fri": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." },
    "Sat": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." },
    "Sun": { "Breakfast": "...", "Lunch": "...", "Dinner": "...", "Snack": "..." }
  }
}
Use Nigerian and African dishes as much as possible. Be creative and varied.`;

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (weekStart) => {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts = { day: "numeric", month: "short" };
  return `${weekStart.toLocaleDateString("en-GB", opts)} – ${end.toLocaleDateString("en-GB", opts)}`;
};

const getDayDate = (weekStart, dayIndex) => {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayIndex);
  return d;
};

const isToday = (weekStart, dayIndex) => {
  const d = getDayDate(weekStart, dayIndex);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const plannerStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .planner-wrap { font-family: 'Afacad Flux', sans-serif; }

  .planner-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .planner-week-nav { display: flex; align-items: center; gap: 10px; }
  .planner-week-btn { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 8px; padding: 7px 12px; cursor: pointer; font-size: 0.9rem; color: var(--muted); transition: all 0.2s; }
  .planner-week-btn:hover { border-color: var(--teal); color: var(--teal); }
  .planner-week-label { font-family: 'Spectral', serif; font-size: 1rem; color: var(--green); font-weight: 600; white-space: nowrap; }
  .planner-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  .planner-generate-btn { background: var(--green); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-family: 'Spectral', serif; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
  .planner-generate-btn:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); }
  .planner-generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .planner-download-btn { background: var(--orange); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .planner-download-btn:hover { background: var(--orange-light); transform: translateY(-1px); }
  .planner-download-locked { background: var(--bg); color: var(--muted); border: 1.5px solid var(--border); padding: 10px 18px; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .planner-download-locked:hover { border-color: var(--orange); color: var(--orange); }

  .planner-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: plannerSpin 0.8s linear infinite; }
  @keyframes plannerSpin { to { transform: rotate(360deg); } }

  .planner-error { background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 10px; padding: 12px 16px; color: var(--orange); font-size: 0.88rem; margin-bottom: 16px; }
  .planner-success { background: var(--teal-pale); border: 1.5px solid #b8eaf5; border-radius: 10px; padding: 12px 16px; color: #037a97; font-size: 0.88rem; margin-bottom: 16px; }

  /* ── Calendar Grid ── */
  .planner-calendar-wrap { overflow-x: auto; border-radius: 16px; border: 1.5px solid var(--border); box-shadow: var(--card-shadow); background: var(--warm-white); }
  .planner-calendar { width: 100%; border-collapse: collapse; min-width: 700px; }

  .planner-cal-corner { background: var(--green); width: 90px; min-width: 90px; }
  .planner-cal-day-header { background: var(--green); padding: 12px 8px; text-align: center; border-left: 1px solid rgba(255,255,255,0.15); }
  .planner-cal-day-name { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.7); font-weight: 600; }
  .planner-cal-day-date { font-family: 'Spectral', serif; font-size: 1.1rem; color: white; margin-top: 2px; line-height: 1; }
  .planner-cal-day-header.today { background: var(--orange); }
  .planner-cal-day-header.today .planner-cal-day-name { color: rgba(255,255,255,0.85); }

  .planner-cal-slot-label { background: var(--green-pale); padding: 12px 14px; border-top: 1px solid var(--border); vertical-align: middle; }
  .planner-cal-slot-name { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 600; white-space: nowrap; }
  .planner-cal-slot-emoji { font-size: 1rem; display: block; margin-bottom: 3px; }

  .planner-cal-cell { border-top: 1px solid var(--border); border-left: 1px solid var(--border); padding: 8px; vertical-align: top; min-width: 90px; transition: background 0.15s; }
  .planner-cal-cell:hover { background: var(--green-pale); }
  .planner-cal-cell.today-col { background: #fff8f5; }
  .planner-cal-cell.today-col:hover { background: #ffefe6; }
  .planner-cal-cell.filled { background: var(--teal-pale); }
  .planner-cal-cell.filled.today-col { background: #fff0e6; }

  .planner-cell-input { width: 100%; border: none; background: transparent; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; color: var(--charcoal); resize: none; outline: none; min-height: 44px; line-height: 1.4; cursor: text; }
  .planner-cell-input::placeholder { color: #c5d9cd; font-style: italic; }

  .planner-cell-view-btn { background: var(--teal); border: none; color: white; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; font-size: 0.65rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; margin-top: 4px; flex-shrink: 0; }
  .planner-cell-view-btn:hover { background: var(--teal-light); transform: scale(1.1); }
  .planner-cell-bottom { display: flex; align-items: center; justify-content: flex-end; }

  /* ── Recipe Modal ── */
  .recipe-modal-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; animation: rmFadeIn 0.15s ease; padding: 20px; }
  @keyframes rmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .recipe-modal { background: var(--warm-white); border-radius: 20px; width: 100%; max-width: 520px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(15,31,20,0.2); animation: rmSlideUp 0.2s ease; }
  @keyframes rmSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-modal-header { background: var(--green); padding: 20px 24px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; position: sticky; top: 0; z-index: 1; }
  .recipe-modal-title { font-family: 'Spectral', serif; color: white; font-size: 1.2rem; line-height: 1.3; flex: 1; }
  .recipe-modal-close { background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
  .recipe-modal-close:hover { background: rgba(255,255,255,0.25); }
  .recipe-modal-body { padding: 20px 24px 24px; }
  .recipe-modal-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .recipe-modal-pill { font-size: 0.7rem; padding: 3px 10px; border-radius: 16px; background: var(--green-pale); border: 1px solid var(--border); color: var(--muted); font-weight: 500; letter-spacing: 0.04em; }
  .recipe-modal-pill.nigerian { background: var(--green); color: white; border-color: var(--green); }
  .recipe-modal-section { margin-bottom: 16px; }
  .recipe-modal-section h4 { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); margin-bottom: 10px; font-weight: 600; }
  .recipe-modal-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.65; }
  .recipe-modal-ingredients { display: flex; flex-wrap: wrap; gap: 6px; }
  .recipe-modal-ing { font-size: 0.8rem; padding: 4px 10px; border-radius: 14px; border: 1.5px solid var(--border); background: var(--bg); color: var(--charcoal); }
  .recipe-modal-steps { list-style: none; counter-reset: steps; }
  .recipe-modal-steps li { counter-increment: steps; display: flex; gap: 12px; margin-bottom: 10px; font-size: 0.88rem; line-height: 1.65; color: var(--charcoal); }
  .recipe-modal-steps li::before { content: counter(steps); background: var(--orange); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; flex-shrink: 0; margin-top: 2px; font-weight: 700; }
  .recipe-modal-loading { text-align: center; padding: 40px 20px; color: var(--muted); }
  .recipe-modal-spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--green); border-radius: 50%; animation: plannerSpin 0.8s linear infinite; margin: 0 auto 12px; }
  .recipe-modal-yt { display: inline-flex; align-items: center; gap: 8px; background: #FF0000; color: white; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; text-decoration: none; transition: all 0.2s; font-family: 'Afacad Flux', sans-serif; margin-top: 12px; }
  .recipe-modal-yt:hover { background: #cc0000; transform: translateY(-1px); }
  .recipe-modal-yt-locked { display: inline-flex; align-items: center; gap: 8px; background: var(--bg); color: var(--muted); padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; border: 1.5px solid var(--border); cursor: pointer; transition: all 0.2s; font-family: 'Afacad Flux', sans-serif; margin-top: 12px; }
  .recipe-modal-yt-locked:hover { border-color: var(--orange); color: var(--orange); }

  /* ── Print / PDF styles ── */
  @media print {
    body * { visibility: hidden !important; }
    #shufud-meal-plan-print, #shufud-meal-plan-print * { visibility: visible !important; }
    #shufud-meal-plan-print { position: fixed; inset: 0; background: white; z-index: 9999; padding: 32px; }
    .print-header { text-align: center; margin-bottom: 24px; }
    .print-title { font-family: 'Spectral', serif; font-size: 2rem; color: #2E5339; }
    .print-title em { color: #FF570A; font-style: italic; }
    .print-week { font-size: 0.9rem; color: #4a6655; margin-top: 6px; }
    .print-table { width: 100%; border-collapse: collapse; }
    .print-table th { background: #2E5339; color: white; padding: 10px 12px; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; text-align: center; }
    .print-table th.slot-col { background: #f0f5f1; color: #4a6655; text-align: left; }
    .print-table td { border: 1px solid #d4e2d8; padding: 10px 12px; font-size: 0.82rem; vertical-align: top; }
    .print-table td.slot-label { background: #f0f5f1; font-weight: 600; color: #2E5339; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
    .print-table td.filled-cell { background: #edfaff; }
    .print-table td.empty-cell { color: #c5d9cd; font-style: italic; font-size: 0.75rem; }
    .print-footer { margin-top: 20px; text-align: center; font-size: 0.72rem; color: #9ab5a2; }
  }
`;

const SLOT_EMOJIS = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍎" };

function RecipeModal({ mealName, pantryItems, userTier, onClose, onUpgrade }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchRecipe(); }, []);

  const fetchRecipe = async () => {
    setLoading(true); setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          bypass_limit: true,
          system: RECIPE_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Give me the full recipe for: ${mealName}. User has these pantry items: ${pantryItems.join(", ") || "general pantry"}.` }]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch recipe");
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setRecipe(parsed);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const isNigerian = (c) => c?.toLowerCase().includes("nigerian") || c?.toLowerCase().includes("african");

  return (
    <div className="recipe-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="recipe-modal">
        <div className="recipe-modal-header">
          <div className="recipe-modal-title">{mealName}</div>
          <button className="recipe-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="recipe-modal-body">
          {loading && (
            <div className="recipe-modal-loading">
              <div className="recipe-modal-spinner" />
              <p>Fetching recipe…</p>
            </div>
          )}
          {error && <div style={{ color: "var(--orange)", fontSize: "0.88rem" }}>⚠ {error}</div>}
          {recipe && !loading && (
            <>
              <div className="recipe-modal-meta">
                {recipe.cuisine && (
                  <span className={`recipe-modal-pill ${isNigerian(recipe.cuisine) ? "nigerian" : ""}`}>
                    {isNigerian(recipe.cuisine) ? "🇳🇬 " : ""}{recipe.cuisine}
                  </span>
                )}
                <span className="recipe-modal-pill">⏱ {recipe.time}</span>
                <span className="recipe-modal-pill">{recipe.difficulty}</span>
                <span className="recipe-modal-pill">🍽 {recipe.servings} servings</span>
              </div>
              <div className="recipe-modal-section">
                <p className="recipe-modal-desc">{recipe.description}</p>
              </div>
              <div className="recipe-modal-section">
                <h4>Ingredients</h4>
                <div className="recipe-modal-ingredients">
                  {recipe.ingredients?.map(ing => (
                    <span key={ing} className="recipe-modal-ing">{ing}</span>
                  ))}
                </div>
              </div>
              <div className="recipe-modal-section">
                <h4>Steps</h4>
                <ol className="recipe-modal-steps">
                  {recipe.steps?.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
              <div>
                {userTier === "pro_chef" ? (
                  
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(mealName + " Nigerian recipe how to cook")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="recipe-modal-yt"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    ▶ Watch on YouTube
                  </a>
                ) : (
                  <button className="recipe-modal-yt-locked" onClick={() => { onClose(); onUpgrade(); }}>
                    🔒 Watch on YouTube — Pro Chef only
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MealPlanner({ session, pantryIngredients, userTier, onUpgrade }) {
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [plan, setPlan] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewingMeal, setViewingMeal] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const saveTimerRef = useRef(null);
  const weekKey = weekStart.toISOString().split("T")[0];
  const allPantryItems = Object.values(pantryIngredients || {}).flat();

  useEffect(() => { loadPlan(); }, [weekKey]);

  const loadPlan = async () => {
    try {
      const { data } = await supabase.from("meal_plan")
        .select("plan")
        .eq("user_id", session.user.id)
        .eq("week_start", weekKey)
        .single();
      if (data?.plan) setPlan(data.plan);
      else setPlan({});
    } catch { setPlan({}); }
  };

  const savePlan = async (newPlan) => {
    setSaving(true);
    try {
      await supabase.from("meal_plan").upsert({
        user_id: session.user.id,
        week_start: weekKey,
        plan: newPlan,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,week_start" });
    } catch (err) { console.error("Save error", err); }
    finally { setSaving(false); }
  };

  const scheduleSave = (newPlan) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePlan(newPlan), 2000);
  };

  const updateCell = (day, slot, value) => {
    const newPlan = {
      ...plan,
      [day]: { ...(plan[day] || {}), [slot]: value }
    };
    setPlan(newPlan);
    scheduleSave(newPlan);
  };

  const getCellValue = (day, slot) => plan[day]?.[slot] || "";

  const generatePlan = async () => {
    setAiLoading(true); setError(""); setSuccess("");
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const token = s?.access_token;
      const pantryContext = allPantryItems.length
        ? `User's pantry: ${allPantryItems.join(", ")}.`
        : "User has a general Nigerian pantry.";
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          bypass_limit: true,
          system: PLANNER_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Generate a 7-day meal plan. ${pantryContext} Week of ${formatWeekLabel(weekStart)}.` }]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan");
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.plan) {
        setPlan(parsed.plan);
        await savePlan(parsed.plan);
        setSuccess("✓ Meal plan generated and saved!");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally { setAiLoading(false); }
  };

  const clearPlan = () => {
    if (!window.confirm("Clear this week's meal plan?")) return;
    setPlan({});
    savePlan({});
  };

  const downloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  const hasPlan = DAYS.some(day => MEAL_SLOTS.some(slot => getCellValue(day, slot)));

  return (
    <>
      <style>{plannerStyle}</style>

      {/* ── Hidden print layout ── */}
      <div id="shufud-meal-plan-print" style={{ display: "none" }}>
        <div className="print-header">
          <div className="print-title"><em>Shufud</em></div>
          <div className="print-week">Meal Plan · {formatWeekLabel(weekStart)}</div>
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th className="slot-col">Meal</th>
              {DAYS.map((day, i) => (
                <th key={day}>{day} {getDayDate(weekStart, i).getDate()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_SLOTS.map(slot => (
              <tr key={slot}>
                <td className="slot-label">{SLOT_EMOJIS[slot]} {slot}</td>
                {DAYS.map(day => {
                  const val = getCellValue(day, slot);
                  return (
                    <td key={day} className={val ? "filled-cell" : "empty-cell"}>
                      {val || "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="print-footer">Generated by Shufud · shufud.vercel.app</div>
      </div>

      <div className="planner-wrap">
        {/* ── Top bar ── */}
        <div className="planner-topbar">
          <div className="planner-week-nav">
            <button className="planner-week-btn" onClick={() => setWeekStart(w => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; })}>← Prev</button>
            <span className="planner-week-label">{formatWeekLabel(weekStart)}</span>
            <button className="planner-week-btn" onClick={() => setWeekStart(w => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; })}>Next →</button>
          </div>
          <div className="planner-actions">
            <button className="planner-generate-btn" onClick={generatePlan} disabled={aiLoading}>
              {aiLoading ? <><div className="planner-spinner" /> Generating…</> : "✦ Generate Meal Plan"}
            </button>
            {userTier === "pro_chef" ? (
              <button className="planner-download-btn" onClick={downloadPDF} disabled={downloading || !hasPlan}>
                {downloading ? "Preparing…" : "⬇ Download PDF"}
              </button>
            ) : (
              <button className="planner-download-locked" onClick={onUpgrade}>
                🔒 Download PDF
              </button>
            )}
            {hasPlan && (
              <button onClick={clearPlan} style={{
                background: "transparent", border: "1.5px solid var(--border)",
                color: "var(--muted)", padding: "10px 14px", borderRadius: "10px",
                cursor: "pointer", fontSize: "0.82rem", fontFamily: "Afacad Flux, sans-serif",
                transition: "all 0.2s"
              }}>
                Clear
              </button>
            )}
            <span style={{ fontSize: "0.75rem", color: saving ? "var(--teal)" : "var(--muted)" }}>
              {saving ? "⟳ Saving…" : "✓ Saved"}
            </span>
          </div>
        </div>

        {error && <div className="planner-error">⚠ {error}</div>}
        {success && <div className="planner-success">{success}</div>}

        {/* ── Calendar Grid ── */}
        <div className="planner-calendar-wrap">
          <table className="planner-calendar">
            <thead>
              <tr>
                <th className="planner-cal-corner" />
                {DAYS.map((day, i) => (
                  <th key={day} className={`planner-cal-day-header ${isToday(weekStart, i) ? "today" : ""}`}>
                    <div className="planner-cal-day-name">{day}</div>
                    <div className="planner-cal-day-date">{getDayDate(weekStart, i).getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_SLOTS.map(slot => (
                <tr key={slot}>
                  <td className="planner-cal-slot-label">
                    <span className="planner-cal-slot-emoji">{SLOT_EMOJIS[slot]}</span>
                    <span className="planner-cal-slot-name">{slot}</span>
                  </td>
                  {DAYS.map((day, i) => {
                    const val = getCellValue(day, slot);
                    const todayCol = isToday(weekStart, i);
                    return (
                      <td key={day} className={`planner-cal-cell ${todayCol ? "today-col" : ""} ${val ? "filled" : ""}`}>
                        <textarea
                          className="planner-cell-input"
                          placeholder="+"
                          value={val}
                          onChange={e => updateCell(day, slot, e.target.value)}
                          rows={2}
                        />
                        {val && (
                          <div className="planner-cell-bottom">
                            <button
                              className="planner-cell-view-btn"
                              title="View recipe"
                              onClick={() => setViewingMeal({ name: val, day, slot })}
                            >👁</button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!hasPlan && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--muted)", fontSize: "0.92rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🗓</div>
            <p>Your meal plan is empty.<br />Click <strong>✦ Generate Meal Plan</strong> or type directly into any cell.</p>
          </div>
        )}
      </div>

      {/* ── Recipe Modal ── */}
      {viewingMeal && (
        <RecipeModal
          mealName={viewingMeal.name}
          pantryItems={allPantryItems}
          userTier={userTier}
          onClose={() => setViewingMeal(null)}
          onUpgrade={onUpgrade}
        />
      )}
    </>
  );
}
