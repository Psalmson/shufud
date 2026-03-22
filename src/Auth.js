import { useState } from "react";
import { supabase } from "./supabaseClient";

const ALLOWED_DOMAINS = ["gmail.com", "yahoo.com", "yahoo.co.uk"];

const isAllowedEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #2E5339; --green-light: #3a6647; --green-pale: #f0f5f1;
    --orange: #FF570A; --orange-light: #ff7033; --orange-pale: #fff3ee;
    --teal: #05B2DC; --teal-light: #29c4e8; --teal-pale: #edfaff;
    --bg: #f8faf8; --warm-white: #ffffff; --charcoal: #0f1f14;
    --muted: #4a6655; --border: #d4e2d8; --card-shadow: 0 4px 24px rgba(46,83,57,0.10);
  }
  body { font-family: 'Afacad Flux', sans-serif; font-size: 18px; background: var(--bg); color: var(--charcoal); min-height: 100vh; }

  .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
  .auth-box { background: var(--warm-white); border: 1.5px solid var(--border); border-radius: 24px; padding: 40px; width: 100%; max-width: 420px; box-shadow: var(--card-shadow); }
  .auth-header { text-align: center; margin-bottom: 32px; }
  .auth-logo { font-family: 'Spectral', serif; font-size: 2.8rem; color: var(--green); line-height: 1; letter-spacing: -1px; }
  .auth-logo em { color: var(--orange); font-style: italic; }
  .auth-accent { display: flex; justify-content: center; margin: 12px auto 0; border-radius: 4px; overflow: hidden; width: 80px; height: 4px; }
  .auth-accent span { display: block; height: 4px; flex: 1; }
  .auth-tagline { margin-top: 10px; color: var(--muted); font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .auth-title { font-family: 'Spectral', serif; font-size: 1.4rem; color: var(--charcoal); margin-bottom: 6px; }
  .auth-sub { font-size: 0.88rem; color: var(--muted); margin-bottom: 24px; line-height: 1.5; }
  .auth-field { margin-bottom: 16px; }
  .auth-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; font-weight: 600; }
  .auth-input { width: 100%; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); font-family: 'Afacad Flux', sans-serif; font-size: 1rem; color: var(--charcoal); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .auth-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(5,178,220,0.12); }
  .auth-input::placeholder { color: #9ab5a2; }
  .auth-input.error { border-color: var(--orange); }
  .password-wrapper { position: relative; }
  .password-wrapper .auth-input { padding-right: 44px; }
  .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted); font-size: 1rem; padding: 4px; line-height: 1; transition: color 0.15s; }
  .password-toggle:hover { color: var(--teal); }
  .auth-btn { width: 100%; padding: 14px; background: var(--orange); color: white; border: none; border-radius: 12px; font-family: 'Spectral', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; letter-spacing: 0.02em; }
  .auth-btn:hover:not(:disabled) { background: var(--orange-light); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,87,10,0.35); }
  .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .auth-btn.secondary { background: transparent; color: var(--green); border: 1.5px solid var(--border); font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; margin-top: 12px; }
  .auth-btn.secondary:hover { border-color: var(--green); background: var(--green-pale); box-shadow: none; transform: none; }
  .auth-error { background: var(--orange-pale); border: 1.5px solid #ffcfb8; border-radius: 10px; padding: 12px 16px; color: var(--orange); font-size: 0.88rem; margin-bottom: 16px; line-height: 1.5; }
  .auth-success { background: var(--teal-pale); border: 1.5px solid #b8eaf5; border-radius: 10px; padding: 12px 16px; color: #037a97; font-size: 0.88rem; margin-bottom: 16px; line-height: 1.5; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--muted); font-size: 0.82rem; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .auth-switch { text-align: center; margin-top: 20px; font-size: 0.88rem; color: var(--muted); }
  .auth-switch button { background: none; border: none; color: var(--orange); cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; font-weight: 600; text-decoration: underline; }
  .auth-switch button:hover { color: var(--orange-light); }
  .auth-forgot { text-align: right; margin-top: -8px; margin-bottom: 16px; }
  .auth-forgot button { background: none; border: none; color: var(--muted); cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; transition: color 0.15s; }
  .auth-forgot button:hover { color: var(--teal); }
  .verify-icon { font-size: 3rem; margin-bottom: 16px; }
  .password-hint { font-size: 0.78rem; color: var(--muted); margin-top: 6px; }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function PasswordInput({ placeholder, value, onChange, onKeyDown, className }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrapper">
      <input
        className={`auth-input ${className || ""}`}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button type="button" className="password-toggle" onClick={() => setShow(s => !s)} tabIndex={-1}>
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerifyEmail = () => {
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    if (!isAllowedEmail(email)) { setError("Only Gmail and Yahoo email addresses are allowed."); return; }
    setStep(2);
  };

  const handleResetPassword = async () => {
    setError("");
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{style}</style>
      <div className="auth-page">
        {onBack && (
          <button onClick={onBack} style={{
            position: "fixed", top: "20px", left: "20px",
            background: "white", border: "1.5px solid #d4e2d8",
            borderRadius: "10px", cursor: "pointer",
            color: "#4a6655", fontSize: "0.88rem",
            fontFamily: "Afacad Flux, sans-serif",
            padding: "8px 16px",
            display: "flex", alignItems: "center", gap: "6px",
            fontWeight: 500, transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(46,83,57,0.08)"
          }}>
            ← Back
          </button>
        )}
        <div className="auth-box">
          <div className="auth-header">
            <div className="auth-logo"><em>Shufud</em></div>

          {success ? (
            <div style={{ textAlign: "center" }}>
              <div className="verify-icon">✅</div>
              <div className="auth-title">Password updated!</div>
              <p className="auth-sub" style={{ marginBottom: "24px" }}>
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <button className="auth-btn" onClick={onBack}>Sign In</button>
            </div>
          ) : step === 1 ? (
            <>
              <div className="auth-title">Reset your password</div>
              <p className="auth-sub">Enter your email address to continue.</p>
              {error && <div className="auth-error">⚠ {error}</div>}
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input className="auth-input" type="email"
                  placeholder="you@gmail.com or you@yahoo.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleVerifyEmail()} autoFocus />
              </div>
              <button className="auth-btn" onClick={handleVerifyEmail}>Continue</button>
              <button className="auth-btn secondary" onClick={onBack}>← Back to Sign In</button>
            </>
          ) : (
            <>
              <div className="auth-title">Set new password</div>
              <p className="auth-sub">Setting new password for <strong>{email}</strong>.</p>
              {error && <div className="auth-error">⚠ {error}</div>}
              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <PasswordInput placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <p className="password-hint">At least 8 characters</p>
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm New Password</label>
                <PasswordInput placeholder="Repeat new password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleResetPassword()} />
              </div>
              <button className="auth-btn" onClick={handleResetPassword} disabled={loading}>
                {loading ? <><div className="spinner" />Updating…</> : "Update Password"}
              </button>
              <button className="auth-btn secondary" onClick={() => { setStep(1); setError(""); }}>← Change Email</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function VerifyEmail({ email, onBack }) {
  return (
    <>
      <style>{style}</style>
      <div className="auth-page">
        <div className="auth-box">
          <div className="auth-header">
            <div className="auth-logo"><em>Shufud</em></div>
            <div className="auth-accent">
              <span style={{ background: "#2E5339" }} />
              <span style={{ background: "#FF570A" }} />
              <span style={{ background: "#05B2DC" }} />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="verify-icon">📬</div>
            <div className="auth-title">Check your inbox!</div>
            <p className="auth-sub" style={{ marginBottom: "24px" }}>
              We sent a verification link to <strong>{email}</strong>.<br />
              Click the link to activate your Shufud account.
            </p>
            <div className="auth-success">✓ Verification email sent successfully via Shufud</div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "20px", lineHeight: 1.6 }}>
              Didn't get it? Check your spam folder. The link expires in 24 hours.
            </p>
            <button className="auth-btn secondary" onClick={onBack}>← Back to Sign In</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Auth({ onVerify, onBack }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (mode === "forgot") return <ForgotPassword onBack={() => setMode("login")} />;

  const validate = () => {
    if (!email || !password) return "Please fill in all fields.";
    if (!isAllowedEmail(email)) return "Only Gmail and Yahoo email addresses are allowed.";
    if (mode === "signup") {
      if (password.length < 8) return "Password must be at least 8 characters.";
      if (password !== confirmPassword) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        onVerify(email);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      if (err.message.includes("Email not confirmed")) setError("Please verify your email before signing in. Check your inbox.");
      else if (err.message.includes("Invalid login credentials")) setError("Incorrect email or password. Please try again.");
      else if (err.message.includes("User already registered")) setError("An account with this email already exists. Please sign in.");
      else setError(err.message);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{style}</style>
      <div className="auth-page">
        <div className="auth-box">
          <div className="auth-header">
            <div className="auth-logo"><em>Shufud</em></div>
            <div className="auth-accent">
              <span style={{ background: "#2E5339" }} />
              <span style={{ background: "#FF570A" }} />
              <span style={{ background: "#05B2DC" }} />
            </div>
            <p className="auth-tagline">Tell me what you have · I'll tell you what to cook</p>
          </div>

          <div className="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</div>
          <p className="auth-sub">
            {mode === "login" ? "Sign in to access your recipes and pantry." : "Join Shufud — Gmail and Yahoo addresses only."}
          </p>

          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input className={`auth-input ${error && !isAllowedEmail(email) ? "error" : ""}`}
              type="email" placeholder="you@gmail.com or you@yahoo.com"
              value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <PasswordInput
              placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
              value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            {mode === "signup" && <p className="password-hint">At least 8 characters</p>}
          </div>

          {mode === "login" && (
            <div className="auth-forgot">
              <button onClick={() => setMode("forgot")}>Forgot password?</button>
            </div>
          )}

          {mode === "signup" && (
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <PasswordInput
                placeholder="Repeat your password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          )}

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" />{mode === "login" ? "Signing in…" : "Creating account…"}</>
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="auth-divider">or</div>

          <div className="auth-switch">
            {mode === "login"
              ? <span>Don't have an account? <button onClick={() => { setMode("signup"); setError(""); }}>Sign up</button></span>
              : <span>Already have an account? <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button></span>
            }
          </div>
        </div>
      </div>
    </>
  );
}
