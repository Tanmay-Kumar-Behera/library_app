import { useState } from "react";

/**
 * PayFinePage — collect fine payments
 * Props: issues, setIssues, showAlert
 */
export default function PayFinePage({ issues, setIssues, showAlert }) {
  const [form, setForm] = useState({ issueId: "", finePaid: false, remarks: "" });
  const sel = issues.find((i) => i.id === form.issueId);
  const fineIssues = issues.filter((i) => i.fine > 0 && !i.finePaid);

  const submit = () => {
    if (!form.issueId) return;
    if (sel?.fine > 0 && !form.finePaid) {
      showAlert("Please check 'Fine Paid' before confirming.", "error"); return;
    }
    setIssues((prev) =>
      prev.map((i) =>
        i.id === form.issueId ? { ...i, finePaid: true, remarks: form.remarks } : i
      )
    );
    showAlert("Fine payment recorded successfully! Transaction complete.");
    setForm({ issueId: "", finePaid: false, remarks: "" });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Pay Fine</div>
      </div>
      <div className="card">
        <div className="form-grid">
          <div className="form-field form-full">
            <label className="form-label required">
              Select Transaction (with pending fine)
            </label>
            <select
              className="form-select"
              value={form.issueId}
              onChange={(e) => setForm((f) => ({ ...f, issueId: e.target.value }))}
            >
              <option value="">— Select —</option>
              {fineIssues.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} — {i.bookName} — ₹{i.fine}
                </option>
              ))}
            </select>
          </div>

          {sel && (
            <>
              <div className="form-field">
                <label className="form-label">Book Name</label>
                <input className="form-input" readOnly value={sel.bookName} />
              </div>
              <div className="form-field">
                <label className="form-label">Membership ID</label>
                <input className="form-input" readOnly value={sel.membershipId} />
              </div>
              <div className="form-field">
                <label className="form-label">Issue Date</label>
                <input className="form-input" readOnly value={sel.issueDate} />
              </div>
              <div className="form-field">
                <label className="form-label">Return Date (planned)</label>
                <input className="form-input" readOnly value={sel.returnDate} />
              </div>
              <div className="form-field">
                <label className="form-label">Actual Return Date</label>
                <input
                  className="form-input"
                  readOnly
                  value={sel.actualReturnDate || "Not yet returned"}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Fine Calculated</label>
                <input
                  className="form-input"
                  readOnly
                  value={sel.fine > 0 ? `₹${sel.fine}` : "—"}
                />
              </div>
              <div className="form-field form-full">
                <label className="radio-opt">
                  <input
                    type="checkbox"
                    checked={form.finePaid}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, finePaid: e.target.checked }))
                    }
                  />
                  Fine Paid (check this to confirm payment of ₹{sel.fine})
                </label>
              </div>
              <div className="form-field form-full">
                <label className="form-label">Remarks (optional)</label>
                <textarea
                  className="form-textarea"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, remarks: e.target.value }))
                  }
                />
              </div>
            </>
          )}
        </div>

        {fineIssues.length === 0 && (
          <div className="alert alert-success">✓ No pending fines found.</div>
        )}
        {sel && (
          <div className="btn-row">
            <button className="btn btn-rust" onClick={submit}>
              Confirm
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setForm({ issueId: "", finePaid: false, remarks: "" })}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
