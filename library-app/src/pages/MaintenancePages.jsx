import { useState } from "react";
import { today, durationToEnd, generateMembershipId } from "../utils/helpers";

// ─── MAINTENANCE ──────────────────────────────────────────────────────────────

/**
 * MaintenancePage — admin hub with navigation tiles
 * Props: setPage
 */
export function MaintenancePage({ setPage }) {
  const items = [
    { icon: "➕", label: "Add Membership",       page: "addMembership" },
    { icon: "✏",  label: "Update Membership",    page: "updateMembership" },
    { icon: "📖", label: "Add Book / Movie",     page: "addBook" },
    { icon: "📝", label: "Update Book / Movie",  page: "updateBook" },
    { icon: "👥", label: "User Management",      page: "userManagement" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Maintenance</div>
        <div className="page-sub">Admin-only housekeeping functions</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.page}
            className="card"
            style={{
              cursor: "pointer",
              textAlign: "center",
              padding: 32,
              transition: "box-shadow .2s",
            }}
            onClick={() => setPage(item.page)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "var(--shadow-lg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "var(--shadow)")
            }
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD MEMBERSHIP ───────────────────────────────────────────────────────────

/**
 * AddMembershipPage — create a new library membership
 * Props: memberships, setMemberships, showAlert
 */
export function AddMembershipPage({ memberships, setMemberships, showAlert }) {
  const blank = {
    firstName: "",
    lastName: "",
    contactNumber: "",
    contactAddress: "",
    aadharCardNo: "",
    startDate: today(),
    endDate: durationToEnd(today(), "6months"),
    duration: "6months",
  };
  const [form, setForm] = useState(blank);
  const [err, setErr]   = useState("");

  const set = (k, v) => {
    const nf = { ...form, [k]: v };
    if (k === "duration" || k === "startDate")
      nf.endDate = durationToEnd(nf.startDate, nf.duration);
    setForm(nf);
  };

  const submit = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.contactNumber ||
      !form.contactAddress ||
      !form.aadharCardNo
    ) {
      setErr("All fields are required."); return;
    }
    const newId = generateMembershipId(memberships);
    setMemberships((prev) => [
      ...prev,
      { ...form, id: newId, isActive: true, amountPending: 0 },
    ]);
    setForm(blank);
    setErr("");
    showAlert(`Membership ${newId} created for ${form.firstName} ${form.lastName}!`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Add Membership</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">First Name</label>
            <input
              className="form-input"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Last Name</label>
            <input
              className="form-input"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Contact Number</label>
            <input
              className="form-input"
              value={form.contactNumber}
              onChange={(e) => set("contactNumber", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Aadhar Card No</label>
            <input
              className="form-input"
              value={form.aadharCardNo}
              onChange={(e) => set("aadharCardNo", e.target.value)}
            />
          </div>
          <div className="form-field form-full">
            <label className="form-label required">Contact Address</label>
            <textarea
              className="form-textarea"
              value={form.contactAddress}
              onChange={(e) => set("contactAddress", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Start Date</label>
            <input
              className="form-input"
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">End Date (auto)</label>
            <input className="form-input" readOnly value={form.endDate} />
          </div>
          <div className="form-field form-full">
            <label className="form-label required">Membership Duration</label>
            <div className="radio-group">
              {[["6months", "6 Months"], ["1year", "1 Year"], ["2years", "2 Years"]].map(
                ([v, l]) => (
                  <label key={v} className="radio-opt">
                    <input
                      type="radio"
                      name="duration"
                      value={v}
                      checked={form.duration === v}
                      onChange={() => set("duration", v)}
                    />
                    {l}
                  </label>
                )
              )}
            </div>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Create Membership
          </button>
          <button className="btn btn-outline" onClick={() => setForm(blank)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UPDATE MEMBERSHIP ────────────────────────────────────────────────────────

/**
 * UpdateMembershipPage — extend or cancel a membership
 * Props: memberships, setMemberships, showAlert
 */
export function UpdateMembershipPage({ memberships, setMemberships, showAlert }) {
  const [memberId, setMemberId] = useState("");
  const [action, setAction]     = useState("extend");
  const [duration, setDuration] = useState("6months");
  const [err, setErr]           = useState("");

  const member = memberships.find((m) => m.id === memberId);

  const submit = () => {
    if (!memberId) { setErr("Membership number is required."); return; }
    if (!member)   { setErr("Membership not found."); return; }

    if (action === "remove") {
      setMemberships((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, isActive: false } : m))
      );
      showAlert(`Membership ${memberId} has been deactivated.`);
    } else {
      const base = new Date(member.endDate);
      if (duration === "6months") base.setMonth(base.getMonth() + 6);
      else if (duration === "1year") base.setFullYear(base.getFullYear() + 1);
      else base.setFullYear(base.getFullYear() + 2);
      const newEnd = base.toISOString().split("T")[0];
      setMemberships((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, endDate: newEnd, isActive: true } : m
        )
      );
      showAlert(`Membership ${memberId} extended until ${newEnd}.`);
    }
    setMemberId(""); setErr("");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Update Membership</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-grid">
          <div className="form-field form-full">
            <label className="form-label required">Membership Number</label>
            <select
              className="form-select"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">— Select Member —</option>
              {memberships.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.firstName} {m.lastName}
                </option>
              ))}
            </select>
          </div>
          {member && (
            <>
              <div className="form-field">
                <label className="form-label">Start Date</label>
                <input className="form-input" readOnly value={member.startDate} />
              </div>
              <div className="form-field">
                <label className="form-label">Current End Date</label>
                <input className="form-input" readOnly value={member.endDate} />
              </div>
            </>
          )}
          <div className="form-field form-full">
            <label className="form-label required">Action</label>
            <div className="radio-group">
              <label className="radio-opt">
                <input
                  type="radio"
                  name="action"
                  value="extend"
                  checked={action === "extend"}
                  onChange={() => setAction("extend")}
                />
                Extend Membership
              </label>
              <label className="radio-opt">
                <input
                  type="radio"
                  name="action"
                  value="remove"
                  checked={action === "remove"}
                  onChange={() => setAction("remove")}
                />
                Remove / Cancel
              </label>
            </div>
          </div>
          {action === "extend" && (
            <div className="form-field form-full">
              <label className="form-label required">Extension Duration</label>
              <div className="radio-group">
                {[["6months", "6 Months"], ["1year", "1 Year"], ["2years", "2 Years"]].map(
                  ([v, l]) => (
                    <label key={v} className="radio-opt">
                      <input
                        type="radio"
                        name="extDuration"
                        value={v}
                        checked={duration === v}
                        onChange={() => setDuration(v)}
                      />
                      {l}
                    </label>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Confirm
          </button>
          <button
            className="btn btn-outline"
            onClick={() => { setMemberId(""); setErr(""); }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
