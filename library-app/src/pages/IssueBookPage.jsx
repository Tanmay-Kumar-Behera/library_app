import { useState } from "react";
import { today, addDays, generateIssueId } from "../utils/helpers";

/**
 * IssueBookPage — issue a book/movie to a member
 * Props: books, setBooks, memberships, issues, setIssues, showAlert
 */
export default function IssueBookPage({ books, setBooks, memberships, issues, setIssues, showAlert }) {
  const [form, setForm] = useState({
    bookId: "",
    membershipId: "",
    issueDate: today(),
    returnDate: addDays(today(), 15),
    remarks: "",
  });
  const [err, setErr] = useState("");

  const selectedBook   = books.find((b) => b.id === form.bookId);
  const selectedMember = memberships.find((m) => m.id === form.membershipId);

  const set = (k, v) => {
    const nf = { ...form, [k]: v };
    if (k === "issueDate") nf.returnDate = addDays(v, 15);
    setForm(nf);
  };

  const submit = () => {
    if (!form.bookId || !form.membershipId) {
      setErr("Book and Membership are required."); return;
    }
    if (!form.issueDate || form.issueDate < today()) {
      setErr("Issue date cannot be in the past."); return;
    }
    if (!selectedBook || selectedBook.status !== "Available") {
      setErr("Selected book is not available."); return;
    }
    if (!selectedMember || !selectedMember.isActive) {
      setErr("Invalid or inactive membership."); return;
    }

    const newIssue = {
      id: generateIssueId(issues),
      bookId: form.bookId,
      bookName: selectedBook.name,
      membershipId: form.membershipId,
      issueDate: form.issueDate,
      returnDate: form.returnDate,
      actualReturnDate: null,
      remarks: form.remarks,
      fine: 0,
      finePaid: false,
      status: "Active",
    };

    setIssues((prev) => [...prev, newIssue]);
    setBooks((prev) =>
      prev.map((b) => (b.id === form.bookId ? { ...b, status: "Issued" } : b))
    );
    setForm({
      bookId: "",
      membershipId: "",
      issueDate: today(),
      returnDate: addDays(today(), 15),
      remarks: "",
    });
    setErr("");
    showAlert(
      `Book "${selectedBook.name}" issued successfully to ${selectedMember.firstName} ${selectedMember.lastName}!`
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Issue Book / Movie</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">Book / Movie Name</label>
            <select
              className="form-select"
              value={form.bookId}
              onChange={(e) => set("bookId", e.target.value)}
            >
              <option value="">— Select —</option>
              {books
                .filter((b) => b.status === "Available")
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.type})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Author</label>
            <input
              className="form-input"
              readOnly
              value={selectedBook?.author || ""}
              placeholder="Auto-populated"
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Membership ID</label>
            <select
              className="form-select"
              value={form.membershipId}
              onChange={(e) => set("membershipId", e.target.value)}
            >
              <option value="">— Select Member —</option>
              {memberships
                .filter((m) => m.isActive)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.firstName} {m.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label required">Issue Date</label>
            <input
              className="form-input"
              type="date"
              value={form.issueDate}
              min={today()}
              onChange={(e) => set("issueDate", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Return Date</label>
            <input
              className="form-input"
              type="date"
              value={form.returnDate}
              max={addDays(form.issueDate, 15)}
              onChange={(e) => set("returnDate", e.target.value)}
            />
            <span className="form-hint">
              Auto-set to 15 days from issue. Can be earlier but not more than 15 days.
            </span>
          </div>
          <div className="form-field form-full">
            <label className="form-label">Remarks (optional)</label>
            <textarea
              className="form-textarea"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
            />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Issue Book
          </button>
          <button
            className="btn btn-outline"
            onClick={() =>
              setForm({
                bookId: "",
                membershipId: "",
                issueDate: today(),
                returnDate: addDays(today(), 15),
                remarks: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
