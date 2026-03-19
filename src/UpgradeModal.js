const TIERS = [
  {
    key: "commis",
    name: "Commis Chef",
    price: "₦1,000",
    period: "/month",
    color: "#05B2DC",
    features: [
      "5 recipe suggestions/day",
      "Meal Planner + Auto Generate",
      "Save up to 10 favourites",
      "Recipe history (7 days)",
      "Pantry sync across devices",
    ]
  },
  {
    key: "sous",
    name: "Sous Chef",
    price: "₦1,500",
    period: "/month",
    color: "#FF570A",
    badge: "Popular",
    features: [
      "10 recipe suggestions/day",
      "Meal Planner + Auto Generate",
      "Save up to 50 favourites",
      "Recipe history (30 days)",
      "Pantry sync across devices",
      "YouTube video suggestions",
    ]
  },
  {
    key: "head",
    name: "Head Chef",
    price: "₦2,500",
    period: "/month",
    color: "#2E5339",
    features: [
      "Unlimited recipe suggestions",
      "Meal Planner + Auto Generate",
      "Unlimited saved favourites",
      "Recipe history forever",
      "Pantry sync across devices",
      "YouTube video suggestions",
    ]
  }
];

const upgradeStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .upgrade-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.7); display: flex; align-items: center; justify-content: center; z-index: 300; animation: upgradeFadeIn 0.2s ease; padding: 20px; overflow-y: auto; }
  @keyframes upgradeFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .upgrade-modal { background: var(--warm-white); border-radius: 24px; width: 100%; max-width: 680px; box-shadow: 0 20px 60px rgba(15,31,20,0.25); animation: upgradeSlideUp 0.25s ease; overflow: hidden; }
  @keyframes upgradeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .upgrade-header { background: var(--green); padding: 28px 32px 24px; text-align: center; position: relative; }
  .upgrade-header h2 { font-family: 'Spectral', serif; color: white; font-size: 1.6rem; margin-bottom: 8px; }
  .upgrade-header p { color: rgba(255,255,255,0.8); font-size: 0.92rem; line-height: 1.5; }
  .upgrade-dismiss { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .upgrade-dismiss:hover { background: rgba(255,255,255,0.25); }
  .upgrade-body { padding: 24px 28px 32px; }
  .upgrade-tiers { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .upgrade-tier { border: 2px solid var(--border); border-radius: 16px; padding: 20px 16px; text-align: center; transition: all 0.2s; position: relative; }
  .upgrade-tier:hover { box-shadow: 0 6px 24px rgba(46,83,57,0.12); transform: translateY(-2px); }
  .upgrade-tier-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--orange); color: white; font-size: 0.62rem; padding: 3px 12px; border-radius: 20px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  .upgrade-tier-name { font-family: 'Spectral', serif; font-size: 1rem; color: var(--charcoal); margin-bottom: 4px; font-weight: 600; }
  .upgrade-tier-price { font-size: 1.4rem; font-weight: 700; margin-bottom: 2px; }
  .upgrade-tier-period { font-size: 0.75rem; color: var(--muted); margin-bottom: 14px; }
  .upgrade-tier-features { list-style: none; text-align: left; margin-bottom: 16px; }
  .upgrade-tier-features li { font-size: 0.8rem; color: var(--muted); padding: 3px 0; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; }
  .upgrade-tier-features li::before { content: '✓'; color: var(--green); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .upgrade-contact { text-align: center; background: var(--green-pale); border: 1.5px solid var(--border); border-radius: 12px; padding: 16px 20px; }
  .upgrade-contact p { font-size: 0.88rem; color: var(--muted); margin-bottom: 8px; line-height: 1.5; }
  .upgrade-contact strong { color: var(--green); }
  .upgrade-contact a { color: var(--orange); font-weight: 600; text-decoration: none; }
  .upgrade-contact a:hover { text-decoration: underline; }
  .upgrade-trial-info { text-align: center; margin-bottom: 20px; }
  .upgrade-trial-info p { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
  .upgrade-trial-info strong { color: var(--orange); }
`;

export default function UpgradeModal({ onDismiss, trialExpired, daysLeft }) {
  return (
    <>
      <style>{upgradeStyle}</style>
      <div className="upgrade-overlay">
        <div className="upgrade-modal">
          <div className="upgrade-header">
            <button className="upgrade-dismiss" onClick={onDismiss}>✕</button>
            <h2>
              {trialExpired ? "Your free trial has ended 🍳" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left on your trial`}
            </h2>
            <p>
              {trialExpired
                ? "Upgrade to keep cooking with Shufud. Choose a plan that works for you."
                : "Enjoying Shufud? Upgrade before your trial ends to keep all your features."}
            </p>
          </div>
          <div className="upgrade-body">
            {!trialExpired && (
              <div className="upgrade-trial-info">
                <p>Your free trial expires in <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}</strong>. After that you'll need a paid plan to continue using Shufud.</p>
              </div>
            )}
            <div className="upgrade-tiers">
              {TIERS.map(tier => (
                <div className="upgrade-tier" key={tier.key} style={{ borderColor: tier.color + "40" }}>
                  {tier.badge && <div className="upgrade-tier-badge">{tier.badge}</div>}
                  <div className="upgrade-tier-name">{tier.name}</div>
                  <div className="upgrade-tier-price" style={{ color: tier.color }}>{tier.price}</div>
                  <div className="upgrade-tier-period">{tier.period}</div>
                  <ul className="upgrade-tier-features">
                    {tier.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="upgrade-contact">
              <p>To upgrade, send a message to <strong>Shufud Support</strong> with your registered email and chosen plan.</p>
              <p style={{ marginTop: "8px" }}>
                📧 <a href="mailto:support@thord.co">support@thord.co</a> &nbsp;|&nbsp;
                💬 <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">WhatsApp Us</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
