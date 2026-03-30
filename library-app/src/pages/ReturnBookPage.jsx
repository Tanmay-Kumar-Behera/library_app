import { useState, useMemo } from "react";
import { today, diffDays } from "../utils/helpers";

/**
 * ReturnBookPage — return a borrowed book/movie
 * Props: books, setBooks, issues, setIssues, showAlert, setPage
 */
export default function ReturnBookPage({ books, setBooks, issues, setIssues, showAlert, setPage }) {
  const [form, setForm] = useState({
    bookId: "",
    serialNo: "",
    returnDate: today(),
    remarks: "",
  });
  const [err, setErr] = useState("");

  const matchingIssue = useMemo(() => {
    if (!form.bookId) return null;
    return issues.find((i) => i.bookId === form.bookId && i.status === "Active");
  }, [form.bookId, issues]);

  const calcFine = (issue, retDate) => {
    if (!issue) return 0;
    const late = diffDays(retDate, issue.returnDate);
    return late > 0 ? late * 10 : 0;
  };

  const fine = matchingIssue ? calcFine(matchingIssue, form.returnDate) : 0;

  const submit = () => {
    if (!form.bookId || !form.returnDate) {
      setErr("Book and return date are required."); return;
    }
    if (!matchingIssue) {
      setErr("No active issue found for this book."); return;
    }
    setIssues((prev) =>
      prev.map((i) =>
        i.id === matchingIssue.id
          ? { ...i, actualReturnDate: form.returnDate, remarks: form.remarks, fine, status: "Returned" }
          : i
      )
    );
    setBooks((prev) =>
      prev.map((b) => (b.id === form.bookId ? { ...b, status: "Available" } : b))
    );
    setForm({ bookId: "", serialNo: "", returnDate: today(), remarks: "" });
    setErr("");
    showAlert(
      fine > 0
        ? `Book returned with fine of ₹${fine}. Please proceed to Pay Fine.`
        : "Book returned successfully!"
    );
    if (fine > 0) setTimeout(() => setPage("payFine"), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Return Book / Movie</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">Book / Movie Name</label>
            <select
              className="form-select"
              value={form.bookId}
              onChange={(e) => setForm((f) => ({ ...f, bookId: e.target.value }))}
            >
              <option value="">— Select —</option>
              {books
                .filter((b) => b.status === "Issued")
                .map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Author</label>
            <textarea
              className="form-textarea"
              readOnly
              value={books.find((b) => b.id === form.bookId)?.author || ""}
              style={{ minHeight: 40 }}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Serial No</label>
            <select className="form-select" value={form.serialNo} readOnly>
              <option value="">{form.bookId ? form.bookId : "— Select Book First —"}</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Issue Date (auto)</label>
            <input
              className="form-input"
              readOnly
              value={matchingIssue?.issueDate || ""}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Return Date</label>
            <input
              className="form-input"
              type="date"
              value={form.returnDate}
              onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))}
            />
          </div>
          <div className="form-field form-full">
            <label className="form-label">Remarks (optional)</label>
            <textarea
              className="form-textarea"
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
            />
          </div>
        </div>

        {matchingIssue && (
          <div
            className={`alert ${fine > 0 ? "alert-warn" : "alert-info"}`}
            style={{ marginTop: 16 }}
          >
            {fine > 0
              ? `⚠ Late return — Fine calculated: ₹${fine} (₹10/day × ${diffDays(form.returnDate, matchingIssue.returnDate)} days)`
              : "✓ On-time return — No fine applicable."}
          </div>
        )}

        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Confirm Return
          </button>
          <button
            className="btn btn-outline"
            onClick={() =>
              setForm({ bookId: "", serialNo: "", returnDate: today(), remarks: "" })
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
