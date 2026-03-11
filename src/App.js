import { useState, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f7f0e6;
    --warm-white: #faf7f2;
    --clay: #c4614a;
    --clay-light: #d97d68;
    --forest: #2d4a3e;
    --sage: #6b8f71;
    --charcoal: #1e1e1e;
    --muted: #7a7060;
    --border: #e0d5c5;
    --tag-bg: #ede5d8;
  }

  body { font-family: 'DM Mono', monospace; background: var(--cream); color: var(--charcoal); min-height: 100vh; }
  .app { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }
  .header { text-align: center; padding: 40px 0 28px; position: relative; }
  .header::before { content: ''; display: block; width: 60px; height: 3px; background: var(--clay); margin: 0 auto 20px; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3.4rem); color: var(--forest); line-height: 1.1; }
  .header h1 em { color: var(--clay); font-style: italic; }
  .header p { margin-top: 12px; color: var(--muted); font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .cuisine-tags { display: flex; justify-content: center; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
  .cuisine-tag { background: #2d4a3e; color: #e8f4ea; font-size: 0.68rem; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.04em; }
  .tabs { display: flex; border-bottom: 2px solid var(--border); margin-bottom: 32px; margin-top: 8px; }
  .tab { padding: 12px 24px; font-family: 'DM Mono', monospace; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; background: none; border-top: none; border-left: none; border-right: none; }
  .tab:hover { color: var(--forest); }
  .tab.active { color: var(--clay); border-bottom-color: var(--clay); font-weight: 600; }
  .tab-badge { background: var(--clay); color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; }
  .input-section { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 28px; box-shadow: 0 2px 20px rgba(0,0,0,0.04); }
  .input-label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; }
  .ingredient-input-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .ingredient-input { flex: 1; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--cream); font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--charcoal); outline: none; transition: border-color 0.2s; }
  .ingredient-input:focus { border-color: var(--clay); }
  .ingredient-input::placeholder { color: #bbb; }
  .add-btn { padding: 12px 20px; background: var(--forest); color: white; border: none; border-radius: 10px; font-family: 'DM Mono', monospace; font-size: 0.82rem; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .add-btn:hover { background: var(--sage); }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; min-height: 28px; }
  .tag { background: var(--tag-bg); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px 5px 14px; font-size: 0.78rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; }
  @keyframes tagIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  .tag-remove { cursor: pointer; color: var(--muted); font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .tag-remove:hover { color: var(--clay); }
  .options-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .select-input { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--cream); font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--charcoal); outline: none; cursor: pointer; flex: 1; min-width: 140px; }
  .generate-btn { width: 100%; padding: 16px; background: var(--clay); color: white; border: none; border-radius: 12px; font-family: 'Playfair Display', serif; font-size: 1.05rem; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .generate-btn:hover:not(:disabled) { background: var(--clay-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(196,97,74,0.3); }
  .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .generate-btn.pantry-btn { background: var(--forest); margin-top: 12px; }
  .generate-btn.pantry-btn:hover:not(:disabled) { background: var(--sage); box-shadow: 0 6px 20px rgba(45,74,62,0.3); }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .results-section { margin-top: 8px; }
  .results-header { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--forest); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .results-header::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .recipe-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.04); animation: cardIn 0.35s ease both; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-header { padding: 20px 24px 16px; cursor: pointer; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .recipe-title-group { flex: 1; }
  .recipe-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--forest); margin-bottom: 6px; line-height: 1.3; }
  .recipe-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .meta-pill { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); background: var(--tag-bg); padding: 3px 10px; border-radius: 20px; }
  .meta-pill.match { background: #e8f4ea; color: var(--sage); }
  .expand-icon { color: var(--muted); font-size: 1.2rem; transition: transform 0.25s; flex-shrink: 0; margin-top: 4px; }
  .expand-icon.open { transform: rotate(180deg); }
  .recipe-body { padding: 0 24px 20px; border-top: 1px solid var(--border); }
  .recipe-body h4 { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin: 16px 0 8px; }
  .recipe-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.6; margin-top: 4px; }
  .ingredients-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .ing-pill { font-size: 0.75rem; padding: 4px 10px; border-radius: 16px; border: 1px solid var(--border); background: var(--cream); color: var(--charcoal); }
  .ing-pill.have { background: #e8f4ea; border-color: #b8dbbe; color: var(--forest); }
  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; display: flex; gap: 12px; margin-bottom: 10px; font-size: 0.82rem; line-height: 1.65; color: var(--charcoal); }
  .steps-list li::before { content: counter(steps); background: var(--clay); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; flex-shrink: 0; margin-top: 2px; font-weight: 700; }
  .empty-state { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 0.82rem; }
  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }
  .error-box { background: #fdf0ee; border: 1px solid #f0c5be; border-radius: 12px; padding: 14px 18px; color: var(--clay); font-size: 0.82rem; margin-top: 12px; }
  .telegram-note { margin-top: 40px; display: flex; gap: 16px; align-items: flex-start; background: #f0f7f3; border-radius: 12px; padding: 20px 24px; border: 1px solid #c5dfc9; }
  .telegram-icon { font-size: 1.8rem; flex-shrink: 0; }
  .telegram-note h3 { font-family: 'Playfair Display', serif; color: var(--forest); font-size: 1rem; margin-bottom: 4px; }
  .telegram-note p { font-size: 0.76rem; color: var(--muted); line-height: 1.6; }
  .telegram-note code { background: var(--tag-bg); padding: 1px 6px; border-radius: 4px; font-size: 0.85em; color: var(--clay); }
  .pantry-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .pantry-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--forest); }
  .pantry-title span { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--muted); margin-left: 10px; }
  .pantry-add-row { display: flex; gap: 10px; margin-bottom: 8px; }
  .category-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--cream); font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--charcoal); outline: none; cursor: pointer; min-width: 150px; }
  .pantry-categories { display: flex; flex-direction: column; gap: 20px; margin-top: 28px; }
  .category-block { background: var(--warm-white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .category-heading { padding: 12px 20px; background: var(--tag-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .category-heading span { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--forest); font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .category-count { font-size: 0.68rem; color: var(--muted); background: var(--border); padding: 2px 8px; border-radius: 10px; }
  .category-items { padding: 16px 20px; display: flex; flex-wrap: wrap; gap: 8px; min-height: 52px; }
  .category-empty { color: #ccc; font-size: 0.75rem; font-style: italic; }
  .pantry-tag { background: var(--cream); border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px 6px 14px; font-size: 0.78rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; }
  .pantry-clear-btn { padding: 8px 16px; background: transparent; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); cursor: pointer; transition: all 0.2s; }
  .pantry-clear-btn:hover { border-color: var(--clay); color: var(--clay); }
  .pantry-cook-section { margin-top: 28px; background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .pantry-cook-section h3 { font-family: 'Playfair Display', serif; color: var(--forest); font-size: 1.1rem; margin-bottom: 8px; }
  .pantry-cook-section p { font-size: 0.78rem; color: var(--muted); margin-bottom: 16px; line-height: 1.6; }
  .pantry-ingredient-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .preview-pill { font-size: 0.72rem; padding: 3px 10px; border-radius: 14px; background: #e8f4ea; border: 1px solid #b8dbbe; color: var(--forest); }
`;

const CATEGORIES = [
  { key: "proteins", label: "Proteins", emoji: "🥩" },
  { key: "vegetables", label: "Vegetables & Leaves", emoji: "🥬" },
  { key: "grains", label: "Grains & Carbs", emoji: "🌾" },
  { key: "spices", label: "Spices & Seasonings", emoji: "🌶" },
  { key: "oils", label: "Oils & Fats", emoji: "🫙" },
  { key: "others", label: "Others", emoji: "🧺" },
];

const SYSTEM_PROMPT = `You are Shufud, a friendly and creative recipe assistant with deep knowledge of Nigerian and West African cuisine.
When given a list of ingredients, suggest 2 recipes. ALWAYS include at least 1 Nigerian or West African dish if the ingredients can support it.
Respond ONLY with valid JSON:
{"recipes":[{"name":"","cuisine":"","description":"","time":"","difficulty":"","servings":"","ingredientsNeeded":[],"ingredientsYouHave":[],"steps":[]}]}`;

const isNigerian = (cuisine) => cuisine?.toLowerCase().includes("nigerian") || cuisine?.toLowerCase().includes("african");

function RecipeTab({ pantryIngredients }) {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [mealType, setMealType] = useState("any");
  const [dietary, setDietary] = useState("none");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const inputRef = useRef(null);
  const allPantryItems = Object.values(pantryIngredients).flat();

  const addIngredient = () => {
    const val = input.trim().toLowerCase();
    if (val && !ingredients.includes(val)) setIngredients(prev => [...prev, val]);
    setInput(""); inputRef.current?.focus();
  };
  const removeIngredient = (ing) => setIngredients(prev => prev.filter(i => i !== ing));
  const handleKeyDown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addIngredient(); } };
  const toggleExpand = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

  const fetchRecipes = async (ings) => {
    if (!ings.length) return;
    setLoading(true); setError(""); setRecipes([]); setExpanded({});
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "DEMO_MODE", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: `Ingredients: ${ings.join(", ")}. Meal: ${mealType}. Diet: ${dietary}. Suggest 2 recipes.` }] })
      });
      const data = await res.json();
      if (!res.ok) { setError("API Error — in preview mode, recipe generation requires a live deployment."); return; }
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setRecipes(parsed.recipes || []);
      if (parsed.recipes?.length) setExpanded({ 0: true });
    } catch {
      setError("Preview mode — recipe generation works on the live site at shufud.vercel.app");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="input-section">
        <span className="input-label">Your Ingredients</span>
        <div className="ingredient-input-row">
          <input ref={inputRef} className="ingredient-input" type="text" placeholder="e.g. palm oil, tomatoes, stockfish..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button className="add-btn" onClick={addIngredient}>+ Add</button>
        </div>
        <div className="tags">
          {ingredients.length === 0 && <span style={{ color: "#bbb", fontSize: "0.78rem" }}>No ingredients added yet</span>}
          {ingredients.map(ing => <span key={ing} className="tag">{ing}<span className="tag-remove" onClick={() => removeIngredient(ing)}>×</span></span>)}
        </div>
      </div>
      <div className="options-row">
        <select className="select-input" value={mealType} onChange={e => setMealType(e.target.value)}>
          <option value="any">Any meal type</option><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option><option value="dessert">Dessert</option>
        </select>
        <select className="select-input" value={dietary} onChange={e => setDietary(e.target.value)}>
          <option value="none">No dietary restriction</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="gluten-free">Gluten-free</option><option value="keto">Keto</option>
        </select>
      </div>
      <button className="generate-btn" onClick={() => fetchRecipes(ingredients)} disabled={loading || !ingredients.length}>
        {loading ? <><div className="spinner" /> Finding recipes…</> : "✦ Suggest Recipes"}
      </button>
      {allPantryItems.length > 0 && (
        <button className="generate-btn pantry-btn" onClick={() => fetchRecipes(allPantryItems)} disabled={loading}>
          {loading ? <><div className="spinner" />Finding…</> : `🧺 Cook from My Pantry (${allPantryItems.length} items)`}
        </button>
      )}
      {error && <div className="error-box">⚠ {error}</div>}
      {recipes.length > 0 && (
        <div className="results-section" style={{ marginTop: "32px" }}>
          <div className="results-header">{recipes.length} recipes found</div>
          {recipes.map((recipe, i) => (
            <div className="recipe-card" key={i}>
              <div className="recipe-header" onClick={() => toggleExpand(i)}>
                <div className="recipe-title-group">
                  <div className="recipe-name">{recipe.name}</div>
                  <div className="recipe-meta">
                    {recipe.cuisine && <span className="meta-pill" style={{ background: isNigerian(recipe.cuisine) ? "#2d4a3e" : "var(--tag-bg)", color: isNigerian(recipe.cuisine) ? "#e8f4ea" : "var(--muted)" }}>{isNigerian(recipe.cuisine) ? "🇳🇬 " : ""}{recipe.cuisine}</span>}
                    <span className="meta-pill">⏱ {recipe.time}</span>
                    <span className="meta-pill">{recipe.difficulty}</span>
                    <span className="meta-pill">🍽 {recipe.servings} servings</span>
                    {recipe.ingredientsYouHave?.length > 0 && <span className="meta-pill match">✓ {recipe.ingredientsYouHave.length}/{recipe.ingredientsNeeded?.length} ingredients</span>}
                  </div>
                </div>
                <span className={`expand-icon ${expanded[i] ? "open" : ""}`}>▾</span>
              </div>
              {expanded[i] && (
                <div className="recipe-body">
                  <p className="recipe-desc">{recipe.description}</p>
                  <h4>Ingredients</h4>
                  <div className="ingredients-list">{recipe.ingredientsNeeded?.map(ing => <span key={ing} className={`ing-pill ${recipe.ingredientsYouHave?.includes(ing) ? "have" : ""}`}>{recipe.ingredientsYouHave?.includes(ing) ? "✓ " : ""}{ing}</span>)}</div>
                  <h4>Steps</h4>
                  <ol className="steps-list">{recipe.steps?.map((step, j) => <li key={j}>{step}</li>)}</ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && !recipes.length && !error && (
        <div className="empty-state">
          <div className="empty-icon">🥘</div>
          <p>Add ingredients and hit <strong>Suggest Recipes</strong>{allPantryItems.length > 0 ? ", or cook from your pantry!" : ""}</p>
        </div>
      )}
      <div className="telegram-note" style={{ marginTop: "40px" }}>
        <span className="telegram-icon">🤖</span>
        <div><h3>Shufud on Telegram</h3><p>Chat with Shufud as a bot. Try: <code>/recipe palm oil, tomatoes, stockfish</code></p></div>
      </div>
    </>
  );
}

function PantryTab({ pantry, setPantry }) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("proteins");
  const inputRef = useRef(null);
  const totalItems = Object.values(pantry).flat().length;

  const addItem = () => {
    const val = input.trim().toLowerCase();
    if (!val) return;
    setPantry(prev => { const existing = prev[category] || []; if (existing.includes(val)) return prev; return { ...prev, [category]: [...existing, val] }; });
    setInput(""); inputRef.current?.focus();
  };
  const removeItem = (cat, item) => setPantry(prev => ({ ...prev, [cat]: prev[cat].filter(i => i !== item) }));
  const clearAll = () => { if (window.confirm("Clear all pantry items?")) setPantry({ proteins: [], vegetables: [], grains: [], spices: [], oils: [], others: [] }); };
  const handleKeyDown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addItem(); } };

  return (
    <>
      <div className="pantry-header-row">
        <div className="pantry-title">My Pantry <span>{totalItems} item{totalItems !== 1 ? "s" : ""} stored</span></div>
        {totalItems > 0 && <button className="pantry-clear-btn" onClick={clearAll}>Clear All</button>}
      </div>
      <div className="input-section">
        <span className="input-label">Add to Pantry</span>
        <div className="pantry-add-row">
          <select className="category-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
          </select>
          <input ref={inputRef} className="ingredient-input" type="text" placeholder="e.g. chicken, palm oil..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button className="add-btn" onClick={addItem}>+ Add</button>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "8px" }}>Press Enter or comma to add quickly.</p>
      </div>
      <div className="pantry-categories">
        {CATEGORIES.map(cat => {
          const items = pantry[cat.key] || [];
          return (
            <div className="category-block" key={cat.key}>
              <div className="category-heading"><span>{cat.emoji} {cat.label}</span><span className="category-count">{items.length}</span></div>
              <div className="category-items">
                {items.length === 0 ? <span className="category-empty">Nothing here yet</span> : items.map(item => <span key={item} className="pantry-tag">{item}<span className="tag-remove" onClick={() => removeItem(cat.key, item)}>×</span></span>)}
              </div>
            </div>
          );
        })}
      </div>
      {totalItems > 0 && (
        <div className="pantry-cook-section">
          <h3>🍳 Ready to Cook?</h3>
          <p>You have {totalItems} ingredients stored. Switch to the <strong>Recipes</strong> tab and tap <strong>"Cook from My Pantry"</strong>.</p>
          <div className="pantry-ingredient-preview">
            {Object.values(pantry).flat().slice(0, 12).map(item => <span key={item} className="preview-pill">{item}</span>)}
            {totalItems > 12 && <span className="preview-pill">+{totalItems - 12} more</span>}
          </div>
        </div>
      )}
      {totalItems === 0 && <div className="empty-state"><div className="empty-icon">🧺</div><p>Your pantry is empty.<br />Start adding ingredients you have at home!</p></div>}
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("recipes");
  const [pantry, setPantry] = useState({ proteins: [], vegetables: [], grains: [], spices: [], oils: [], others: [] });
  const totalPantryItems = Object.values(pantry).flat().length;

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <header className="header">
          <h1><em>Shufud</em></h1>
          <p>Tell me what you have · I'll tell you what to cook</p>
          <div className="cuisine-tags">
            {["🍛 Jollof Rice", "🥘 Egusi Soup", "🌶 Pepper Soup", "🍌 Dodo", "🫕 Efo Riro"].map(tag => <span key={tag} className="cuisine-tag">{tag}</span>)}
          </div>
          <p style={{ marginTop: "10px", color: "var(--clay)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>✦ Nigerian &amp; African cuisine featured</p>
        </header>
        <div className="tabs">
          <button className={`tab ${activeTab === "recipes" ? "active" : ""}`} onClick={() => setActiveTab("recipes")}>🍽 Recipes</button>
          <button className={`tab ${activeTab === "pantry" ? "active" : ""}`} onClick={() => setActiveTab("pantry")}>
            🧺 My Pantry {totalPantryItems > 0 && <span className="tab-badge">{totalPantryItems}</span>}
          </button>
        </div>
        {activeTab === "recipes" ? <RecipeTab pantryIngredients={pantry} /> : <PantryTab pantry={pantry} setPantry={setPantry} />}
      </div>
    </>
  );
}
