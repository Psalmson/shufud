import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth, { VerifyEmail } from "./Auth";
import Profile, { AvatarButton } from "./Profile";
import MealPlanner from "./MealPlanner";
import Admin from "./Admin";
import UpgradeModal from "./UpgradeModal";
import Onboarding from "./Onboarding";

const ADMIN_EMAIL = "psalmsonlarinre@gmail.com";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #2E5339;
    --green-light: #3a6647;
    --green-pale: #f0f5f1;
    --orange: #FF570A;
    --orange-light: #ff7033;
    --orange-pale: #fff3ee;
    --teal: #05B2DC;
    --teal-light: #29c4e8;
    --teal-pale: #edfaff;
    --bg: #f8faf8;
    --warm-white: #ffffff;
    --charcoal: #0f1f14;
    --muted: #4a6655;
    --border: #d4e2d8;
    --card-shadow: 0 4px 24px rgba(46,83,57,0.10);
  }

  body { font-family: 'Afacad Flux', sans-serif; font-size: 18px; background: var(--bg); color: var(--charcoal); min-height: 100vh; }
  .app { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }

  .header { text-align: center; padding: 48px 0 32px; position: relative; }
  .header-accent { display: flex; justify-content: center; gap: 0; margin-bottom: 24px; border-radius: 4px; overflow: hidden; width: 120px; margin-left: auto; margin-right: auto; height: 5px; }
  .header-accent span { display: block; height: 5px; }
  .header h1 { font-family: 'Spectral', serif; font-size: clamp(2.8rem, 6vw, 4rem); color: var(--green); line-height: 1; letter-spacing: -1px; }
  .header h1 em { color: var(--orange); font-style: italic; }
  .header-sub { margin-top: 10px; color: var(--muted); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .cuisine-tags { display: flex; justify-content: center; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
  .cuisine-tag { font-size: 0.68rem; padding: 5px 12px; border-radius: 20px; letter-spacing: 0.04em; font-weight: 500; }
  .ct-1 { background: var(--orange); color: white; }
  .ct-2 { background: var(--green); color: white; }
  .ct-3 { background: var(--teal); color: white; }
  .ct-4 { background: var(--orange); color: white; opacity: 0.85; }
  .ct-5 { background: var(--green); color: white; opacity: 0.8; }
  .nigerian-badge { margin-top: 12px; font-size: 0.7rem; color: var(--teal); letter-spacing: 0.08em; font-weight: 500; }

  .tabs { display: flex; background: var(--warm-white); border: 2px solid var(--border); border-radius: 14px; padding: 4px; margin-bottom: 32px; gap: 4px; }
  .tab { flex: 1; padding: 10px 20px; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-radius: 10px; border: none; background: transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500; }
  .tab:hover { background: var(--orange-pale); color: var(--orange); }
  .tab.active { background: var(--orange); color: white; box-shadow: 0 2px 12px rgba(255,87,10,0.35); }
  .tab-badge { background: var(--teal); color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; }

  .card { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 18px; padding: 24px; margin-bottom: 20px; box-shadow: var(--card-shadow); }
  .input-label { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; font-weight: 500; }
  .input-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .text-input { flex: 1; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 1rem; color: var(--charcoal); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .text-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(5,178,220,0.12); }
  .text-input::placeholder { color: #9ab5a2; }

  .btn { padding: 12px 20px; border: none; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--orange); color: white; }
  .btn-primary:hover:not(:disabled) { background: var(--orange-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,87,10,0.35); }
  .btn-secondary { background: var(--teal); color: white; }
  .btn-secondary:hover { background: var(--teal-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(5,178,220,0.35); }
  .btn-green { background: var(--green); color: white; }
  .btn-green:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(46,83,57,0.3); }
  .btn-ghost { background: transparent; border: 1.5px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--teal); color: var(--teal); }
  .btn-danger { background: transparent; border: 1.5px solid var(--border); color: var(--muted); }
  .btn-danger:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-pale); }
  .btn-icon { padding: 7px 12px; font-size: 0.78rem; border-radius: 8px; }
  .btn-full { width: 100%; padding: 16px; font-family: 'Spectral', serif; font-size: 1.05rem; justify-content: center; border-radius: 12px; letter-spacing: 0.02em; }
  .btn-full:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
  .btn-pantry { background: var(--green); color: white; margin-top: 12px; }
  .btn-pantry:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(46,83,57,0.3); }

  .tags { display: flex; flex-wrap: wrap; gap: 8px; min-height: 28px; }
  .tag { background: var(--teal-pale); border: 1.5px solid #b8eaf5; border-radius: 20px; padding: 5px 12px 5px 14px; font-size: 0.85rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; }
  @keyframes tagIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  .tag-remove { cursor: pointer; color: var(--muted); font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .tag-remove:hover { color: var(--orange); }

  .options-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .select-input { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; color: var(--charcoal); outline: none; cursor: pointer; flex: 1; min-width: 140px; transition: border-color 0.2s; }
  .select-input:focus { border-color: var(--teal); }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .results-header { font-family: 'Spectral', serif; font-size: 1.1rem; color: var(--green); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .results-header::after { content: ''; flex: 1; height: 2px; background: linear-gradient(to right, var(--border), transparent); }

  .recipe-card { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 18px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--card-shadow); animation: cardIn 0.35s ease both; transition: box-shadow 0.2s, border-color 0.2s; }
  .recipe-card:hover { box-shadow: 0 8px 32px rgba(46,83,57,0.15); border-color: #b8d4c0; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .recipe-card:nth-child(2) { animation-delay: 0.08s; }
  .recipe-card:nth-child(3) { animation-delay: 0.16s; }

  .recipe-header { padding: 20px 24px 16px; cursor: pointer; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .recipe-title-group { flex: 1; }
  .recipe-name { font-family: 'Spectral', serif; font-size: 1.2rem; color: var(--charcoal); margin-bottom: 8px; line-height: 1.3; }
  .recipe-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .meta-pill { font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); background: var(--green-pale); border: 1px solid var(--border); padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .meta-pill.nigerian { background: var(--green); color: white; border-color: var(--green); }
  .meta-pill.match { background: var(--teal); color: white; border-color: var(--teal); }
  .meta-pill.time { background: var(--orange); color: white; border-color: var(--orange); }
  .expand-icon { color: var(--muted); font-size: 1.2rem; transition: transform 0.25s; flex-shrink: 0; margin-top: 4px; }
  .expand-icon.open { transform: rotate(180deg); color: var(--orange); }

  .recipe-body { padding: 0 24px 24px; border-top: 1.5px solid var(--border); }
  .recipe-body h4 { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); margin: 18px 0 10px; font-weight: 600; }
  .recipe-desc { font-size: 0.92rem; color: var(--muted); line-height: 1.65; margin-top: 12px; }
  .ingredients-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .ing-pill { font-size: 0.82rem; padding: 4px 12px; border-radius: 16px; border: 1.5px solid var(--border); background: var(--bg); color: var(--charcoal); }
  .ing-pill.have { background: var(--teal-pale); border-color: var(--teal); color: #037a97; }
  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; display: flex; gap: 14px; margin-bottom: 12px; font-size: 0.92rem; line-height: 1.7; color: var(--charcoal); }
  .steps-list li::before { content: counter(steps); background: var(--orange); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; flex-shrink: 0; margin-top: 2px; font-weight: 700; }

  .empty-state { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 0.92rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 14px; opacity: 0.4; }
  .error-box { background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 12px; padding: 14px 18px; color: var(--orange); font-size: 0.92rem; margin-top: 12px; }

  .telegram-note { margin-top: 40px; display: flex; gap: 16px; align-items: flex-start; background: var(--teal-pale); border-radius: 16px; padding: 20px 24px; border: 1.5px solid #b8eaf5; }
  .telegram-icon { font-size: 1.8rem; flex-shrink: 0; }
  .telegram-note h3 { font-family: 'Spectral', serif; color: var(--green); font-size: 1rem; margin-bottom: 4px; }
  .telegram-note p { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
  .telegram-note code { background: white; padding: 1px 6px; border-radius: 4px; font-size: 0.85em; color: var(--orange); border: 1px solid var(--border); }

  .pantry-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .pantry-title { font-family: 'Spectral', serif; font-size: 1.5rem; color: var(--green); }
  .pantry-title span { font-family: 'Afacad Flux', sans-serif; font-size: 0.78rem; color: var(--muted); margin-left: 10px; }
  .pantry-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .pantry-add-row { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
  .category-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; color: var(--charcoal); outline: none; cursor: pointer; min-width: 170px; transition: border-color 0.2s; }
  .category-select:focus { border-color: var(--teal); }

  .pantry-categories { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
  .category-block { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--card-shadow); transition: box-shadow 0.2s; }
  .category-block:hover { box-shadow: 0 6px 24px rgba(46,83,57,0.12); }
  .category-heading { padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--border); }
  .category-heading-left { display: flex; align-items: center; gap: 10px; }
  .category-color-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .category-name-display { font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--charcoal); font-weight: 600; }
  .category-name-input { font-size: 0.82rem; letter-spacing: 0.06em; color: var(--charcoal); font-weight: 600; border: 1.5px solid var(--teal); border-radius: 6px; padding: 3px 10px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; outline: none; width: 160px; }
  .category-count { font-size: 0.7rem; color: var(--muted); background: var(--green-pale); border: 1px solid var(--border); padding: 2px 8px; border-radius: 10px; }
  .category-heading-right { display: flex; align-items: center; gap: 8px; }
  .category-items { padding: 14px 18px; display: flex; flex-wrap: wrap; gap: 8px; min-height: 52px; }
  .category-empty { color: #9ab5a2; font-size: 0.82rem; font-style: italic; }
  .pantry-tag { background: var(--green-pale); border: 1.5px solid var(--border); border-radius: 20px; padding: 5px 12px 5px 14px; font-size: 0.85rem; color: var(--charcoal); display: flex; align-items: center; gap: 8px; animation: tagIn 0.2s ease; transition: border-color 0.15s; }
  .pantry-tag:hover { border-color: var(--teal); }

  .pantry-cook-section { margin-top: 24px; background: linear-gradient(135deg, var(--teal-pale), var(--green-pale)); border: 1.5px solid var(--teal); border-radius: 16px; padding: 22px 24px; }
  .pantry-cook-section h3 { font-family: 'Spectral', serif; color: var(--green); font-size: 1.1rem; margin-bottom: 8px; }
  .pantry-cook-section p { font-size: 0.88rem; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
  .pantry-ingredient-preview { display: flex; flex-wrap: wrap; gap: 6px; }
  .preview-pill { font-size: 0.78rem; padding: 3px 10px; border-radius: 14px; background: white; border: 1.5px solid var(--teal); color: var(--teal); font-weight: 500; }

  .tooltip-wrap { position: relative; display: inline-block; width: 100%; }
  .tooltip-box { display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--charcoal); color: white; font-size: 0.78rem; padding: 8px 14px; border-radius: 8px; white-space: nowrap; z-index: 10; pointer-events: none; }
  .tooltip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--charcoal); }
  .tooltip-wrap:hover .tooltip-box { display: block; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--warm-white); border: 2px solid var(--border); border-radius: 20px; padding: 32px; width: 90%; max-width: 420px; box-shadow: 0 20px 60px rgba(15,31,20,0.2); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal h3 { font-family: 'Spectral', serif; color: var(--green); font-size: 1.3rem; margin-bottom: 20px; }
  .modal-field { margin-bottom: 18px; }
  .modal-field label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; font-weight: 500; }
  .color-picker-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .color-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: transform 0.15s, border-color 0.15s; }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch.selected { border-color: var(--charcoal); transform: scale(1.15); }
  .emoji-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .emoji-opt { font-size: 1.4rem; cursor: pointer; padding: 6px; border-radius: 8px; border: 2px solid transparent; transition: all 0.15s; background: var(--green-pale); }
  .emoji-opt:hover { border-color: var(--teal); transform: scale(1.1); }
  .emoji-opt.selected { border-color: var(--orange); background: var(--orange-pale); }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .modal-actions .btn { flex: 1; justify-content: center; }

  .upgrade-lock { text-align: center; padding: 60px 24px; }
  .upgrade-lock-icon { font-size: 3rem; margin-bottom: 16px; }
  .upgrade-lock h3 { font-family: 'Spectral', serif; color: var(--green); font-size: 1.3rem; margin-bottom: 8px; }
  .upgrade-lock p { font-size: 0.88rem; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }
  .upgrade-lock-btn { background: var(--orange); color: white; border: none; padding: 12px 28px; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
  .upgrade-lock-btn:hover { background: var(--orange-light); transform: translateY(-1px); }
`;

const SWATCH_COLORS = ["#FF570A","#05B2DC","#2E5339","#3a6647","#ff7033","#29c4e8","#e04e00","#037a97","#1a3d25","#6aabbb"];
const EMOJI_OPTIONS = ["🥩","🥬","🌾","🌶","🫙","🧺","🫚","🥚","🧅","🫛","🥦","🍅","🌽","🥜","🧄","🫘"];

const DEFAULT_CATEGORIES = [
  { key: "proteins",   label: "Proteins",            emoji: "🥩", color: "#FF570A" },
  { key: "vegetables", label: "Vegetables & Leaves", emoji: "🥬", color: "#2E5339" },
  { key: "grains",     label: "Grains & Carbs",      emoji: "🌾", color: "#05B2DC" },
  { key: "spices",     label: "Spices & Seasonings", emoji: "🌶", color: "#FF570A" },
  { key: "oils",       label: "Oils & Fats",         emoji: "🫙", color: "#2E5339" },
  { key: "others",     label: "Others",              emoji: "🧺", color: "#05B2DC" },
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
  const [color, setColor] = useState("#FF570A");

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

function RecipeTab({ pantryIngredients, userTier, onUpgrade }) {
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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Ingredients: ${ings.join(", ")}. Meal: ${mealType}. Diet: ${dietary}. Suggest 2 recipes.` }]
        })
      });
      const data = await res.json();
      if (res.status === 429) { setError(data.message); return; }
      if (!res.ok) { setError(`API Error: ${JSON.stringify(data?.details || data?.error)}`); return; }
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setRecipes(parsed.recipes || []);
      if (parsed.recipes?.length) setExpanded({ 0: true });
      if (data.usage_info?.remaining === 0) {
        setError("That was your last recipe suggestion for today. Come back tomorrow!");
      }
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
          {ingredients.length === 0 && <span style={{ color: "#9ab5a2", fontSize: "0.88rem" }}>No ingredients added yet</span>}
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
        userTier === "free" ? (
          <div className="tooltip-wrap">
            <div className="tooltip-box">Upgrade to cook from your pantry</div>
            <button className="btn btn-full btn-pantry" style={{ opacity: 0.6, cursor: "not-allowed" }} onClick={onUpgrade}>
              🧺 Cook from My Pantry ({allPantryItems.length} items) 🔒
            </button>
          </div>
        ) : (
          <button className="btn btn-full btn-pantry" onClick={() => fetchRecipes(allPantryItems)} disabled={loading}>
            {loading ? <><div className="spinner" />Finding…</> : `🧺 Cook from My Pantry (${allPantryItems.length} items)`}
          </button>
        )
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
                  <div style={{ marginTop: "16px" }}>
                    {userTier === "pro_chef" ? (
                      
                        href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(recipe.name + " Nigerian recipe how to cook")}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "8px",
                          background: "#FF0000", color: "white", padding: "8px 16px",
                          borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600,
                          textDecoration: "none", transition: "all 0.2s",
                          fontFamily: "Afacad Flux, sans-serif"
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        ▶ Watch on YouTube
                      </a>
                    ) : (
                      <button
                        onClick={onUpgrade}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "8px",
                          background: "var(--bg)", color: "var(--muted)",
                          padding: "8px 16px", borderRadius: "8px", fontSize: "0.82rem",
                          fontWeight: 600, border: "1.5px solid var(--border)",
                          cursor: "pointer", transition: "all 0.2s",
                          fontFamily: "Afacad Flux, sans-serif"
                        }}
                      >
                        🔒 Watch on YouTube — Pro Chef only
                      </button>
                    )}
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

