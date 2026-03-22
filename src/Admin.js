import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const TIERS = ["free", "smart_cook", "pro_chef"];
const TIER_COLORS = { free: "#9ab5a2", smart_cook: "#05B2DC", pro_chef: "#FF570A" };
const TIER_LABELS = { free: "Free", smart_cook: "Smart Cook", pro_chef: "Pro Chef" };
const SUBSCRIPTION_PERIODS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "6 Months", days: 183 },
  { label: "1 Year", days: 365 },
];

const adminStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  .admin-page { min-height: 100vh; background: #f8faf8; font-family: 'Afacad Flux', sans-serif; }
  .admin-topbar { background: #2E5339; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
  .admin-topbar-title { font-family: 'Spectral', serif; color: white; font-size: 1.3rem; display: flex; align-items: center; gap: 10px; }
  .admin-topbar-badge { background: #FF570A; color: white; font-size: 0.62rem; padding: 3px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  .admin-topbar-btn { background: rgba(255,255,255,0.15); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.85rem; transition: background 0.2s; }
  .admin-topbar-btn:hover { background: rgba(255,255,255,0.25); }
  .admin-body { padding: 32px; max-width: 1200px; margin: 0 auto; }
  .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .admin-stat { background: white; border: 1.5px solid #d4e2d8; border-radius: 14px; padding: 18px; text-align: center; box-shadow: 0 2px 8px rgba(46,83,57,0.06); }
  .admin-stat-value { font-family: 'Spectral', serif; font-size: 2rem; color: #2E5339; line-height: 1; }
  .admin-stat-label { font-size: 0.75rem; color: #4a6655; margin-top: 6px; letter-spacing: 0.06em; text-transform: uppercase; }
  .admin-toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
  .admin-search { flex: 1; min-width: 200px; padding: 10px 16px; border: 1.5px solid #d4e2d8; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.92rem; outline: none; background: white; }
  .admin-search:focus { border-color: #05B2DC; }
  .admin-filter { padding: 10px 14px; border: 1.5px solid #d4e2d8; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; outline: none; background: white; cursor: pointer; }
  .admin-refresh-btn { padding: 10px 16px; background: #2E5339; color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; transition: all 0.2s; }
  .admin-refresh-btn:hover { background: #3a6647; }
  .admin-deleted-toggle { padding: 10px 16px; border: 1.5px solid #d4e2d8; border-radius: 10px; font-family: 'Afacad Flux', sans-serif; font-size: 0.88rem; cursor: pointer; background: white; color: #4a6655; transition: all 0.2s; }
  .admin-deleted-toggle.active { background: #fff3ee; border-color: #FF570A; color: #FF570A; }
  .admin-table-wrap { background: white; border: 1.5px solid #d4e2d8; border-radius: 16px; overflow: auto; box-shadow: 0 2px 12px rgba(46,83,57,0.06); }
  .admin-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .admin-table th { padding: 12px 16px; text-align: left; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #4a6655; border-bottom: 1.5px solid #d4e2d8; background: #f8faf8; font-weight: 600; white-space: nowrap; }
  .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f0f5f1; font-size: 0.88rem; color: #0f1f14; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #f8faf8; }
  .admin-table tr.deleted-row td { opacity: 0.6; background: #fafafa; }
  .tier-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: white; }
  .trial-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.68rem; font-weight: 600; }
  .trial-badge.active { background: #edfaff; color: #037a97; border: 1px solid #b8eaf5; }
  .trial-badge.expired { background: #fff3ee; color: #FF570A; border: 1px solid #ffcfb8; }
  .deleted-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.68rem; font-weight: 600; background: #f0f0f0; color: #888; border: 1px solid #ddd; }
  .admin-tier-select { padding: 6px 10px; border: 1.5px solid #d4e2d8; border-radius: 8px; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; outline: none; cursor: pointer; background: white; transition: border-color 0.2s; }
  .admin-tier-select:focus { border-color: #05B2DC; }
  .admin-update-btn { padding: 6px 14px; background: #FF570A; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; }
  .admin-update-btn:hover:not(:disabled) { background: #ff7033; }
  .admin-update-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .admin-restore-btn { padding: 6px 14px; background: #2E5339; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; }
  .admin-restore-btn:hover { background: #3a6647; }
  .admin-loading { text-align: center; padding: 60px; color: #4a6655; }
  .admin-error { background: #fff3ee; border: 1.5px solid #ffcfb8; border-radius: 12px; padding: 14px 18px; color: #FF570A; margin-bottom: 20px; font-size: 0.92rem; }
  .admin-empty { text-align: center; padding: 40px; color: #4a6655; font-size: 0.92rem; }
  .admin-spinner { width: 32px; height: 32px; border: 3px solid #d4e2d8; border-top-color: #2E5339; border-radius: 50%; animation: adminSpin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes adminSpin { to { transform: rotate(360deg); } }
  .success-toast { position: fixed; bottom: 24px; right: 24px; background: #2E5339; color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.88rem; z-index: 999; animation: toastIn 0.2s ease; box-shadow: 0 4px 16px rgba(46,83,57,0.3); font-family: 'Afacad Flux', sans-serif; }
  @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const getDaysRemaining = (expiresAt) => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function Admin({ session, onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [updating, setUpdating] = useState({});
  const [selectedTiers, setSelectedTiers] = useState({});
  const [selectedPeriods, setSelectedPeriods] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const getToken = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    return s?.access_token;
  };

  const loadUsers = async () => {
    setLoading(true); setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin?action=users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users || []);
      const tiers = {};
      const periods = {};
      data.users.forEach(u => {
        tiers[u.id] = u.tier;
        periods[u.id] = 30;
      });
      setSelectedTiers(tiers);
      setSelectedPeriods(periods);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const updateTier = async (userId) => {
    const newTier = selectedTiers[userId];
    const days = selectedPeriods[userId] || 30;
    setUpdating(p => ({ ...p, [userId]: true }));
    try {
      const token = await getToken();
      const expiresAt = newTier === "free" ? null
        : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch("/api/admin?action=update_tier", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, tier: newTier, expires_at: expiresAt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, tier: newTier, tier_expires_at: expiresAt }
        : u
      ));
      showToast(`✓ Tier updated to ${TIER_LABELS[newTier]}${newTier !== "free" ? ` for ${days} days` : ""}`);
    } catch (err) {
      setError(err.message);
    } finally { setUpdating(p => ({ ...p, [userId]: false })); }
  };

  const restoreAccount = async (userId) => {
    setUpdating(p => ({ ...p, [userId]: true }));
    try {
      const token = await getToken();
      const res = await fetch("/api/admin?action=restore", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, deleted: false, deleted_at: null }
        : u
      ));
      showToast("✓ Account restored");
    } catch (err) {
      setError(err.message);
    } finally { setUpdating(p => ({ ...p, [userId]: false })); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = users.filter(u => {
    if (!showDeleted && u.deleted) return false;
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const activeUsers = users.filter(u => !u.deleted);
  const deletedUsers = users.filter(u => u.deleted);

  const stats = {
    total: activeUsers.length,
    active_today: activeUsers.filter(u => u.usage_today > 0).length,
    trial_expired: activeUsers.filter(u => u.trial_expired).length,
    paid: activeUsers.filter(u => u.tier !== "free").length,
    deleted: deletedUsers.length,
  };

  return (
    <>
      <style>{adminStyle}</style>
      {toast && <div className="success-toast">{toast}</div>}
      <div className="admin-page">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <img src="/logo-dark.svg" alt="Shufud" style={{ height: "24px", width: "auto" }} />
            <span style={{ marginLeft: "8px" }}>Admin</span>
            <span className="admin-topbar-badge">Dashboard</span>
          </div>
          <button className="admin-topbar-btn" onClick={onBack}>← Back to App</button>
        </div>
        <div className="admin-body">
          {error && <div className="admin-error">⚠ {error}</div>}
          <div className="admin-stats">
            <div className="admin-stat">
              <div className="admin-stat-value">{stats.total}</div>
              <div className="admin-stat-label">Total Users</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{stats.active_today}</div>
              <div className="admin-stat-label">Active Today</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{stats.paid}</div>
              <div className="admin-stat-label">Paid Users</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{stats.trial_expired}</div>
              <div className="admin-stat-label">Trial Expired</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value" style={{ color: "#FF570A" }}>{stats.deleted}</div>
              <div className="admin-stat-label">Deleted</div>
            </div>
          </div>
          <div className="admin-toolbar">
            <input className="admin-search" placeholder="Search by email or name…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="admin-filter" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
              <option value="all">All Tiers</option>
              {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
            </select>
            <button
              className={`admin-deleted-toggle ${showDeleted ? "active" : ""}`}
              onClick={() => setShowDeleted(p => !p)}>
              🗑 {showDeleted ? "Hide" : "Show"} Deleted ({stats.deleted})
            </button>
            <button className="admin-refresh-btn" onClick={loadUsers}>↻ Refresh</button>
          </div>
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              Loading users…
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Current Tier</th>
                    <th>Expires</th>
                    <th>Usage Today</th>
                    <th>All Time</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="9"><div className="admin-empty">No users found</div></td></tr>
                  ) : filtered.map(user => {
                    const daysLeft = getDaysRemaining(user.tier_expires_at);
                    const expiringSoon = daysLeft !== null && daysLeft <= 7;
                    return (
                      <tr key={user.id} className={user.deleted ? "deleted-row" : ""}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{user.display_name || "—"}</div>
                          <div style={{ fontSize: "0.78rem", color: "#4a6655" }}>{user.email}</div>
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "#4a6655" }}>
                          {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td>
                          {user.deleted ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span className="deleted-badge">🗑 Deleted</span>
                              {user.deleted_at && (
                                <span style={{ fontSize: "0.7rem", color: "#aaa" }}>
                                  {new Date(user.deleted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                </span>
                              )}
                            </div>
                          ) : user.tier === "free" ? (
                            <span className={`trial-badge ${user.trial_expired ? "expired" : "active"}`}>
                              {user.trial_expired ? "Trial Expired" : `${user.trial_days_left}d left`}
                            </span>
                          ) : (
                            <span className="trial-badge active">Active</span>
                          )}
                        </td>
                        <td>
                          <span className="tier-badge" style={{ background: TIER_COLORS[user.tier] }}>
                            {TIER_LABELS[user.tier]}
                          </span>
                        </td>
                        <td>
                          {user.tier_expires_at && daysLeft !== null ? (
                            <div>
                              <div style={{ fontSize: "0.82rem", color: expiringSoon ? "#FF570A" : "#4a6655" }}>
                                {expiringSoon ? "⚠ " : ""}{daysLeft === 0 ? "Today" : `${daysLeft}d`}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "#9ab5a2" }}>
                                {new Date(user.tier_expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                              </div>
                            </div>
                          ) : <span style={{ color: "#9ab5a2", fontSize: "0.82rem" }}>—</span>}
                        </td>
                        <td style={{ textAlign: "center" }}>{user.usage_today}</td>
                        <td style={{ textAlign: "center" }}>{user.total_recipes}</td>
                        <td style={{ fontSize: "0.82rem", color: "#4a6655" }}>
                          {user.last_sign_in
                            ? new Date(user.last_sign_in).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                            : "—"}
                        </td>
                        <td>
                          {user.deleted ? (
                            <button className="admin-restore-btn"
                              onClick={() => restoreAccount(user.id)}
                              disabled={updating[user.id]}>
                              {updating[user.id] ? "…" : "↺ Restore"}
                            </button>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                              <select className="admin-tier-select"
                                value={selectedTiers[user.id] || user.tier}
                                onChange={e => setSelectedTiers(p => ({ ...p, [user.id]: e.target.value }))}>
                                {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                              </select>
                              {(selectedTiers[user.id] || user.tier) !== "free" && (
                                <select className="admin-tier-select"
                                  value={selectedPeriods[user.id] || 30}
                                  onChange={e => setSelectedPeriods(p => ({ ...p, [user.id]: Number(e.target.value) }))}>
                                  {SUBSCRIPTION_PERIODS.map(p => (
                                    <option key={p.days} value={p.days}>{p.label}</option>
                                  ))}
                                </select>
                              )}
                              <button className="admin-update-btn"
                                onClick={() => updateTier(user.id)}
                                disabled={updating[user.id] || selectedTiers[user.id] === user.tier}>
                                {updating[user.id] ? "…" : "Save"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
