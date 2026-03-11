import { useState, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --saffron: #E8A020;
    --tangerine: #E06820;
    --magenta: #B8185A;
    --gold: #D4922A;
    --lime: #7AB830;
    --crimson: #CC1818;
    --forest-green: #2A8C18;
    --bg: #FFF8F0;
    --warm-white: #FFFCF8;
    --charcoal: #1A1008;
    --muted: #7A5C3A;
    --border: #F0D8B8;
    --tag-bg: #FFF0D8;
    --card-shadow: 0 4px 24px rgba(232,160,32,0.12);
  }

  body { font-family: 'DM Mono', monospace; background: var(--bg); color: var(--charcoal); min-height: 100vh; }
  .app { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }

  .header { text-align: center; padding: 48px 0 32px; }
  .header-accent { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
  .header-accent span { display: block; height: 4px; border-radius: 2px; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.8rem, 6vw, 4rem); color: var(--tangerine); line-height: 1; letter-spacing: -1px; text-shadow: 3px 3px 0px rgba(232,104,32,0.15); }
  .header h1 em { color: var(--magenta); font-style: italic; }
  .header-sub { margin-top: 10px; color: var(--muted); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .cuisine-tags { display: flex; justify-content: center; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
  .cuisine-tag { font-size: 0.68rem; padding: 5px 12px; border-radius: 20px; letter-spacing: 0.04em; font-weight: 500; }
  .ct-1 { background: var(--saffron); color: white; }
  .ct-2 { background: var(--magenta); color: white; }
  .ct-3 { background: var(--lime); color: white; }
  .ct-4 { background: var(--crimson); color: white; }
  .ct-5 { background: var(--tangerine); color: white; }
  .nigerian-badge { margin-top: 12px; font-size: 0.7rem; color: var(--magenta); letter-spacing: 0.08em; font-weight: 500; }

  .tabs { display: flex; background: var(--warm-white); border: 2px solid var(--border); border-radius: 14px; padding: 4px; margin-bottom: 32px; gap: 4px; }
  .tab { flex: 1; padding: 10px 20px; font-family: 'DM Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-radius: 10px; border: none; background: transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500; }
  .tab:hover { background: var(--tag-bg); color: var(--tangerine); }
  .tab.active { background: var(--tangerine); color: white; box-shadow: 0 2px 12px rgba(224,104,32,0.35); }
  .tab-badge { background: var(--magenta); color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; }

  .card { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 18px; padding: 24px; margin-bottom: 20px; box-shadow: var(--card-shadow); }
  .input-label { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; font-weight: 500; }
  .input-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .text-input { flex: 1; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--charcoal); outline: none; transition: border-color 0.2s; }
  .text-input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(232,160,32,0.12); }
  .text-input::placeholder { color: #C8A880; }

  .btn { padding: 12px 20px; border: none; border-radius: 10px; font-family: 'DM Mono', monospace; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--tangerine); color: white; }
  .btn-primary:hover:not(:disabled) { background: #D05818; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(224,104,32,0.35); }
  .btn-secondary { background: var(--magenta); color: white; }
  .btn-secondary:hover { background: #A01050; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(184,24,90,0.35); }
  .btn-ghost { background: transparent; border: 1.5px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--tangerine); color: var(--tangerine); }
  .btn-danger { background: transparent; border: 1.5px solid var(--border); color: var(--muted); }
  .btn-danger:hover { border-color: var(--crimson); color: var(--crimson); background: #FFF0F0; }
  .btn-icon { padding: 7px 12px; font-size: 0.72rem; border-radius: 8px; }
  .btn-full { width: 100%; padding: 16px; font-family: 'Playfair Display', serif; font-size: 1.05rem; justify-content: center; border-radius: 12px; }
  .btn-full:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-pantry { background: var(--forest-green); color: white; margin-top: 12px; }
  .btn-pantry:hover:not(:disabled) { background: #228014; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(42,140,24,0.3); }

  .tags { display: flex; flex-wrap: wrap; gap: 8px; min-height: 28px; }
  .tag { background: var(--tag-bg); border: 1.5px solid var(--border); border-radius: 20px; padding: 5px 12px 5px 14px; font-size: 0.78rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; }
  @keyframes tagIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  .tag-remove { cursor: pointer; color: var(--muted); font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .tag-remove:hover { color: var(--crimson); }

  .options-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .select-input { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--charcoal); outline: none; cursor: pointer; flex: 1; min-width: 140px; }
  .select-input:focus { border-color: var(--saffron); }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .results-header { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--tangerine); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .results-header::after { content: ''; flex: 1; height: 2px; background: linear-gradient(to right, var(--border), transparent); }

  .recipe-card { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 18px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--card-shadow); animation: cardIn 0.35s ease both; transition: box-shadow 0.2s; }
  .recipe-card:hover { box-shadow: 0 8px 32px rgba(232,160,32,0.2); }
  @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-card:nth-child(2) { animation-delay: 0.08s; }
  .recipe-card:nth-child(3) { animation-delay: 0.16s; }

  .recipe-header { padding: 20px 24px 16px; cursor: pointer; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .recipe-title-group { flex: 1; }
  .recipe-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--charcoal); margin-bottom: 8px; line-height: 1.3; }
  .recipe-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .meta-pill { font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); background: var(--tag-bg); border: 1px solid var(--border); padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .meta-pill.nigerian { background: var(--tangerine); color: white; border-color: var(--tangerine); }
  .meta-pill.match { background: var(--lime); color: white; border-color: var(--lime); }
  .meta-pill.time { background: var(--saffron); color: white; border-color: var(--saffron); }
  .expand-icon { color: var(--muted); font-size: 1.2rem; transition: transform 0.25s; flex-shrink: 0; margin-top: 4px; }
  .expand-icon.open { transform: rotate(180deg); color: var(--tangerine); }

  .recipe-body { padding: 0 24px 24px; border-top: 1.5px solid var(--border); }
  .recipe-body h4 { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--magenta); margin: 18px 0 10px; font-weight: 600; }
  .recipe-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.65; margin-top: 12px; }
  .ingredients-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .ing-pill { font-size: 0.75rem; padding: 4px 12px; border-radius: 16px; border: 1.5px solid var(--border); background: var(--bg); color: var(--charcoal); }
  .ing-pill.have { background: #F0FFF0; border-color: var(--lime); color: var(--forest-green); }
  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; display: flex; gap: 14px; margin-bottom: 12px; font-size: 0.82rem; line-height: 1.7; color: var(--charcoal); }
  .steps-list li::before { content: counter(steps); background: var(--magenta); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; flex-shrink: 0; margin-top: 2px; font-weight: 700; }

  .empty-state { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 0.82rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 14px; opacity: 0.5; }
  .error-box { background: #FFF0F0; border: 1.5px solid #FFCCCC; border-radius: 12px; padding: 14px 18px; color: var(--crimson); font-size: 0.82rem; margin-top: 12px; }

  .telegram-note { margin-top: 40px; display: flex; gap: 16px; align-items: flex-start; background: linear-gradient(135deg, #F0FFF8, #FFF8F0); border-radius: 16px; padding: 20px 24px; border: 1.5px solid var(--lime); }
  .telegram-icon { font-size: 1.8rem; flex-shrink: 0; }
  .telegram-note h3 { font-family: 'Playfair Display', serif; color: var(--forest-green); font-size: 1rem; margin-bottom: 4px; }
  .telegram-note p { font-size: 0.76rem; color: var(--muted); line-height: 1.6; }
  .telegram-note code { background: var(--tag-bg); padding: 1px 6px; border-radius: 4px; font-size: 0.85em; color: var(--tangerine); }

  .pantry-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .pantry-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--tangerine); }
  .pantry-title span { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); margin-left: 10px; }
  .pantry-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .pantry-add-row { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
  .category-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--charcoal); outline: none; cursor: pointer; min-width: 170px; }
  .category-select:focus { border-color: var(--saffron); }

  .pantry-categories { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
  .category-block { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); }
  .category-heading { padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--border); }
  .category-heading-left { display: flex; align-items: center; gap: 10px; }
  .category-color-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .category-name-display { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--charcoal); font-weight: 600; }
  .category-name-input { font-size: 0.75rem; letter-spacing: 0.06em; color: var(--charcoal); font-weight: 600; border: 1.5px solid var(--saffron); border-radius: 6px; padding: 3px 10px; background: var(--bg); font-family: 'DM Mono', monospace; outline: none; width: 160px; }
  .category-count { font-size: 0.65rem; color: var(--muted); background: var(--tag-bg); border: 1px solid var(--border); padding: 2px 8px; border-radius: 10px; }
  .category-heading-right { display: flex; align-items: center; gap: 8px; }
  .category-items { padding: 14px 18px; display: flex; flex-wrap: wrap; gap: 8px; min-height: 52px; }
  .category-empty { color: #C8A880; font-size: 0.75rem; font-style: italic; }
  .pantry-tag { background: var(--tag-bg); border: 1.5px solid var(--border); border-radius: 20px; padding: 5px 12px 5px 14px; font-size: 0.78rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; transition: border-color 0.15s; }
  .pantry-tag:hover { border-color: var(--saffron); }

  .pantry-cook-section { margin-top: 24px; background: linear-gradient(135deg, #FFF8E8, #FFF0F8); border: 1.5px solid var(--saffron); border-radius: 16px; padding: 22px 24px; }
  .pantry-cook-section h3 { font-family: 'Playfair Display', serif; color: var(--tangerine); font-size: 1.1rem; margin-bottom: 8px; }
  .pantry-cook-section p { font-size: 0.78rem; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
  .pantry-ingredient-preview { display: flex; flex-wrap: wrap; gap: 6px; }
  .preview-pill { font-size: 0.72rem; padding: 3px 10px; border-radius: 14px; background: white; border: 1.5px solid var(--saffron); color: var(--tangerine); font-weight: 500; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(26,16,8,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--warm-white); border: 2px solid var(--border); border-radius: 20px; padding: 32px; width: 90%; max-width: 420px; box-shadow: 0 20px 60px rgba(26,16,8,0.2); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal h3 { font-family: 'Playfair Display', serif; color: var(--tangerine); font-size: 1.3rem; margin-bottom: 20px; }
  .modal-field { margin-bottom: 18px; }
  .modal-field label { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; font-weight: 500; }
  .color-picker-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .color-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: transform 0.15s, border-color 0.15s; }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch.selected { border-color: var(--charcoal); transform: scale(1.15); }
  .emoji-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .emoji-opt { font-size: 1.4rem; cursor: pointer; padding: 6px; border-radius: 8px; border: 2px solid transparent; transition: all 0.15s; background: var(--tag-bg); }
  .emoji-opt:hover { border-color: var(--saffron); transform: scale(1.1); }
  .emoji-opt.selected { border-color: var(--tangerine); background: var(--bg); }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .modal-actions .btn { flex: 1; justify-content: center; }
`;

const SWATCH_COLORS = ["#E8A020","#E06820","#B8185A","#D4922A","#7AB830","#CC1818","#2A8C18","#1870B8","#8818B8","#18A8B8"];
const EMOJI_OPTIONS = ["🥩","🥬","🌾","🌶","🫙","🧺","🫚","🥚","🧅","🫛","🥦","🍅","🌽","🥜","🧄","🫘"];

const DEFAULT_CATEGORIES = [
  { key: "proteins", label: "Proteins", emoji: "🥩", color: "#E06820" },
  { key: "vegetables", label: "Vegetables & Leaves", emoji: "🥬", color: "#7AB830" },
  { key: "grains", label: "Grains & Carbs", emoji: "🌾", color: "#E8A020" },
  { key: "spices", label: "Spices & Seasonings", emoji: "🌶", color: "#CC1818" },
  { key: "oils", label: "Oils & Fats", emoji: "🫙", color: "#D4922A" },
  { key: "others", label: "Others", emoji: "🧺", color: "#B8185A" },
];

const SYSTEM_PROMPT = `You are Shufud, a friendly and creative recipe assistant with deep knowledge of Nigerian and West African cuisine.
When given a list of ingredients, suggest 2 recipes. ALWAYS include at least 1 Nigerian or West African dish if the ingredients can support it (e.g. Jollof Rice, Egusi Soup, Pepper Soup, Efo Riro, Moi Moi, Suya, Akara, Puff Puff, Ofada Stew, Banga Soup, Ofe Onugbu, Fried Plantain, etc.).
If the ingredients strongly suggest African cooking (palm oil, crayfish, ogiri, iru, ugwu, stockfish, yam, plantain, etc.), make both recipes Nigerian/African.
Respond ONLY with valid JSON in this exact format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "cuisine": "Nigerian",
      "description": "One sentence about the dish.",
      "time": "20 mins",
      "difficulty": "Easy",
      "servings": "2",
      "ingredientsNeeded": ["ingredient1", "ingredient2"],
      "ingredientsYouHave": ["ingredient1"],
      "steps": ["Step one.", "Step two.", "Step three."]
    }
  ]
}
Be culturally authentic with Nigerian dishes.`;

const isNigerian = (c) => c?.toLowerCase().includes("nigerian") || c?.toLowerCase().includes("african");

function AddCategoryModal({ onClose, onAdd }) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("🧺");
  const [color, setColor] = useState("#E8A020");

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({ key: `cat_${Date.now()}`, label: label.trim(), emoji, color });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>New Category</h3>
        <div className="modal-field">
          <label>Category Name</label>
          <input className="text-input" style={{ width: "100%" }} placeholder="e.g. Dairy, Fruits, Nuts..."
            value={label} onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()} autoFocus />
        </div>
        <div className="modal-field">
          <label>Pick an Emoji</label>
          <div className="emoji-picker-row">
            {EMOJI_OPTIONS.map(em => (
              <span key={em} className={`emoji-opt ${emoji === em ? "selected" : ""}`} onClick={() => setEmoji(em)}>{em}</span>
            ))}
          </div>
        </div>
        <div className="modal-field">
          <label>Pick a Color</label>
          <div className="color-picker-row">
            {SWATCH_COLORS.map(c => (
              <div key={c} className={`color-swatch ${color === c ? "selected" : ""}`}
                style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!label.trim()}>Create Category</button>
        </div>
      </div>
    </div>
  );
}

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
    if (val && !ingredients.includes(val)) setIngredients(p => [...p, val]);
    setInput(""); inputRef.current?.focus();
  };
  const removeIngredient = (ing) => setIngredients(p => p.filter(i => i !== ing));
  const handleKeyDown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addIngredient(); } };
  const toggleExpand = (i) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  const fetchRecipes = async (ings) => {
    if (!ings.length) return;
    setLoading(true); setError(""); setRecipes([]); setExpanded({});
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Ingredients: ${ings.join(", ")}. Meal: ${mealType}. Diet: ${dietary}. Suggest 2 recipes.` }]
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(`API Error: ${JSON.stringify(data?.details || data?.error)}`); return; }
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setRecipes(parsed.recipes || []);
      if (parsed.recipes?.length) setExpanded({ 0: true });
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="card">
        <span className="input-label">Your Ingredients</span>
        <div className="input-row">
          <input ref={inputRef} className="text-input" type="text"
            placeholder="e.g. palm oil, tomatoes, stockfish, plantain..."
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button className="btn btn-primary" onClick={addIngredient}>+ Add</button>
        </div>
        <div className="tags">
          {ingredients.length === 0 && <span style={{ color: "#C8A880", fontSize: "0.78rem" }}>No ingredients added yet</span>}
          {ingredients.map(ing => (
            <span key={ing} className="tag">{ing}
              <span className="tag-remove" onClick={() => removeIngredient(ing)}>×</span>
            </span>
          ))}
        </div>
      </div>

      <div className="options-row">
        <select className="select-input" value={mealType} onChange={e => setMealType(e.target.value)}>
          <option value="any">Any meal type</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>
        <select className="select-input" value={dietary} onChange={e => setDietary(e.target.value)}>
          <option value="none">No dietary restriction</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten-free</option>
          <option value="dairy-free">Dairy-free</option>
          <option value="keto">Keto</option>
        </select>
      </div>

      <button className="btn btn-primary btn-full" onClick={() => fetchRecipes(ingredients)} disabled={loading || !ingredients.length}>
        {loading ? <><div className="spinner" /> Finding recipes…</> : "✦ Suggest Recipes"}
      </button>

      {allPantryItems.length > 0 && (
        <button className="btn btn-full btn-pantry" onClick={() => fetchRecipes(allPantryItems)} disabled={loading}>
          {loading ? <><div className="spinner" />Finding…</> : `🧺 Cook from My Pantry (${allPantryItems.length} items)`}
        </button>
      )}

      {error && <div className="error-box">⚠ {error}</div>}

      {recipes.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <div className="results-header">{recipes.length} recipes found</div>
          {recipes.map((recipe, i) => (
            <div className="recipe-card" key={i}>
              <div className="recipe-header" onClick={() => toggleExpand(i)}>
                <div className="recipe-title-group">
                  <div className="recipe-name">{recipe.name}</div>
                  <div className="recipe-meta">
                    {recipe.cuisine && (
                      <span className={`meta-pill ${isNigerian(recipe.cuisine) ? "nigerian" : ""}`}>
                        {isNigerian(recipe.cuisine) ? "🇳🇬 " : ""}{recipe.cuisine}
                      </span>
                    )}
                    <span className="meta-pill time">⏱ {recipe.time}</span>
                    <span className="meta-pill">{recipe.difficulty}</span>
                    <span className="meta-pill">🍽 {recipe.servings} servings</span>
                    {recipe.ingredientsYouHave?.length > 0 && (
                      <span className="meta-pill match">✓ {recipe.ingredientsYouHave.length}/{recipe.ingredientsNeeded?.length}</span>
                    )}
                  </div>
                </div>
                <span className={`expand-icon ${expanded[i] ? "open" : ""}`}>▾</span>
              </div>
              {expanded[i] && (
                <div className="recipe-body">
                  <p className="recipe-desc">{recipe.description}</p>
                  <h4>Ingredients</h4>
                  <div className="ingredients-list">
                    {recipe.ingredientsNeeded?.map(ing => (
                      <span key={ing} className={`ing-pill ${recipe.ingredientsYouHave?.includes(ing) ? "have" : ""}`}>
                        {recipe.ingredientsYouHave?.includes(ing) ? "✓ " : ""}{ing}
                      </span>
                    ))}
                  </div>
                  <h4>Steps</h4>
                  <ol className="steps-list">
                    {recipe.steps?.map((step, j) => <li key={j}>{step}</li>)}
                  </ol>
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
        <div>
          <h3>Shufud on Telegram</h3>
          <p>Chat with Shufud as a bot. Try: <code>/recipe palm oil, tomatoes, stockfish</code></p>
        </div>
      </div>
    </>
  );
}

function PantryTab({ pantry, setPantry, categories, setCategories }) {
  const [input, setInput] = useState("");
  const [selectedCat, setSelectedCat] = useState("proteins");
  const [editingCat, setEditingCat] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const inputRef = useRef(null);
  const totalItems = Object.values(pantry).flat().length;

  const addItem = () => {
    const val = input.trim().toLowerCase();
    if (!val) return;
    setPantry(prev => {
      const existing = prev[selectedCat] || [];
      if (existing.includes(val)) return prev;
      return { ...prev, [selectedCat]: [...existing, val] };
    });
    setInput(""); inputRef.current?.focus();
  };

  const removeItem = (cat, item) => setPantry(p => ({ ...p, [cat]: (p[cat] || []).filter(i => i !== item) }));

  const clearAll = () => {
    if (window.confirm("Clear all pantry items?")) {
      const empty = {};
      categories.forEach(c => { empty[c.key] = []; });
      setPantry(empty);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addItem(); } };
  const startEdit = (cat) => { setEditingCat(cat.key); setEditLabel(cat.label); };
  const saveEdit = (key) => {
    if (editLabel.trim()) setCategories(prev => prev.map(c => c.key === key ? { ...c, label: editLabel.trim() } : c));
    setEditingCat(null);
  };

  const deleteCategory = (key) => {
    const hasItems = (pantry[key] || []).length > 0;
    if (hasItems && !window.confirm("This category has items. Delete anyway?")) return;
    setCategories(prev => prev.filter(c => c.key !== key));
    setPantry(prev => { const n = { ...prev }; delete n[key]; return n; });
    if (selectedCat === key) setSelectedCat(categories.find(c => c.key !== key)?.key || "");
  };

  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    setPantry(prev => ({ ...prev, [newCat.key]: [] }));
    setSelectedCat(newCat.key);
  };

  return (
    <>
      {showAddModal && <AddCategoryModal onClose={() => setShowAddModal(false)} onAdd={handleAddCategory} />}

      <div className="pantry-top-row">
        <div className="pantry-title">My Pantry <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span></div>
        <div className="pantry-actions">
          <button className="btn btn-secondary btn-icon" onClick={() => setShowAddModal(true)}>+ New Category</button>
          {totalItems > 0 && <button className="btn btn-danger btn-icon" onClick={clearAll}>Clear All</button>}
        </div>
      </div>

      <div className="card">
        <span className="input-label">Add Ingredient to Pantry</span>
        <div className="pantry-add-row">
          <select className="category-select" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            {categories.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
          </select>
          <input ref={inputRef} className="text-input" type="text"
            placeholder="e.g. chicken, palm oil, ugwu..."
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button className="btn btn-primary" onClick={addItem}>+ Add</button>
        </div>
        <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "4px" }}>Press Enter or comma to add quickly.</p>
      </div>

      <div className="pantry-categories">
        {categories.map(cat => {
          const items = pantry[cat.key] || [];
          return (
            <div className="category-block" key={cat.key}>
              <div className="category-heading" style={{ background: `${cat.color}15` }}>
                <div className="category-heading-left">
                  <div className="category-color-dot" style={{ background: cat.color }} />
                  <span style={{ fontSize: "1.1rem" }}>{cat.emoji}</span>
                  {editingCat === cat.key ? (
                    <input className="category-name-input" value={editLabel}
                      onChange={e => setEditLabel(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(cat.key); if (e.key === "Escape") setEditingCat(null); }}
                      onBlur={() => saveEdit(cat.key)} autoFocus />
                  ) : (
                    <span className="category-name-display">{cat.label}</span>
                  )}
                  <span className="category-count">{items.length}</span>
                </div>
                <div className="category-heading-right">
                  {editingCat === cat.key
                    ? <button className="btn btn-ghost btn-icon" onClick={() => saveEdit(cat.key)}>✓ Save</button>
                    : <button className="btn btn-ghost btn-icon" onClick={() => startEdit(cat)}>✏ Rename</button>
                  }
                  <button className="btn btn-danger btn-icon" onClick={() => deleteCategory(cat.key)}>🗑</button>
                </div>
              </div>
              <div className="category-items">
                {items.length === 0
                  ? <span className="category-empty">Nothing here yet — add some {cat.emoji}</span>
                  : items.map(item => (
                    <span key={item} className="pantry-tag" style={{ borderColor: `${cat.color}50` }}>
                      {item}
                      <span className="tag-remove" onClick={() => removeItem(cat.key, item)}>×</span>
                    </span>
                  ))
                }
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="pantry-cook-section">
          <h3>🍳 Ready to Cook?</h3>
          <p>You have <strong>{totalItems} ingredients</strong> stored. Switch to <strong>Recipes</strong> and tap <strong>"Cook from My Pantry"</strong>.</p>
          <div className="pantry-ingredient-preview">
            {Object.values(pantry).flat().slice(0, 14).map(item => <span key={item} className="preview-pill">{item}</span>)}
            {totalItems > 14 && <span className="preview-pill">+{totalItems - 14} more</span>}
          </div>
        </div>
      )}

      {totalItems === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🧺</div>
          <p>Your pantry is empty.<br />Start adding what you have at home!</p>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("recipes");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [pantry, setPantry] = useState({
    proteins: [], vegetables: [], grains: [], spices: [], oils: [], others: []
  });
  const totalPantryItems = Object.values(pantry).flat().length;

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <header className="header">
          <div className="header-accent">
            {[["#E8A020",60],["#E06820",40],["#B8185A",50],["#7AB830",35],["#CC1818",45]].map(([c,w],i) => (
              <span key={i} style={{ background: c, width: w }} />
            ))}
          </div>
          <h1><em>Shufud</em></h1>
          <p className="header-sub">Tell me what you have · I'll tell you what to cook</p>
          <div className="cuisine-tags">
            {[["🍛 Jollof Rice","ct-1"],["🥘 Egusi Soup","ct-2"],["🌶 Pepper Soup","ct-3"],["🍌 Dodo","ct-4"],["🫕 Efo Riro","ct-5"]].map(([tag,cls]) => (
              <span key={tag} className={`cuisine-tag ${cls}`}>{tag}</span>
            ))}
          </div>
          <p className="nigerian-badge">✦ Nigerian &amp; African cuisine featured</p>
        </header>

        <div className="tabs">
          <button className={`tab ${activeTab === "recipes" ? "active" : ""}`} onClick={() => setActiveTab("recipes")}>🍽 Recipes</button>
          <button className={`tab ${activeTab === "pantry" ? "active" : ""}`} onClick={() => setActiveTab("pantry")}>
            🧺 My Pantry {totalPantryItems > 0 && <span className="tab-badge">{totalPantryItems}</span>}
          </button>
        </div>

        {activeTab === "recipes"
          ? <RecipeTab pantryIngredients={pantry} />
          : <PantryTab pantry={pantry} setPantry={setPantry} categories={categories} setCategories={setCategories} />
        }
      </div>
    </>
  );
}
