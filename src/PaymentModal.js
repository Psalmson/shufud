import { useState } from "react";

const TIERS = [
  {
    key: "commis",
    name: "Commis Chef",
    price: "₦1,000",
    amount: 1000,
    color: "#05B2DC",
    features: ["5 recipes/day", "Meal Planner", "Pantry sync", "Save 10 favourites"]
  },
  {
    key: "sous",
    name: "Sous Chef",
    price: "₦1,500",
    amount: 1500,
    color: "#FF570A",
    badge: "Popular",
    features: ["10 recipes/day", "Meal Planner", "Pantry sync", "Save 50 favourites", "YouTube videos"]
  },
  {
    key: "head",
    name: "Head Chef",
    price: "₦2,500",
    amount: 2500,
    color: "#2E5339",
    features: ["Unlimited recipes", "Meal Planner", "Pantry sync", "Unlimited favourites", "YouTube videos"]
  }
];

const WHATSAPP_NUMBER = "2349031186357";
const ACCOUNT_NUMBER = "— coming soon —";
const ACCOUNT_NAME = "— coming soon —";
const BANK = "Moniepoint";

const paymentStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .payment-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.75); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 20px; overflow-y: auto; animation: pmFadeIn 0.2s ease; }
  @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .payment-modal { background: var(--warm-white); border-radius: 24px; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(15,31,20,0.25); animation: pmSlideUp 0.25s ease; overflow: hidden; }
  @keyframes pmSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .payment-header { padding: 24px 28px 20px; border-bottom: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .payment-header h2 { font-family: 'Spectral', serif; font-size: 1.3rem; color: var(--green); }
  .payment-close { background: var(--bg); border: 1.5px solid var(--border); border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .payment-close:hover { background: var(--orange-pale); border-color: var(--orange); color: var(--orange); }

  .payment-body { padding: 24px 28px; }

  .payment-tier-select { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .payment-tier-option { border: 2px solid var(--border); border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; gap: 12px; position: relative; }
  .payment-tier-option:hover { border-color: var(--teal); }
  .payment-tier-option.selected { border-width: 2px; background: var(--green-pale); }
  .payment-tier-option-left { display: flex; align-items: center; gap: 12px; }
  .payment-tier-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .payment-tier-name { font-family: 'Spectral', serif; font-size: 1rem; color: var(--charcoal); font-weight: 600; }
  .payment-tier-features { font-size: 0.78rem; color: var(--muted); margin-top: 2px; }
  .payment-tier-price { font-size: 1.1rem; font-weight: 700; flex-shrink: 0; }
  .payment-tier-badge { position: absolute; top: -8px; right: 12px; background: var(--orange); color: white; font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .payment-tier-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .payment-tier-radio.checked { border-color: var(--green); background: var(--green); }
  .payment-tier-radio.checked::after { content: ''; width: 6px; height: 6px; background: white; border-radius: 50%; }

  .payment-details { background: var(--green-pale); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
  .payment-details h3 { font-family: 'Spectral', serif; font-size: 1rem; color: var(--green); margin-bottom: 14px; }
  .payment-detail-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
  .payment-detail-row:last-child { margin-bottom: 0; padding-top: 10px; border-top: 1px solid var(--border); }
  .payment-detail-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; flex-shrink: 0; }
  .payment-detail-value { font-size: 0.92rem; color: var(--charcoal); font-weight: 600; text-align: right; }
  .payment-detail-value.amount { font-family: 'Spectral', serif; font-size: 1.2rem; color: var(--green); }
  .payment-copy-btn { background: var(--teal-pale); border: 1px solid var(--teal); border-radius: 6px; padding: 3px 10px; font-size: 0.72rem; color: var(--teal); cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-weight: 600; transition: all 0.2s; flex-shrink: 0; }
  .payment-copy-btn:hover { background: var(--teal); color: white; }
  .payment-copy-btn.copied { background: var(--green); border-color: var(--green); color: white; }

  .payment-note { font-size: 0.8rem; color: var(--muted); line-height: 1.6; margin-bottom: 20px; background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 10px; padding: 12px 16px; }

  .payment-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
  .payment-btn-primary { background: var(--green); color: white; }
  .payment-btn-primary:hover { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(46,83,57,0.3); }
  .payment-btn-secondary { background: transparent; border: 1.5px solid var(--border); color: var(--muted); font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; }
  .payment-btn-secondary:hover { border-color: var(--green); color: var(--green); }

  .confirm-icon { font-size: 3rem; text-align: center; margin-bottom: 12px; }
  .confirm-title { font-family: 'Spectral', serif; font-size: 1.3rem; color: var(--green); text-align: center; margin-bottom: 8px; }
  .confirm-sub { font-size: 0.88rem; color: var(--muted); text-align: center; line-height: 1.6; margin-bottom: 24px; }
  .confirm-steps { background: var(--green-pale); border: 1.5px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 20px; }
  .confirm-step { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; font-size: 0.88rem; color: var(--charcoal); line-height: 1.5; }
  .confirm-step:last-child { margin-bottom: 0; }
  .confirm-step-num { background: var(--orange); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .whatsapp-btn { width: 100%; padding: 14px; background: #25D366; color: white; border: none; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
  .whatsapp-btn:hover { background: #20bd5a; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,211,102,0.35); }
`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`payment-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function PaymentModal({ onClose, userEmail, initialTier }) {
  const [selectedTier, setSelectedTier] = useState(
    TIERS.find(t => t.key === initialTier) || TIERS[0]
  );
  const [step, setStep] = useState("select"); // select | pay | confirm

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi Shufud! I just made a payment for the *${selectedTier.name}* plan (${selectedTier.price}/month).\n\nMy registered email: *${userEmail}*\n\nPlease find my payment receipt attached.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <>
      <style>{paymentStyle}</style>
      <div className="payment-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="payment-modal">
          <div className="payment-header">
            <h2>
              {step === "select" && "Choose Your Plan"}
              {step === "pay" && "Make Payment"}
              {step === "confirm" && "Payment Submitted"}
            </h2>
            <button className="payment-close" onClick={onClose}>✕</button>
          </div>

          <div className="payment-body">

            {/* ── STEP 1: Select tier ── */}
            {step === "select" && (
              <>
                <div className="payment-tier-select">
                  {TIERS.map(tier => (
                    <div
                      key={tier.key}
                      className={`payment-tier-option ${selectedTier.key === tier.key ? "selected" : ""}`}
                      style={{ borderColor: selectedTier.key === tier.key ? tier.color : undefined }}
                      onClick={() => setSelectedTier(tier)}
                    >
                      {tier.badge && <div className="payment-tier-badge">{tier.badge}</div>}
                      <div className="payment-tier-option-left">
                        <div className={`payment-tier-radio ${selectedTier.key === tier.key ? "checked" : ""}`}
                          style={selectedTier.key === tier.key ? { borderColor: tier.color, background: tier.color } : {}} />
                        <div className="payment-tier-dot" style={{ background: tier.color }} />
                        <div>
                          <div className="payment-tier-name">{tier.name}</div>
                          <div className="payment-tier-features">{tier.features.join(" · ")}</div>
                        </div>
                      </div>
                      <div className="payment-tier-price" style={{ color: tier.color }}>{tier.price}<span style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 400 }}>/mo</span></div>
                    </div>
                  ))}
                </div>
                <button className="payment-btn payment-btn-primary" onClick={() => setStep("pay")}>
                  Continue with {selectedTier.name} →
                </button>
                <button className="payment-btn payment-btn-secondary" onClick={onClose}>Cancel</button>
              </>
            )}

            {/* ── STEP 2: Pay ── */}
            {step === "pay" && (
              <>
                <div className="payment-details">
                  <h3>💳 Transfer to this account</h3>
                  <div className="payment-detail-row">
                    <span className="payment-detail-label">Bank</span>
                    <span className="payment-detail-value">{BANK}</span>
                  </div>
                  <div className="payment-detail-row">
                    <span className="payment-detail-label">Account Name</span>
                    <span className="payment-detail-value">{ACCOUNT_NAME}</span>
                  </div>
                  <div className="payment-detail-row">
                    <span className="payment-detail-label">Account Number</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="payment-detail-value">{ACCOUNT_NUMBER}</span>
                      <CopyButton value={ACCOUNT_NUMBER} />
                    </div>
                  </div>
                  <div className="payment-detail-row">
                    <span className="payment-detail-label">Amount</span>
                    <span className="payment-detail-value amount">{selectedTier.price}</span>
                  </div>
                </div>

                <div className="payment-note">
                  ⚠ Use your <strong>registered email</strong> ({userEmail}) as the transfer narration/description so we can identify your payment quickly.
                </div>

                <button className="payment-btn payment-btn-primary" onClick={() => setStep("confirm")}>
                  ✓ I Have Paid
                </button>
                <button className="payment-btn payment-btn-secondary" onClick={() => setStep("select")}>
                  ← Change Plan
                </button>
              </>
            )}

            {/* ── STEP 3: Confirm ── */}
            {step === "confirm" && (
              <>
                <div className="confirm-icon">🎉</div>
                <div className="confirm-title">Almost there!</div>
                <div className="confirm-sub">
                  Send us your payment receipt on WhatsApp so we can activate your <strong>{selectedTier.name}</strong> plan as quickly as possible.
                </div>
                <div className="confirm-steps">
                  <div className="confirm-step">
                    <div className="confirm-step-num">1</div>
                    <span>Click the button below to open WhatsApp — your message is pre-filled.</span>
                  </div>
                  <div className="confirm-step">
                    <div className="confirm-step-num">2</div>
                    <span>Attach your payment screenshot or receipt to the message.</span>
                  </div>
                  <div className="confirm-step">
                    <div className="confirm-step-num">3</div>
                    <span>Send it! We'll activate your plan within a few hours.</span>
                  </div>
                </div>
                <button className="whatsapp-btn" onClick={handleWhatsApp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Send Receipt on WhatsApp
                </button>
                <button className="payment-btn payment-btn-secondary" onClick={onClose}>
                  Done — I'll send it later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
