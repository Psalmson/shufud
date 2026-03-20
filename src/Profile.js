import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const DIETARY_OPTIONS = [
  { value: "none", label: "No restriction" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "keto", label: "Keto" },
];

const getInitials = (name, email) => {
  if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return email?.slice(0, 2).toUpperCase() || "??";
};

const getAvatarColor = (email) => {
  const colors = ["#FF570A","#05B2DC","#2E5339","#e04e00","#037a97","#3a6647"];
  const index = email?.charCodeAt(0) % colors.length || 0;
  return colors[index];
};

function PasswordInput({ placeholder, value, onChange, className }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        className={`profile-input ${className || ""}`}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: "44px" }}
      />
      <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1} style={{
        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer", color: "#4a6655",
        fontSize: "1rem", padding: "4px", lineHeight: 1, transition: "color 0.15s"
      }}>
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

const drawerStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  body { font-size: 18px; }

  .profile-overlay { position: fixed; inset: 0; background: rgba(15,31,20,0.5); z-index: 200; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .profile-drawer { position: fixed; top: 0; right: 0; height: 100vh; width: 100%; max-width: 420px; background: #f8faf8; z-index: 201; overflow-y: auto; animation: slideIn 0.25s ease; box-shadow: -8px 0 40px rgba(15,31,20,0.15); display: flex; flex-direction: column; }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .profile-header { background: #2E5339; padding: 28px 24px 24px; display: flex; align-items: center; gap: 16px; position: relative; }
  .profile-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .profile-close:hover { background: rgba(255,255,255,0.25); }
  .profile-avatar-large { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Spectral', serif; font-size: 1.4rem; color: white; font-weight: 700; flex-shrink: 0; border: 3px solid rgba(255,255,255,0.3); }
  .profile-header-info { flex: 1; min-width: 0; }
  .profile-header-name { font-family: 'Spectral', serif; color: white; font-size: 1.2rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .profile-header-email { color: rgba(255,255,255,0.7); font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .profile-tier-badge { display: inline-block; margin-top: 8px; background: #FF570A; color: white; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
  .profile-body { padding: 20px 24px; flex: 1; font-family: 'Afacad Flux', sans-serif; }
  .profile-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 24px; }
  .stat-card { background: white; border: 1.5px solid #d4e2d8; border-radius: 14px; padding: 14px 10px; text-align: center; box-shadow: 0 2px 8px rgba(46,83,57,0.06); }
  .stat-value { font-family: 'Spectral', serif; font-size: 1.5rem; color: #2E5339; line-height: 1; }
  .stat-label { font-size: 0.7rem; color: #4a6655; margin-top: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
  .profile-section { margin-bottom: 20px; }
  .profile-section-title { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: #4a6655; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .profile-section-title::after { content: ''; flex: 1; height: 1px; background: #d4e2d8; }
  .profile-field { margin-bottom: 14px; }
  .profile-label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #4a6655; display: block; margin-bottom: 7px; font-weight: 600; }
  .profile-input { width: 100%; padding: 11px 14px; border: 1.5px solid #d4e2d8; border-radius: 10px; background: white; font-family: 'Afacad Flux', sans-serif; font-size: 1.05rem; color: #0f1f14; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .profile-input:focus { border-color: #05B2DC; box-shadow: 0 0 0 3px rgba(5,178,220,0.12); }
  .profile-input:disabled { background: #f0f5f1; color: #4a6655; cursor: not-allowed; }
  .profile-select { width: 100%; padding: 11px 14px; border: 1.5px solid #d4e2d8; border-radius: 10px; background: white; font-family: 'Afacad Flux', sans-serif; font-size: 1.05rem; color: #0f1f14; outline: none; cursor: pointer; transition: border-color 0.2s; }
  .profile-select:focus { border-color: #05B2DC; }
  .profile-btn { width: 100%; padding: 13px; border: none; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .profile-btn-primary { background: #FF570A; color: white; margin-bottom: 10px; }
  .profile-btn-primary:hover:not(:disabled) { background: #ff7033; transform: translateY(-1px); }
  .profile-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .profile-btn-ghost { background: transparent; border: 1.5px solid #d4e2d8; color: #4a6655; margin-bottom: 10px; }
  .profile-btn-ghost:hover { border-color: #2E5339; color: #2E5339; }
  .profile-btn-danger { background: transparent; border: 1.5px solid #d4e2d8; color: #4a6655; }
  .profile-btn-danger:hover { border-color: #FF570A; color: #FF570A; background: #fff3ee; }
  .profile-success { background: #edfaff; border: 1.5px solid #b8eaf5; border-radius: 10px; padding: 10px 14px; color: #037a97; font-size: 0.88rem; margin-bottom: 14px; }
  .profile-error { background: #fff3ee; border: 1.5px solid #ffcfb8; border-radius: 10px; padding: 10px 14px; color: #FF570A; font-size: 0.88rem; margin-bottom: 14px; }
  .profile-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export function AvatarButton({ session, onClick }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!session) return;
    supabase.from("profiles").select("display_name").eq("id", session.user.id).single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  const initials = getInitials(profile?.display_name, session?.user?.email);
  const color = getAvatarColor(session?.user?.email);

  return (
    <button onClick={onClick} style={{
      width: "38px", height: "38px", borderRadius: "50%", background: color,
      border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", color: "white",
      fontFamily: "'Spectral', serif", fontSize: "0.85rem", fontWeight: "700",
      flexShrink: 0, transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
      {initials}
    </button>
  );
}

export default function Profile({ session, onClose, onSignOut }) {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [dietary, setDietary] = useState("none");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usageToday, setUsageToday] = useState(0);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const DAILY_LIMIT = 2;
  const today = new Date().toISOString().split("T")[0];
  const memberSince = new Date(session?.user?.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  useEffect(() => { loadProfile(); loadUsage(); }, []);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (data) { setProfile(data); setDisplayName(data.display_name || ""); setDietary(data.dietary_preference || "none"); }
  };

  const loadUsage = async () => {
    const { data } = await supabase.from("usage_tracking").select("count").eq("user_id", session.user.id).eq("date", today).single();
    setUsageToday(data?.count || 0);
  };

  const saveProfile = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        display_name: displayName.trim() || null,
        dietary_preference: dietary
      });
      if (error) throw error;
      setSuccess("Profile saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    setError(""); setSuccess("");
    if (!newPassword) { setError("Please enter a new password."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword(""); setConfirmPassword("");
      setSuccess("Password changed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) { setError(err.message); }
    finally { setChangingPassword(false); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    if (!window.confirm("Last chance — all your data will be permanently deleted. Continue?")) return;
    try {
      // Mark profile as deleted instead of hard deleting
      await supabase.from("profiles").update({
        deleted: true,
        deleted_at: new Date().toISOString()
      }).eq("id", session.user.id);
      // Sign out and delete auth user
      await supabase.auth.signOut();
      onSignOut();
    } catch (err) {
      setError("Could not delete account. Please contact support.");
    }
  };

  const initials = getInitials(displayName || profile?.display_name, session?.user?.email);
  const avatarColor = getAvatarColor(session?.user?.email);

  return (
    <>
      <style>{drawerStyle}</style>
      <div className="profile-overlay" onClick={onClose} />
      <div className="profile-drawer">
        <div className="profile-header">
          <button className="profile-close" onClick={onClose}>✕</button>
          <div className="profile-avatar-large" style={{ background: avatarColor }}>{initials}</div>
          <div className="profile-header-info">
            <div className="profile-header-name">{displayName || session?.user?.email?.split("@")[0]}</div>
            <div className="profile-header-email">{session?.user?.email}</div>
            <span className="profile-tier-badge">✦ Free Plan</span>
          </div>
        </div>

        <div className="profile-body">
          {success && <div className="profile-success">✓ {success}</div>}
          {error && <div className="profile-error">⚠ {error}</div>}

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-value">{usageToday}/{DAILY_LIMIT}</div>
              <div className="stat-label">Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{profile?.total_recipes_generated || 0}</div>
              <div className="stat-label">All Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: "0.9rem", marginTop: "4px" }}>{memberSince.split(" ")[1]}</div>
              <div className="stat-label">Joined {memberSince.split(" ")[0]}</div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Profile</div>
            <div className="profile-field">
              <label className="profile-label">Display Name</label>
              <input className="profile-input" placeholder="e.g. Psalmson"
                value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <div className="profile-field">
              <label className="profile-label">Email</label>
              <input className="profile-input" value={session?.user?.email} disabled />
            </div>
            <div className="profile-field">
              <label className="profile-label">Default Dietary Preference</label>
              <select className="profile-select" value={dietary} onChange={e => setDietary(e.target.value)}>
                {DIETARY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button className="profile-btn profile-btn-primary" onClick={saveProfile} disabled={saving}>
              {saving ? <><div className="profile-spinner" /> Saving…</> : "Save Changes"}
            </button>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Security</div>
            <div className="profile-field">
              <label className="profile-label">New Password</label>
              <PasswordInput placeholder="Min. 8 characters"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="profile-field">
              <label className="profile-label">Confirm New Password</label>
              <PasswordInput placeholder="Repeat new password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button className="profile-btn profile-btn-ghost" onClick={changePassword} disabled={changingPassword}>
              {changingPassword
                ? <><div className="profile-spinner" style={{ borderTopColor: "#2E5339" }} /> Updating…</>
                : "🔒 Change Password"}
            </button>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Account</div>
            <button className="profile-btn profile-btn-ghost" onClick={onSignOut}>Sign Out</button>
            <button className="profile-btn profile-btn-danger" onClick={deleteAccount}>🗑 Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
}
