import { useState } from "react";
import { today, generateBookId } from "../utils/helpers";
import { CATEGORIES } from "../data/constants";

// ─── ADD BOOK / MOVIE ─────────────────────────────────────────────────────────

/**
 * AddBookPage — add new books or movies to inventory
 * Props: books, setBooks, showAlert
 */
export function AddBookPage({ books, setBooks, showAlert }) {
  const blank = {
    type: "book",
    name: "",
    author: "",
    category: CATEGORIES[0],
    procurementDate: today(),
    quantity: 1,
    cost: "",
  };
  const [form, setForm] = useState(blank);
  const [err, setErr]   = useState("");

  const submit = () => {
    if (!form.name || !form.author || !form.cost) {
      setErr("All fields are required."); return;
    }
    const baseId = generateBookId(books, form.category, form.type);
    for (let i = 0; i < form.quantity; i++) {
      setBooks((prev) => [
        ...prev,
        {
          ...form,
          id: `${baseId}-${i + 1}`,
          status: "Available",
          cost: Number(form.cost),
        },
      ]);
    }
    showAlert(`"${form.name}" added as ${form.type} (${form.quantity} copies).`);
    setForm(blank);
    setErr("");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Add Book / Movie</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-field" style={{ marginBottom: 20 }}>
          <label className="form-label required">Type</label>
          <div className="radio-group">
            <label className="radio-opt">
              <input
                type="radio"
                name="type"
                value="book"
                checked={form.type === "book"}
                onChange={() => setForm((f) => ({ ...f, type: "book" }))}
              />
              📖 Book
            </label>
            <label className="radio-opt">
              <input
                type="radio"
                name="type"
                value="movie"
                checked={form.type === "movie"}
                onChange={() => setForm((f) => ({ ...f, type: "movie" }))}
              />
              🎬 Movie
            </label>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Author / Director</label>
            <input
              className="form-input"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label required">Date of Procurement</label>
            <input
              className="form-input"
              type="date"
              value={form.procurementDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, procurementDate: e.target.value }))
              }
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Quantity / Copies</label>
            <input
              className="form-input"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
            />
          </div>
          <div className="form-field">
            <label className="form-label required">Cost (₹)</label>
            <input
              className="form-input"
              type="number"
              value={form.cost}
              onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
            />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Add {form.type === "book" ? "Book" : "Movie"}
          </button>
          <button className="btn btn-outline" onClick={() => setForm(blank)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UPDATE BOOK / MOVIE ──────────────────────────────────────────────────────

/**
 * UpdateBookPage — change status or details of existing books/movies
 * Props: books, setBooks, showAlert
 */
export function UpdateBookPage({ books, setBooks, showAlert }) {
  const [type, setType]   = useState("book");
  const [bookId, setBookId] = useState("");
  const [status, setStatus] = useState("Available");
  const [date, setDate]     = useState(today());
  const [err, setErr]       = useState("");

  const filtered = books.filter((b) => b.type === type);
  const sel      = books.find((b) => b.id === bookId);

  const submit = () => {
    if (!bookId) { setErr("Please select a book / movie."); return; }
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, status, procurementDate: date } : b
      )
    );
    showAlert(`"${sel?.name}" updated successfully.`);
    setBookId(""); setErr("");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Update Book / Movie</div>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <div className="card">
        <div className="form-field" style={{ marginBottom: 20 }}>
          <label className="form-label">Type</label>
          <div className="radio-group">
            <label className="radio-opt">
              <input
                type="radio"
                name="utype"
                value="book"
                checked={type === "book"}
                onChange={() => { setType("book"); setBookId(""); }}
              />
              📖 Book
            </label>
            <label className="radio-opt">
              <input
                type="radio"
                name="utype"
                value="movie"
                checked={type === "movie"}
                onChange={() => { setType("movie"); setBookId(""); }}
              />
              🎬 Movie
            </label>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label required">Book / Movie Name</label>
            <select
              className="form-select"
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value);
                const b = books.find((x) => x.id === e.target.value);
                if (b) { setStatus(b.status); setDate(b.procurementDate); }
              }}
            >
              <option value="">— Select —</option>
              {filtered.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Serial No</label>
            <input className="form-input" readOnly value={bookId} />
          </div>
          <div className="form-field">
            <label className="form-label required">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["Available", "Issued", "Lost", "Damaged"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label required">Date</label>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-rust" onClick={submit}>
            Update
          </button>
          <button
            className="btn btn-outline"
            onClick={() => { setBookId(""); setErr(""); }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