function PantryTab({ pantry, setPantry, categories, setCategories, pantryStatus, loading, onResetup }) {
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

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted)", fontSize: "0.92rem" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>🧺</div>
      Loading your pantry…
    </div>
  );

  return (
    <>
      {showAddModal && <AddCategoryModal onClose={() => setShowAddModal(false)} onAdd={handleAddCategory} />}
      <div className="pantry-top-row">
        <div className="pantry-title">My Pantry <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span></div>
        <div className="pantry-actions">
          <button className="btn btn-secondary btn-icon" onClick={() => setShowAddModal(true)}>+ New Category</button>
          <button className="btn btn-ghost btn-icon" onClick={onResetup}>↺ Re-setup</button>
          {totalItems > 0 && <button className="btn btn-danger btn-icon" onClick={clearAll}>Clear All</button>}
          <span style={{
            fontSize: "0.78rem",
            color: pantryStatus === "saving" ? "var(--teal)" : pantryStatus === "error" ? "var(--orange)" : "var(--muted)",
            display: "flex", alignItems: "center", gap: "5px"
          }}>
            {pantryStatus === "saving" ? "⟳ Saving…" : pantryStatus === "error" ? "⚠ Save failed" : "✓ Saved"}
          </span>
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
        <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "4px" }}>Press Enter or comma to add quickly.</p>
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
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userTier, setUserTier] = useState("free");
  const [trialExpired, setTrialExpired] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [pantryLoading, setPantryLoading] = useState(true);
  const [pantryStatus, setPantryStatus] = useState("saved");
  const pantryTimerRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      sessionRef.current = session;
      setAuthLoading(false);
      if (session) {
        loadPantry(session.user.id);
        checkTrialAndTier(session);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      sessionRef.current = session;
      if (session) {
        loadPantry(session.user.id);
        checkTrialAndTier(session);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkTrialAndTier = async (session) => {
    try {
      const { data } = await supabase.from("profiles")
        .select("tier, tier_expires_at, onboarding_completed")
        .eq("id", session.user.id)
        .single();
      const tier = data?.tier || "free";
      setUserTier(tier);
      if (tier === "free") {
        const created = new Date(session.user.created_at);
        const daysUsed = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 7 - daysUsed);
        setTrialDaysLeft(daysLeft);
        setTrialExpired(daysLeft === 0);
        if (daysLeft <= 3) setShowUpgrade(true);
      }
      // Show onboarding if not completed
      if (!data?.onboarding_completed) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.log("Could not check tier");
      setShowOnboarding(true);
    }
  };

  const loadPantry = async (userId) => {
    setPantryLoading(true);
    try {
      const { data } = await supabase.from("pantry").select("*").eq("user_id", userId).single();
      if (data) {
        setCategories(data.categories || DEFAULT_CATEGORIES);
        setPantry(data.items || { proteins: [], vegetables: [], grains: [], spices: [], oils: [], others: [] });
      }
    } catch (err) {
      console.log("No pantry found, using defaults");
    } finally {
      setPantryLoading(false);
      setPantryStatus("saved");
    }
  };

  const savePantry = async (currentPantry, currentCategories) => {
    const currentSession = sessionRef.current;
    if (!currentSession) return;
    setPantryStatus("saving");
    try {
      const { error } = await supabase.from("pantry").upsert({
        user_id: currentSession.user.id,
        categories: currentCategories,
        items: currentPantry,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      setPantryStatus("saved");
    } catch (err) {
      setPantryStatus("error");
    }
  };

  const schedulePantrySave = (newPantry, newCategories) => {
    setPantryStatus("unsaved");
    if (pantryTimerRef.current) clearTimeout(pantryTimerRef.current);
    pantryTimerRef.current = setTimeout(() => savePantry(newPantry, newCategories), 2000);
  };

  const handleSetPantry = (updater) => {
    setPantry(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      schedulePantrySave(next, categories);
      return next;
    });
  };

  const handleSetCategories = (updater) => {
    setCategories(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      schedulePantrySave(pantry, next);
      return next;
    });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadPantry(session.user.id);
  };

  const totalPantryItems = Object.values(pantry).flat().length;

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf8", fontFamily: "Afacad Flux, sans-serif", color: "#4a6655", fontSize: "1rem" }}>
      Loading…
    </div>
  );

  if (verifyEmail) return <VerifyEmail email={verifyEmail} onBack={() => setVerifyEmail(null)} />;
  if (!session) return <Auth onVerify={(email) => setVerifyEmail(email)} />;
  if (showAdmin) return <Admin session={session} onBack={() => setShowAdmin(false)} />;

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <header className="header">
          <div style={{ position: "absolute", top: "20px", right: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
  {session?.user?.email === ADMIN_EMAIL && (
    <button onClick={() => setShowAdmin(true)} style={{
      background: "var(--green)", border: "none", color: "white",
      padding: "6px 12px", borderRadius: "8px", fontSize: "0.72rem",
      cursor: "pointer", fontFamily: "Afacad Flux, sans-serif", fontWeight: 600
    }}>⚙ Admin</button>
  )}
  {userTier === "free" && (
    <button onClick={() => setShowUpgrade(true)} style={{
      background: "var(--orange)", border: "none", color: "white",
      padding: "6px 14px", borderRadius: "8px", fontSize: "0.72rem",
      cursor: "pointer", fontFamily: "Afacad Flux, sans-serif", fontWeight: 600,
      transition: "all 0.2s"
    }}>⬆ Upgrade</button>
  )}
  <AvatarButton session={session} onClick={() => setShowProfile(true)} />
</div>
          <div className="header-accent">
            <span style={{ background: "#2E5339", flex: 1 }} />
            <span style={{ background: "#FF570A", flex: 1 }} />
            <span style={{ background: "#05B2DC", flex: 1 }} />
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
          <button className={`tab ${activeTab === "planner" ? "active" : ""}`} onClick={() => setActiveTab("planner")}>🗓 Planner</button>
        </div>

        {activeTab === "recipes" && (
          <RecipeTab
            pantryIngredients={pantry}
            userTier={userTier}
            onUpgrade={() => { setShowProfile(false); setTimeout(() => setShowUpgrade(true), 300); }}
          />
        )}
        {activeTab === "pantry" && (
          <PantryTab
            pantry={pantry}
            setPantry={handleSetPantry}
            categories={categories}
            setCategories={handleSetCategories}
            pantryStatus={pantryStatus}
            loading={pantryLoading}
            onResetup={() => setShowOnboarding(true)}
          />
        )}
        {activeTab === "planner" && (
          userTier === "free"
            ? (
              <div className="upgrade-lock">
                <div className="upgrade-lock-icon">🗓</div>
                <h3>Meal Planner is a paid feature</h3>
                <p>Upgrade to Commis Chef or higher to access the AI-powered meal planner.</p>
                <button className="upgrade-lock-btn" onClick={() => setShowUpgrade(true)}>View Plans</button>
              </div>
            )
            : <MealPlanner session={session} pantryIngredients={pantry} userTier={userTier} onUpgrade={() => setShowUpgrade(true)} />
        )}

        {showOnboarding && (
          <Onboarding
            session={session}
            onComplete={handleOnboardingComplete}
            onSkip={() => setShowOnboarding(false)}
          />
        )}

        {showProfile && (
  <Profile
    session={session}
    onClose={() => setShowProfile(false)}
    onSignOut={async () => { await supabase.auth.signOut(); setSession(null); setShowProfile(false); }}
    onUpgrade={() => { setShowProfile(false); setTimeout(() => setShowUpgrade(true), 300); }}
  />
)}

        {showUpgrade && (
          <UpgradeModal
            onDismiss={() => setShowUpgrade(false)}
            trialExpired={trialExpired}
            daysLeft={trialDaysLeft}
            userEmail={session?.user?.email}
          />
        )}
      </div>
    </>
  );
}
