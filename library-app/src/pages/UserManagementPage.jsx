import { useState, useEffect } from "react";
import { Badge } from "../components/UI";

/**
 * UserManagementPage — create and update system users (admin only)
 * Props: users, setUsers, showAlert
 */
export default function UserManagementPage({ users, setUsers, showAlert }) {
  const [mode, setMode]       = useState("new");
  const [existingId, setExistingId] = useState("");
  const [form, setForm]       = useState({
    name: "", username: "", password: "", isActive: true, isAdmin: false,
  });
  const [err, setErr] = useState("");

  const existingUser = users.find((u) => u.id === Number(existingId));

  useEffect(() => {
    if (existingUser)
      setForm({
        name: existingUser.name,
        username: existingUser.username,
        password: existingUser.password,
        isActive: existingUser.isActive,
        isAdmin: existingUser.isAdmin,
      });
  }, [existingId]);

  const submit = () => {
    if (!form.name) { setErr("Name is required."); return; }

    if (mode === "new") {
      if (!form.username || !form.password) {
        setErr("Username and password are required for new users."); return;
      }
      if (users.find((u) => u.username === form.username)) {
        setErr("Username already exists."); return;
      }
      setUsers((prev) => [...prev, { ...form, id: prev.length + 1 }]);
      showAlert(`User "${form.name}" created successfully.`);
      setForm({ name: "", username: "", password: "", isActive: true, isAdmin: false });
    } else {
      if (!existingId) { setErr("Select an existing user."); return; }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === Number(existingId)
            ? { ...u, name: form.name, isActive: form.isActive, isAdmin: form.isAdmin }
            : u
        )
      );
      showAlert("User updated successfully.");
      setExistingId("");
      setForm({ name: "", username: "", password: "", isActive: true, isAdmin: false });
    }
    setErr("");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">User Management</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}

      <div className="card">
        {/* Mode selector */}
        <div className="form-field" style={{ marginBottom: 20 }}>
          <div className="radio-group">
            <label className="radio-opt">
              <input
                type="radio"
                name="umode"
                value="new"
                checked={mode === "new"}
                onChange={() => { setMode("new"); setExistingId(""); }}
              />
              New User
            </label>
            <label className="radio-opt">
              <input
                type="radio"
                name="umode"
                value="existing"
                checked={mode === "existing"}
                onChange={() => setMode("existing")}
              />
              Existing User
            </label>
          </div>
        </div>

        {/* Existing user selector */}
        {mode === "existing" && (
          <div className="form-field" style={{ marginBottom: 20 }}>
            <label className="form-label required">Select User</label>
            <select
              className="form-select"
              value={existingId}
              onChange={(e) => setExistingId(e.target.value)}
            >
              <option value="">— Select —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Form fields */}
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          {mode === "new" && (
            <>
              <div className="form-field">
                <label className="form-label required">Username</label>
                <input
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label required">Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
            </>
          )}
          <div className="form-field form-full" style={{ display: "flex", gap: 24 }}>
            <label className="radio-opt">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active (uncheck = inactive user)
            </label>
            <label className="radio-opt">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(e) => setForm((f) => ({ ...f, isAdmin: e.target.checked }))}
              />
              Admin (check = grant admin access)
            </label>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            {mode === "new" ? "Create User" : "Update User"}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setForm({ name: "", username: "", password: "", isActive: true, isAdmin: false });
              setExistingId("");
              setErr("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* All users table */}
      <div className="card">
        <div className="card-title">All Users</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td><code style={{ fontSize: 12 }}>{u.username}</code></td>
                  <td>
                    <span className={`badge ${u.isAdmin ? "badge-blue" : "badge-gray"}`}>
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td><Badge status={u.isActive ? "Active" : "Inactive"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
