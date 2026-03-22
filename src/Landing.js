const landingStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp { font-family: 'Afacad Flux', sans-serif; font-size: 18px; background: #ffffff; color: #0f1f14; min-height: 100vh; }

  /* ── Nav ── */
  .lp-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; border-bottom: 1.5px solid #d4e2d8; background: white; position: sticky; top: 0; z-index: 100; }
  .lp-logo { font-family: 'Spectral', serif; font-size: 1.5rem; color: #2E5339; letter-spacing: -0.5px; }
  .lp-logo em { color: #FF570A; font-style: italic; }
  .lp-nav-actions { display: flex; gap: 10px; align-items: center; }
  .lp-signin-btn { background: transparent; border: 1.5px solid #d4e2d8; color: #4a6655; padding: 8px 20px; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .lp-signin-btn:hover { border-color: #2E5339; color: #2E5339; }
  .lp-nav-cta { background: #FF570A; color: white; border: none; padding: 8px 20px; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; font-weight: 600; }
  .lp-nav-cta:hover { background: #ff7033; transform: translateY(-1px); }

  /* ── Hero ── */
  .lp-hero { padding: 80px 40px 60px; text-align: center; max-width: 800px; margin: 0 auto; }
  .lp-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: #f0f5f1; border: 1.5px solid #d4e2d8; border-radius: 20px; padding: 6px 16px; font-size: 0.78rem; color: #2E5339; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 28px; }
  .lp-hero h1 { font-family: 'Spectral', serif; font-size: clamp(2.4rem, 6vw, 4rem); color: #2E5339; line-height: 1.15; letter-spacing: -1px; margin-bottom: 20px; }
  .lp-hero h1 em { color: #FF570A; font-style: italic; }
  .lp-hero p { font-size: 1.1rem; color: #4a6655; line-height: 1.7; max-width: 560px; margin: 0 auto 36px; }
  .lp-hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }
  .lp-hero-cta { background: #FF570A; color: white; border: none; padding: 14px 32px; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
  .lp-hero-cta:hover { background: #ff7033; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,87,10,0.35); }
  .lp-hero-secondary { background: transparent; border: 1.5px solid #d4e2d8; color: #4a6655; padding: 14px 32px; border-radius: 12px; font-family: 'Afacad Flux', sans-serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .lp-hero-secondary:hover { border-color: #2E5339; color: #2E5339; }
  .lp-hero-trial { font-size: 0.8rem; color: #9ab5a2; }
  .lp-dishes { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
  .lp-dish-tag { font-size: 0.75rem; padding: 6px 14px; border-radius: 20px; font-weight: 500; letter-spacing: 0.03em; }
  .lp-dish-tag-1 { background: #2E5339; color: white; }
  .lp-dish-tag-2 { background: #FF570A; color: white; }
  .lp-dish-tag-3 { background: #05B2DC; color: white; }
  .lp-dish-tag-4 { background: #f0f5f1; color: #2E5339; border: 1.5px solid #d4e2d8; }

  /* ── Section ── */
  .lp-section { padding: 80px 40px; max-width: 1000px; margin: 0 auto; }
  .lp-section-label { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: #05B2DC; font-weight: 600; margin-bottom: 12px; }
  .lp-section-title { font-family: 'Spectral', serif; font-size: clamp(1.6rem, 4vw, 2.2rem); color: #2E5339; margin-bottom: 16px; line-height: 1.3; }
  .lp-section-sub { font-size: 1rem; color: #4a6655; line-height: 1.7; max-width: 560px; }
  .lp-divider { height: 1.5px; background: linear-gradient(to right, #d4e2d8, transparent); margin: 0 40px; }

  /* ── How it works ── */
  .lp-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 48px; }
  .lp-step { background: #f8faf8; border: 1.5px solid #d4e2d8; border-radius: 18px; padding: 28px 24px; transition: all 0.2s; }
  .lp-step:hover { box-shadow: 0 6px 24px rgba(46,83,57,0.10); transform: translateY(-2px); }
  .lp-step-num { width: 36px; height: 36px; border-radius: 50%; background: #FF570A; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px; }
  .lp-step-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .lp-step h3 { font-family: 'Spectral', serif; font-size: 1.1rem; color: #0f1f14; margin-bottom: 8px; }
  .lp-step p { font-size: 0.88rem; color: #4a6655; line-height: 1.65; }

  /* ── Features ── */
  .lp-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 48px; }
  .lp-feature { background: white; border: 1.5px solid #d4e2d8; border-radius: 16px; padding: 24px 20px; transition: all 0.2s; }
  .lp-feature:hover { border-color: #2E5339; box-shadow: 0 4px 16px rgba(46,83,57,0.08); }
  .lp-feature-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .lp-feature h3 { font-family: 'Spectral', serif; font-size: 1rem; color: #0f1f14; margin-bottom: 6px; }
  .lp-feature p { font-size: 0.82rem; color: #4a6655; line-height: 1.6; }
  .lp-feature-badge { display: inline-block; font-size: 0.62rem; padding: 2px 8px; border-radius: 8px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 10px; }
  .lp-feature-badge-pro { background: #fff3ee; color: #FF570A; border: 1px solid #ffcfb8; }
  .lp-feature-badge-smart { background: #edfaff; color: #037a97; border: 1px solid #b8eaf5; }

  /* ── Pricing ── */
  .lp-pricing-wrap { background: #f8faf8; padding: 80px 40px; }
  .lp-pricing { max-width: 900px; margin: 0 auto; }
  .lp-pricing-header { text-align: center; margin-bottom: 48px; }
  .lp-pricing-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
  .lp-pricing-card { background: white; border: 2px solid #d4e2d8; border-radius: 20px; padding: 28px 24px; transition: all 0.2s; position: relative; }
  .lp-pricing-card:hover { box-shadow: 0 8px 32px rgba(46,83,57,0.12); transform: translateY(-2px); }
  .lp-pricing-card.featured { border-color: #FF570A; }
  .lp-pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #FF570A; color: white; font-size: 0.65rem; padding: 4px 14px; border-radius: 20px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  .lp-pricing-name { font-family: 'Spectral', serif; font-size: 1.1rem; color: #0f1f14; margin-bottom: 4px; }
  .lp-pricing-price { font-size: 1.8rem; font-weight: 700; color: #2E5339; margin-bottom: 2px; line-height: 1; }
  .lp-pricing-price span { font-size: 0.78rem; color: #4a6655; font-weight: 400; }
  .lp-pricing-desc { font-size: 0.82rem; color: #4a6655; margin: 12px 0 20px; line-height: 1.5; }
  .lp-pricing-features { list-style: none; margin-bottom: 24px; }
  .lp-pricing-features li { font-size: 0.85rem; color: #4a6655; padding: 5px 0; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
  .lp-pricing-features li::before { content: '✓'; color: #2E5339; font-weight: 700; flex-shrink: 0; }
  .lp-pricing-features li.locked { color: #c5d9cd; }
  .lp-pricing-features li.locked::before { content: '✕'; color: #d4e2d8; }
  .lp-pricing-cta { width: 100%; padding: 12px; border: none; border-radius: 10px; font-family: 'Spectral', serif; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
  .lp-pricing-cta-primary { background: #FF570A; color: white; }
  .lp-pricing-cta-primary:hover { background: #ff7033; transform: translateY(-1px); }
  .lp-pricing-cta-secondary { background: #f0f5f1; color: #2E5339; }
  .lp-pricing-cta-secondary:hover { background: #2E5339; color: white; }
  .lp-pricing-cta-outline { background: transparent; border: 1.5px solid #d4e2d8; color: #4a6655; }
  .lp-pricing-cta-outline:hover { border-color: #2E5339; color: #2E5339; }

  /* ── Nigerian section ── */
  .lp-nigerian { background: #2E5339; padding: 80px 40px; text-align: center; }
  .lp-nigerian h2 { font-family: 'Spectral', serif; font-size: clamp(1.6rem, 4vw, 2.2rem); color: white; margin-bottom: 16px; }
  .lp-nigerian p { font-size: 1rem; color: rgba(255,255,255,0.75); line-height: 1.7; max-width: 520px; margin: 0 auto 36px; }
  .lp-nigerian-dishes { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 40px; }
  .lp-nigerian-dish { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 500; }
  .lp-nigerian-cta { background: #FF570A; color: white; border: none; padding: 14px 36px; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1.05rem; cursor: pointer; transition: all 0.2s; }
  .lp-nigerian-cta:hover { background: #ff7033; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,87,10,0.4); }

  /* ── Footer ── */
  .lp-footer { background: #0f1f14; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .lp-footer-logo { font-family: 'Spectral', serif; font-size: 1.2rem; color: white; }
  .lp-footer-logo em { color: #FF570A; font-style: italic; }
  .lp-footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
  .lp-footer-tagline { font-size: 0.78rem; color: rgba(255,255,255,0.5); }

  @media (max-width: 600px) {
    .lp-nav { padding: 14px 20px; }
    .lp-hero { padding: 48px 20px 40px; }
    .lp-section { padding: 48px 20px; }
    .lp-divider { margin: 0 20px; }
    .lp-pricing-wrap { padding: 48px 20px; }
    .lp-nigerian { padding: 48px 20px; }
    .lp-footer { padding: 24px 20px; flex-direction: column; text-align: center; }
  }
`;

export default function Landing({ onGetStarted, onSignIn }) {
  return (
    <>
      <style>{landingStyle}</style>
      <div className="lp">

        {/* ── Nav ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
  <img src="/logo-light.svg" alt="Shufud" style={{ height: "36px", width: "auto" }} />
</div>
          <div className="lp-nav-actions">
            <button className="lp-signin-btn" onClick={onSignIn}>Sign In</button>
            <button className="lp-nav-cta" onClick={onGetStarted}>Get Started Free</button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="lp-hero-badge">
            🇳🇬 Nigerian & African Cuisine Featured
          </div>
          <h1>Tell me what you have.<br /><em>I'll tell you what to cook.</em></h1>
          <p>
            Shufud turns your available ingredients into delicious Nigerian and African recipes — powered by AI, rooted in culture.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-hero-cta" onClick={onGetStarted}>✦ Start Cooking Free</button>
            <button className="lp-hero-secondary" onClick={onSignIn}>Sign In</button>
          </div>
          <p className="lp-hero-trial">Free 7-day trial · No credit card required</p>
          <div className="lp-dishes" style={{ marginTop: "32px" }}>
            {[
              ["🍛 Jollof Rice", "lp-dish-tag-1"],
              ["🥘 Egusi Soup", "lp-dish-tag-2"],
              ["🌶 Pepper Soup", "lp-dish-tag-3"],
              ["🍌 Fried Plantain", "lp-dish-tag-4"],
              ["🫕 Efo Riro", "lp-dish-tag-1"],
              ["🥟 Moi Moi", "lp-dish-tag-2"],
              ["🍢 Suya", "lp-dish-tag-3"],
              ["🫓 Puff Puff", "lp-dish-tag-4"],
            ].map(([tag, cls]) => (
              <span key={tag} className={`lp-dish-tag ${cls}`}>{tag}</span>
            ))}
          </div>
        </section>

        <div className="lp-divider" />

        {/* ── How it works ── */}
        <section className="lp-section">
          <div className="lp-section-label">How it works</div>
          <div className="lp-section-title">Three steps to your next meal</div>
          <p className="lp-section-sub">No complicated setup. Just tell Shufud what's in your kitchen.</p>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <div className="lp-step-icon">🧺</div>
              <h3>Add your ingredients</h3>
              <p>Tell Shufud what you have at home — or set up your pantry once and it remembers everything.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <div className="lp-step-icon">✦</div>
              <h3>Get recipe suggestions</h3>
              <p>Shufud instantly suggests 2 recipes tailored to your ingredients, with Nigerian dishes always featured.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <div className="lp-step-icon">🍳</div>
              <h3>Start cooking</h3>
              <p>Follow the step-by-step instructions and cook a delicious meal with what you already have.</p>
            </div>
          </div>
        </section>

        <div className="lp-divider" />

        {/* ── Features ── */}
        <section className="lp-section">
          <div className="lp-section-label">Features</div>
          <div className="lp-section-title">Everything you need to cook smarter</div>
          <p className="lp-section-sub">From your pantry to your plate — Shufud has you covered.</p>
          <div className="lp-features">
            <div className="lp-feature">
              <div className="lp-feature-icon">🧺</div>
              <h3>Smart Pantry</h3>
              <p>Store all your ingredients by category. Shufud syncs your pantry across devices so you're always ready.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🗓</div>
              <h3>Meal Planner</h3>
              <p>Plan your entire week with a beautiful calendar view. Let AI fill it for you in one click.</p>
              <span className="lp-feature-badge lp-feature-badge-smart">Smart Cook+</span>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">📜</div>
              <h3>Recipe History</h3>
              <p>Never lose a great recipe. Your history is saved and searchable so you can revisit favourites.</p>
              <span className="lp-feature-badge lp-feature-badge-smart">Smart Cook+</span>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">▶</div>
              <h3>YouTube Guides</h3>
              <p>Watch how it's done. Every recipe links to relevant YouTube cooking tutorials.</p>
              <span className="lp-feature-badge lp-feature-badge-pro">Pro Chef</span>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">⬇</div>
              <h3>Download Meal Plan</h3>
              <p>Export your weekly meal plan as a PDF — perfect for printing or sharing.</p>
              <span className="lp-feature-badge lp-feature-badge-pro">Pro Chef</span>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🤖</div>
              <h3>Telegram Bot</h3>
              <p>Get recipe suggestions on the go via Telegram — your tier and limits apply seamlessly.</p>
              <span style={{ display: "inline-block", fontSize: "0.62rem", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "10px", background: "#f0f5f1", color: "#2E5339", border: "1px solid #d4e2d8" }}>Coming Soon</span>
            </div>
          </div>
        </section>

        <div className="lp-divider" />

        {/* ── Nigerian section ── */}
        <div className="lp-nigerian">
          <h2>🇳🇬 Built for Nigerian kitchens</h2>
          <p>
            Shufud was built with Nigerian and African cuisine at its core. Every suggestion celebrates the rich flavours of our culture.
          </p>
          <div className="lp-nigerian-dishes">
            {["Jollof Rice", "Egusi Soup", "Pepper Soup", "Efo Riro", "Banga Soup",
              "Moi Moi", "Suya", "Akara", "Puff Puff", "Oha Soup", "Ogbono Soup", "Eba"].map(dish => (
              <span key={dish} className="lp-nigerian-dish">{dish}</span>
            ))}
          </div>
          <button className="lp-nigerian-cta" onClick={onGetStarted}>
            Start Cooking Free →
          </button>
        </div>

        {/* ── Pricing ── */}
        <div className="lp-pricing-wrap">
          <div className="lp-pricing">
            <div className="lp-pricing-header">
              <div className="lp-section-label" style={{ justifyContent: "center", display: "flex" }}>Pricing</div>
              <div className="lp-section-title" style={{ textAlign: "center" }}>Simple, honest pricing</div>
              <p style={{ color: "#4a6655", fontSize: "0.95rem", textAlign: "center" }}>Start free for 7 days. No credit card required.</p>
            </div>
            <div className="lp-pricing-cards">

              {/* Free */}
              <div className="lp-pricing-card">
                <div className="lp-pricing-name">Free Trial</div>
                <div className="lp-pricing-price">₦0 <span>/ 7 days</span></div>
                <div className="lp-pricing-desc">Try everything for free. No commitment.</div>
                <ul className="lp-pricing-features">
                  <li>2 recipe suggestions/day</li>
                  <li>Pantry setup & sync</li>
                  <li>Smart onboarding</li>
                  <li className="locked">Meal Planner</li>
                  <li className="locked">Recipe History</li>
                  <li className="locked">YouTube guides</li>
                </ul>
                <button className="lp-pricing-cta lp-pricing-cta-outline" onClick={onGetStarted}>
                  Start Free Trial
                </button>
              </div>

              {/* Smart Cook */}
              <div className="lp-pricing-card">
                <div className="lp-pricing-name">Smart Cook</div>
                <div className="lp-pricing-price">₦1,000 <span>/ month</span></div>
                <div className="lp-pricing-desc">For home cooks who want more.</div>
                <ul className="lp-pricing-features">
                  <li>5 recipe suggestions/day</li>
                  <li>Pantry sync across devices</li>
                  <li>Meal Planner + Auto Generate</li>
                  <li>Recipe history (7 days)</li>
                  <li>Save up to 10 favourites</li>
                  <li className="locked">YouTube guides</li>
                </ul>
                <button className="lp-pricing-cta lp-pricing-cta-secondary" onClick={onGetStarted}>
                  Get Smart Cook
                </button>
              </div>

              {/* Pro Chef */}
              <div className="lp-pricing-card featured">
                <div className="lp-pricing-badge">Best Value</div>
                <div className="lp-pricing-name">Pro Chef</div>
                <div className="lp-pricing-price">₦1,500 <span>/ month</span></div>
                <div className="lp-pricing-desc">Unlimited cooking, unlimited possibilities.</div>
                <ul className="lp-pricing-features">
                  <li>Unlimited recipe suggestions</li>
                  <li>Pantry sync across devices</li>
                  <li>Meal Planner + Auto Generate</li>
                  <li>Recipe history forever</li>
                  <li>Unlimited saved favourites</li>
                  <li>▶ YouTube video guides</li>
                  <li>⬇ Download Meal Plan PDF</li>
                </ul>
                <button className="lp-pricing-cta lp-pricing-cta-primary" onClick={onGetStarted}>
                  Get Pro Chef
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">
  <img src="/logo-dark.svg" alt="Shufud" style={{ height: "28px", width: "auto" }} />
</div>
          <div className="lp-footer-tagline">Tell me what you have · I'll tell you what to cook</div>
          <div className="lp-footer-copy">© {new Date().getFullYear()} Shufud. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}
