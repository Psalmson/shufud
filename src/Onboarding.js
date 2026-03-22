import { useState } from "react";
import { supabase } from "./supabaseClient";

const onboardingStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .onboarding-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.75); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 20px; animation: obFadeIn 0.2s ease; }
  @keyframes obFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .onboarding-modal { background: var(--warm-white); border-radius: 24px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(15,31,20,0.25); animation: obSlideUp 0.25s ease; overflow: hidden; max-height: 90vh; overflow-y: auto; }
  @keyframes obSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .onboarding-header { background: var(--green); padding: 28px 32px 24px; text-align: center; }
  .onboarding-logo { font-family: 'Spectral', serif; font-size: 2rem; color: white; line-height: 1; margin-bottom: 8px; }
  .onboarding-logo em { color: #FF570A; font-style: italic; }
  .onboarding-header h2 { font-family: 'Spectral', serif; color: white; font-size: 1.3rem; margin-bottom: 6px; }
  .onboarding-header p { color: rgba(255,255,255,0.8); font-size: 0.88rem; line-height: 1.5; }

  .onboarding-body { padding: 28px 32px 32px; }

  .onboarding-step { margin-bottom: 24px; }
  .onboarding-step-label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 10px; display: block; }

  .onboarding-textarea { width: 100%; padding: 14px 16px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 0.95rem; color: var(--charcoal); outline: none; resize: none; height: 120px; transition: border-color 0.2s, box-shadow 0.2s; line-height: 1.6; }
  .onboarding-textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(5,178,220,0.12); }
  .onboarding-textarea::placeholder { color: #9ab5a2; }

  .onboarding-examples { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .onboarding-example { background: var(--green-pale); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 0.75rem; color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .onboarding-example:hover { background: var(--teal-pale); border-color: var(--teal); color: var(--teal); }

  .onboarding-classified { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
  .onboarding-category { background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; }
  .onboarding-category-header { padding: 10px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); }
  .onboarding-category-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .onboarding-category-name { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--charcoal); font-weight: 600; }
  .onboarding-category-count { font-size: 0.68rem; color: var(--muted); background: var(--warm-white); border: 1px solid var(--border); padding: 1px 8px; border-radius: 10px; margin-left: auto; }
  .onboarding-category-items { padding: 10px 16px; display: flex; flex-wrap: wrap; gap: 6px; }
  .onboarding-item { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 20px; padding: 4px 10px 4px 12px; font-size: 0.82rem; color: var(--charcoal); display: flex; align-items: center; gap: 6px; }
  .onboarding-item-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 0.9rem; padding: 0; line-height: 1; transition: color 0.15s; }
  .onboarding-item-remove:hover { color: var(--orange); }

  .onboarding-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; letter-spacing: 0.02em; }
  .onboarding-btn-primary { background: var(--orange); color: white; }
  .onboarding-btn-primary:hover:not(:disabled) { background: var(--orange-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,87,10,0.35); }
  .onboarding-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .onboarding-btn-green { background: var(--green); color: white; }
  .onboarding-btn-green:hover:not(:disabled) { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(46,83,57,0.3); }
  .onboarding-btn-green:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .onboarding-btn-ghost { background: transparent; border: 1.5px solid var(--border); color: var(--muted); font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; }
  .onboarding-btn-ghost:hover { border-color: var(--muted); color: var(--charcoal); }

  .onboarding-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: obSpin 0.8s linear infinite; }
  @keyframes obSpin { to { transform: rotate(360deg); } }

  .onboarding-error { background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 10px; padding: 12px 16px; color: var(--orange); font-size: 0.85rem; margin-bottom: 16px; }
  .onboarding-success { text-align: center; padding: 20px 0; }
  .onboarding-success-icon { font-size: 3rem; margin-bottom: 12px; }
  .onboarding-success h3 { font-family: 'Spectral', serif; font-size: 1.3rem; color: var(--green); margin-bottom: 8px; }
  .onboarding-success p { font-size: 0.88rem; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }
  .onboarding-progress { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
  .onboarding-progress-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: background 0.2s; }
  .onboarding-progress-dot.active { background: var(--orange); }
