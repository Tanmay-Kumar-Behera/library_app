import { useState } from "react";

/**
 * LoginPage
 * Props: users (array), onLogin (fn)
 */
export default function LoginPage({ users, onLogin }) {
  const [tab, setTab] = useState("admin");
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
    const u = users.find(
      (x) => x.username === uname && x.password === pwd && x.isActive
    );
    if (!u) { setErr("Invalid credentials or inactive account."); return; }
    if (tab === "admin" && !u.isAdmin) { setErr("This account is not an admin."); return; }
    if (tab === "user" && u.isAdmin) { setErr("Use Admin login for admin accounts."); return; }
    onLogin(u);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">Library System</div>
        <div className="login-sub">Management Portal</div>
        <div className="login-tabs">
          <button
            className={`login-tab${tab === "admin" ? " active" : ""}`}
            onClick={() => { setTab("admin"); setErr(""); }}
          >
            Admin Login
          </button>
          <button
            className={`login-tab${tab === "user" ? " active" : ""}`}
            onClick={() => { setTab("user"); setErr(""); }}
          >
            User Login
          </button>
        </div>
        {err && <div className="error-msg">{err}</div>}
        <div className="field">
          <label>User ID</label>
          <input
            value={uname}
            onChange={(e) => setUname(e.target.value)}
            placeholder={tab === "admin" ? "adm" : "user"}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="••••••"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </div>
        <button className="btn-primary" onClick={login}>
          Login →
        </button>
        
      </div>
    </div>
  );
}
