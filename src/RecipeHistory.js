import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const TIER_DAYS = { free: 0, smart_cook: 7, pro_chef: 999 };

const historyStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .history-wrap { margin-top: 32px; }
  .history-toggle { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; }
  .history-toggle:hover { border-color: var(--teal); background: var(--teal-pale); }
  .history-toggle-left { display: flex; align-items: center; gap: 10px; font-family: 'Spectral', serif; font-size: 1rem; color: var(--green); }
  .history-toggle-right { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .history-toggle-arrow { font-size: 1rem; color: var(--muted); transition: transform 0.2s; }
  .history-toggle-arrow.open { transform: rotate(180deg); color: var(--orange); }

  .history-panel { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden; animation: historyIn 0.2s ease; margin-top: 8px; }
  @keyframes historyIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .history-toolbar { padding: 12px 16px; border-bottom: 1.5px solid var(--border); display: flex; gap: 10px; align-items: center; flex-wrap: wrap; background: var(--bg); }
  .history-search { flex: 1; min-width: 160px; padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; outline: none; background: white; }
  .history-search:focus { border-color: var(--teal); }
  .history-filter { padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Afacad Flux', sans-serif; font-size: 0.85rem; outline: none; background: white; cursor: pointer; }
  .history-clear-btn { padding: 8px 14px; background: transparent; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; color: var(--muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .history-clear-btn:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-pale); }

  .history-list { max-height: 420px; overflow-y: auto; }
  .history-item { padding: 14px 18px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .history-item:last-child { border-bottom: none; }
  .history-item:hover { background: var(--green-pale); }
  .history-item-left { flex: 1; min-width: 0; }
  .history-item-name { font-family: 'Spectral', serif; font-size: 1rem; color: var(--charcoal); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-item-meta { display: flex; gap: 6px; flex-wrap: wrap; }
  .history-meta-pill { font-size: 0.68rem; padding: 2px 8px; border-radius: 12px; background: var(--green-pale); border: 1px solid var(--border); color: var(--muted); font-weight: 500; letter-spacing: 0.04em; }
  .history-meta-pill.nigerian { background: var(--green); color: white; border-color: var(--green); }
  .history-item-date { font-size: 0.72rem; color: var(--muted); white-space: nowrap; flex-shrink: 0; margin-top: 2px; }
  .history-item-reuse { background: var(--teal-pale); border: 1px solid var(--teal); color: var(--teal); font-size: 0.72rem; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-weight: 600; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; margin-top: 2px; }
  .history-item-reuse:hover { background: var(--teal); color: white; }

  .history-empty { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 0.88rem; }
  .history-empty-icon { font-size: 2rem; margin-bottom: 10px; opacity: 0.4; }
  .history-loading { text-align: center; padding: 32px; color: var(--muted); font-size: 0.88rem; }
  .history-spinner { width: 24px; height: 24px; border: 2.5px solid var(--border); border-top-color: var(--green); border-radius: 50%; animation: hSpin 0.8s linear infinite; margin: 0 auto 10px; }
  @keyframes hSpin { to { transform: rotate(360deg); } }

  .history-upgrade { text-align: center; padding: 32px 20px; }
  .history-upgrade p { font-size: 0.88rem; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
  .history-upgrade-btn { background: var(--orange); color: white; border: none; padding: 10px 24px; border-radius: 10px; font-family: 'Spectral', serif; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; }
  .history-upgrade-btn:hover { background: var(--orange-light); transform: translateY(-1px); }

  .history-recipe-modal { position: fixed; inset: 0; background: rgba(15,31,20,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; animation: historyIn 0.15s ease; }
  .history-recipe-modal-inner { background: var(--warm-white); border-radius: 20px; width: 100%; max-width: 520px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(15,31,20,0.2); }
  .history-recipe-modal-header { background: var(--green); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; position: sticky; top: 0; }
  .history-recipe-modal-title { font-family: 'Spectral', serif; color: white; font-size: 1.2rem; flex: 1; line-height: 1.3; }
  .history-recipe-modal-close { background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
  .history-recipe-modal-close:hover { background: rgba(255,255,255,0.25); }
  .history-recipe-modal-body { padding: 20px 24px 24px; }
  .history-recipe-section h4 { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); margin: 16px 0 10px; font-weight: 600; }
  .history-recipe-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.65; }
  .history-recipe-ings { display: flex; flex-wrap: wrap; gap: 6px; }
  .history-recipe-ing { font-size: 0.8rem; padding: 4px 10px; border-radius: 14px; border: 1.5px solid var(--border); background: var(--bg); color: var(--charcoal); }
  .history-recipe-steps { list-style: none; counter-reset: steps; }
  .history-recipe-steps li { counter-increment: steps; display: flex; gap: 12px; margin-bottom: 10px; font-size: 0.88rem; line-height: 1.65; color: var(--charcoal); }
  .history-recipe-steps li::before { content: counter(steps); background: var(--orange); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; flex-shrink: 0; margin-top: 2px; font-weight: 700; }
  .history-tier-badge { display: inline-block; font-size: 0.68rem; padding: 2px 8px; border-radius: 10px; margin-left: 8px; font-weight: 600; }
  .history-tier-badge.smart { background: var(--teal-pale); color: var(--teal); border: 1px solid var(--teal); }
  .history-tier-badge.pro { background: var(--orange-pale); color: var(--orange); border: 1px solid var(--orange); }
`;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const isNigerian = (c) => c?.toLowerCase().includes("nigerian") || c?.toLowerCase().includes("african");

function HistoryRecipeModal({ recipe, onClose }) {
  return (
    <div className="history-recipe-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="history-recipe-modal-inner">
        <div className="history-recipe-modal-header">
          <div className="history-recipe-modal-title">{recipe.recipe_name}</div>
          <button className="history-recipe-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="history-recipe-modal-body">
          <div className="history-recipe-section">
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              {recipe.cuisine && (
                <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "16px", background: isNigerian(recipe.cuisine) ? "var(--green)" : "var(--green-pale)", color: isNigerian(recipe.cuisine) ? "white" : "var(--muted)", border: "1px solid var(--border)", fontWeight: 500 }}>
                  {isNigerian(recipe.cuisine) ? "🇳🇬 " : ""}{recipe.cuisine}
                </span>
              )}
              {recipe.time && <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "16px", background: "var(--orange)", color: "white", fontWeight: 500 }}>⏱ {recipe.time}</span>}
              {recipe.difficulty && <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "16px", background: "var(--green-pale)", border: "1px solid var(--border)", color: "var(--muted)", fontWeight: 500 }}>{recipe.difficulty}</span>}
              {recipe.servings && <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "16px", background: "var(--green-pale)", border: "1px solid var(--border)", color: "var(--muted)", fontWeight: 500 }}>🍽 {recipe.servings} servings</span>}
            </div>
            {recipe.description && <p className="history-recipe-desc">{recipe.description}</p>}
          </div>
          {recipe.ingredients?.length > 0 && (
            <div className="history-recipe-section">
              <h4>Ingredients</h4>
              <div className="history-recipe-ings">
                {recipe.ingredients.map((ing, i) => <span key={i} className="history-recipe-ing">{ing}</span>)}
              </div>
            </div>
          )}
          {recipe.steps?.length > 0 && (
            <div className="history-recipe-section">
              <h4>Steps</h4>
              <ol className="history-recipe-steps">
                {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipeHistory({ userTier, onUpgrade }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [count, setCount] = useState(0);

  const tierDays = TIER_DAYS[userTier] || 0;
  const hasAccess = userTier !== "free";

  useEffect(() => {
    if (open && hasAccess) loadHistory();
    if (open && hasAccess) loadCount();
  }, [open]);

  const loadCount = async () => {
    const { count } = await supabase.from("recipe_history")
      .select("*", { count: "exact", head: true });
    setCount(count || 0);
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      let query = supabase.from("recipe_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (userTier === "smart_cook") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        query = query.gte("created_at", cutoff.toISOString());
      }

      const { data } = await query;
      setHistory(data || []);
    } catch (err) {
      console.error("History load error", err);
    } finally { setLoading(false); }
  };

  const clearHistory = async () => {
    if (!window.confirm("Clear all recipe history? This cannot be undone.")) return;
    await supabase.from("recipe_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setHistory([]);
    setCount(0);
  };

  const cuisines = ["all", ...new Set(history.map(h => h.cuisine).filter(Boolean))];

  const filtered = history.filter(h => {
    const matchSearch = !search || h.recipe_name?.toLowerCase().includes(search.toLowerCase());
    const matchCuisine = cuisineFilter === "all" || h.cuisine === cuisineFilter;
    return matchSearch && matchCuisine;
  });

  const tierBadgeClass = userTier === "smart_cook" ? "smart" : "pro";
  const tierBadgeLabel = userTier === "smart_cook" ? "7 days" : "Forever";

  return (
    <>
      <style>{historyStyle}</style>
      <div className="history-wrap">
        <div className="history-toggle" onClick={() => setOpen(o => !o)}>
          <div className="history-toggle-left">
            🕐 Recipe History
            {hasAccess && (
              <span className={`history-tier-badge ${tierBadgeClass}`}>{tierBadgeLabel}</span>
            )}
          </div>
          <div className="history-toggle-right">
            {hasAccess && count > 0 && <span>{count} recipes</span>}
            {!hasAccess && <span style={{ color: "var(--orange)", fontWeight: 600 }}>🔒 Upgrade</span>}
            <span className={`history-toggle-arrow ${open ? "open" : ""}`}>▾</span>
          </div>
        </div>

        {open && (
          <div className="history-panel">
            {!hasAccess ? (
              <div className="history-upgrade">
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🕐</div>
                <p>Recipe history is available on <strong>Smart Cook</strong> and <strong>Pro Chef</strong> plans. Never lose a great recipe again!</p>
                <button className="history-upgrade-btn" onClick={onUpgrade}>View Plans</button>
              </div>
            ) : loading ? (
              <div className="history-loading">
                <div className="history-spinner" />
                Loading history…
              </div>
            ) : (
              <>
                <div className="history-toolbar">
                  <input className="history-search" placeholder="Search recipes…"
                    value={search} onChange={e => setSearch(e.target.value)} />
                  <select className="history-filter" value={cuisineFilter} onChange={e => setCuisineFilter(e.target.value)}>
                    {cuisines.map(c => <option key={c} value={c}>{c === "all" ? "All cuisines" : c}</option>)}
                  </select>
                  {history.length > 0 && (
                    <button className="history-clear-btn" onClick={clearHistory}>🗑 Clear</button>
                  )}
                </div>
                <div className="history-list">
                  {filtered.length === 0 ? (
                    <div className="history-empty">
                      <div className="history-empty-icon">🍳</div>
                      <p>{history.length === 0 ? "No recipes yet — start cooking!" : "No recipes match your search."}</p>
                    </div>
                  ) : filtered.map(item => (
                    <div className="history-item" key={item.id} onClick={() => setViewingRecipe(item)}>
                      <div className="history-item-left">
                        <div className="history-item-name">{item.recipe_name}</div>
                        <div className="history-item-meta">
                          {item.cuisine && (
                            <span className={`history-meta-pill ${isNigerian(item.cuisine) ? "nigerian" : ""}`}>
                              {isNigerian(item.cuisine) ? "🇳🇬 " : ""}{item.cuisine}
                            </span>
                          )}
                          {item.time && <span className="history-meta-pill">⏱ {item.time}</span>}
                          {item.difficulty && <span className="history-meta-pill">{item.difficulty}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                        <span className="history-item-date">{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {viewingRecipe && (
        <HistoryRecipeModal recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} />
      )}
    </>
  );
}