`;

const EXAMPLE_INGREDIENTS = [
  "tomatoes, onions, palm oil",
  "chicken, beef, stockfish",
  "egusi, crayfish, iru",
  "rice, beans, yam",
  "ugwu, waterleaf, spinach",
  "pepper, ginger, garlic"
];

const DEFAULT_CATEGORIES = [
  { key: "proteins",   label: "Proteins",            emoji: "🥩", color: "#FF570A" },
  { key: "vegetables", label: "Vegetables & Leaves", emoji: "🥬", color: "#2E5339" },
  { key: "grains",     label: "Grains & Carbs",      emoji: "🌾", color: "#05B2DC" },
  { key: "spices",     label: "Spices & Seasonings", emoji: "🌶", color: "#FF570A" },
  { key: "oils",       label: "Oils & Fats",         emoji: "🫙", color: "#2E5339" },
  { key: "others",     label: "Others",              emoji: "🧺", color: "#05B2DC" },
];

export default function Onboarding({ session, onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [classified, setClassified] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleClassify = async () => {
    setError("");
    const raw = input.trim();
    if (!raw) { setError("Please enter at least one ingredient."); return; }
    const ingredients = raw.split(/[,\n]+/).map(i => i.trim().toLowerCase()).filter(Boolean);
    if (ingredients.length === 0) { setError("No valid ingredients found."); return; }
    setClassifying(true);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const token = s?.access_token;
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ingredients, categories: DEFAULT_CATEGORIES })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Classification failed");
      setClassified(data.classified || {});
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally { setClassifying(false); }
  };

  const removeItem = (catKey, item) => {
    setClassified(prev => ({
      ...prev,
      [catKey]: (prev[catKey] || []).filter(i => i !== item)
    }));
  };

  const getTotalItems = () => Object.values(classified || {}).flat().length;

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const { data: { session: s } } = await supabase.auth.getSession();

      // Build pantry items object
      const items = {};
      DEFAULT_CATEGORIES.forEach(cat => {
        items[cat.key] = classified[cat.key] || [];
      });

      // Save pantry
      await supabase.from("pantry").upsert({
        user_id: s.user.id,
        categories: DEFAULT_CATEGORIES,
        items,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

      // Mark onboarding complete
      await supabase.from("profiles").upsert({
        id: s.user.id,
        onboarding_completed: true
      });

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const handleSkip = async () => {
    try {
      await supabase.from("profiles").upsert({
        id: session.user.id,
        onboarding_completed: true
      });
    } catch (err) { console.log("Skip error", err); }
    onSkip();
  };

  const addExample = (example) => {
    setInput(prev => prev ? `${prev}, ${example}` : example);
  };

  return (
    <>
      <style>{onboardingStyle}</style>
      <div className="onboarding-overlay">
        <div className="onboarding-modal">
          <div className="onboarding-header">
            <div className="onboarding-logo">
            <img src="/logo-dark.svg" alt="Shufud" style={{ height: "32px", width: "auto" }} />
          </div>
            <h2>
              {step === 1 && "Welcome! Let's set up your pantry 🧺"}
              {step === 2 && "Here's what we found 🎉"}
              {step === 3 && "Your pantry is ready! 🍳"}
            </h2>
            <p>
              {step === 1 && "Tell us what ingredients you have at home and we'll sort them automatically."}
              {step === 2 && "Review and remove anything that doesn't look right."}
              {step === 3 && "Start exploring recipes based on what you have."}
            </p>
          </div>

          <div className="onboarding-body">
            <div className="onboarding-progress">
              {[1, 2, 3].map(n => (
                <div key={n} className={`onboarding-progress-dot ${step >= n ? "active" : ""}`} />
              ))}
            </div>

            {error && <div className="onboarding-error">⚠ {error}</div>}

            {/* ── Step 1: Input ── */}
            {step === 1 && (
              <>
                <div className="onboarding-step">
                  <span className="onboarding-step-label">What's in your kitchen?</span>
                  <textarea
                    className="onboarding-textarea"
                    placeholder="e.g. tomatoes, palm oil, chicken, onions, egusi, crayfish, rice, stockfish, ugwu, pepper..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "6px" }}>
                    Separate ingredients with commas or new lines
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "8px" }}>
                    Quick add examples
                  </div>
                  <div className="onboarding-examples">
                    {EXAMPLE_INGREDIENTS.map(ex => (
                      <span key={ex} className="onboarding-example" onClick={() => addExample(ex)}>
                        + {ex}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="onboarding-btn onboarding-btn-primary" onClick={handleClassify} disabled={classifying || !input.trim()}>
                  {classifying ? <><div className="onboarding-spinner" /> Classifying ingredients…</> : "✦ Sort My Ingredients"}
                </button>
                <button className="onboarding-btn onboarding-btn-ghost" onClick={handleSkip}>
                  Skip for now — I'll do this later
                </button>
              </>
            )}

            {/* ── Step 2: Review ── */}
            {step === 2 && classified && (
              <>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "16px" }}>
                  We found <strong style={{ color: "var(--green)" }}>{getTotalItems()} ingredients</strong> across {DEFAULT_CATEGORIES.length} categories. Remove anything that doesn't look right.
                </div>
                <div className="onboarding-classified">
                  {DEFAULT_CATEGORIES.map(cat => {
                    const items = classified[cat.key] || [];
                    if (items.length === 0) return null;
                    return (
                      <div className="onboarding-category" key={cat.key}>
                        <div className="onboarding-category-header">
                          <div className="onboarding-category-dot" style={{ background: cat.color }} />
                          <span style={{ fontSize: "1rem" }}>{cat.emoji}</span>
                          <span className="onboarding-category-name">{cat.label}</span>
                          <span className="onboarding-category-count">{items.length}</span>
                        </div>
                        <div className="onboarding-category-items">
                          {items.map(item => (
                            <span key={item} className="onboarding-item">
                              {item}
                              <button className="onboarding-item-remove" onClick={() => removeItem(cat.key, item)}>×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="onboarding-btn onboarding-btn-green" onClick={handleSave} disabled={saving || getTotalItems() === 0}>
                  {saving ? <><div className="onboarding-spinner" /> Saving pantry…</> : `✓ Save ${getTotalItems()} Items to My Pantry`}
                </button>
                <button className="onboarding-btn onboarding-btn-ghost" onClick={() => { setStep(1); setClassified(null); }}>
                  ← Edit Ingredients
                </button>
              </>
            )}

            {/* ── Step 3: Success ── */}
            {step === 3 && (
              <div className="onboarding-success">
                <div className="onboarding-success-icon">🎉</div>
                <h3>Your pantry is all set!</h3>
                <p>
                  We've sorted your ingredients into categories. Head to the <strong>Recipes</strong> tab and tap <strong>"Cook from My Pantry"</strong> to get started.
                </p>
                <button className="onboarding-btn onboarding-btn-primary" onClick={onComplete}>
                  Let's Cook! →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
