import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const TIERS = ["free", "commis", "sous", "head"];
const TIER_COLORS = { free: "#9ab5a2", commis: "#05B2DC", sous: "#FF570A", head: "#2E5339" };
const TIER_LABELS = { free: "Free", commis: "Commis", sous: "Sous Chef", head: "Head Chef" };

const adminStyle = `
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

  .admin-table-wrap { background: white; border: 1.5px solid #d4e2d8; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(46,83,57,0.06); }
  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th { padding: 12px 16px; text-align: left; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #4a6655; border-bottom: 1.5px solid #d4e2d8; background: #f8faf8; font-weight: 600; }
  .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f0f5f1; font-size: 0.88rem; color: #0f1f14; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #f8faf8; }

  .tier-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: white; }
  .trial-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.68rem; font-weight: 600; }
  .trial-badge.active { background: #edfaff; color: #037a97; border: 1px solid #b8eaf5; }
  .trial-badge.expired { background: #fff3ee; color: #FF570A; border: 1px solid #ffcfb8; }

  .admin-tier-select { padding: 6px 10px; border: 1.5px solid #d4e2d8; border-radius: 8px; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; outline: none; cursor: pointer; background: white; transition: border-color 0.2s; }
  .admin-tier-select:focus { border-color: #05B2DC; }
  .admin-update-btn { padding: 6px 14px; background: #FF570A; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Afacad Flux', sans-serif; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; margin-left: 8px; }
  .admin-update-btn:hover { background: #ff7033; }
  .admin-update-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .admin-loading { text-align: center; padding: 60px; color: #4a6655; }
  .admin-error { background: #fff3ee; border: 1.5px solid #ffcfb8; border-radius: 12px; padding: 14px 18px; color: #FF570A; margin-bottom: 20px; }
  .admin-empty { text-align: center; padding: 40px; color: #4a6655; font-size: 0.92rem; }

  .admin-spinner { width: 32px; height: 32px; border: 3px solid #d4e2d8; border-top-color: #2E5339; border-radius: 50%; animation: adminSpin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes adminSpin { to { transform: rotate(360deg); } }

  .success-toast { position: fixed; bottom: 24px; right: 24px; background: #2E5339; color: white; padding: 12px 20px; border-radius: 12px; font-size: 0.88rem; z-index: 999; animation: toastIn 0.2s ease; box-shadow: 0 4px 16px rgba(46,83,57,0.3); }
  @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function Admin({ session, onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [updating, setUpdating] = useState({});
  const [selectedTiers, setSelectedTiers] = useState({});
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
      data.users.forEach(u => { tiers[u.id] = u.tier; });
      setSelectedTiers(tiers);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const updateTier = async (userId) => {
    const newTier = selectedTiers[userId];
    setUpdating(p => ({ ...p, [userId]: true }));
    try {
      const token = await getToken();
      const res = await fetch("/api/admin?action=update_tier", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, tier: newTier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: newTier } : u));
      showToast(`✓ Tier updated to ${TIER_LABELS[newTier]}`);
    } catch (err) {
      setError(err.message);
    } finally { setUpdating(p => ({ ...p, [userId]: false })); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const stats = {
    total: users.length,
    active_today: users.filter(u => u.usage_today > 0).length,
    trial_expired: users.filter(u => u.trial_expired).length,
    paid: users.filter(u => u.tier !== "free").length,
    free: users.filter(u => u.tier === "free").length,
  };

  return (
    <>
      <style>{adminStyle}</style>
      {toast && <div className="success-toast">{toast}</div>}

      <div className="admin-page">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            🍳 Shufud Admin <span className="admin-topbar-badge">Dashboard</span>
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
              <div className="admin-stat-value">{stats.free}</div>
              <div className="admin-stat-label">Free Users</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value" style={{ color: "#FF570A" }}>{stats.trial_expired}</div>
              <div className="admin-stat-label">Trial Expired</div>
            </div>
          </div>

          <div className="admin-toolbar">
            <input className="admin-search" placeholder="Search by email or name…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="admin-filter" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
              <option value="all">All Tiers</option>
              {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
            </select>
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
                    <th>Trial</th>
                    <th>Current Tier</th>
                    <th>Usage Today</th>
                    <th>All Time</th>
                    <th>Last Active</th>
                    <th>Update Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="admin-empty">No users found</td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{user.display_name || "—"}</div>
                        <div style={{ fontSize: "0.78rem", color: "#4a6655" }}>{user.email}</div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#4a6655" }}>
                        {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td>
                        {user.tier === "free" ? (
                          <span className={`trial-badge ${user.trial_expired ? "expired" : "active"}`}>
                            {user.trial_expired ? "Expired" : `${user.trial_days_left}d left`}
                          </span>
                        ) : <span style={{ fontSize: "0.78rem", color: "#4a6655" }}>N/A</span>}
                      </td>
                      <td>
                        <span className="tier-badge" style={{ background: TIER_COLORS[user.tier] }}>
                          {TIER_LABELS[user.tier]}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>{user.usage_today}</td>
                      <td style={{ textAlign: "center" }}>{user.total_recipes}</td>
                      <td style={{ fontSize: "0.82rem", color: "#4a6655" }}>
                        {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <select className="admin-tier-select"
                            value={selectedTiers[user.id] || user.tier}
                            onChange={e => setSelectedTiers(p => ({ ...p, [user.id]: e.target.value }))}>
                            {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                          </select>
                          <button className="admin-update-btn"
                            onClick={() => updateTier(user.id)}
                            disabled={updating[user.id] || selectedTiers[user.id] === user.tier}>
                            {updating[user.id] ? "…" : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
