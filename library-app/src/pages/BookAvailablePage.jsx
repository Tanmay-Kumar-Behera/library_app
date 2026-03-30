import { useState, useMemo } from "react";
import { Badge } from "../components/UI";

/**
 * BookAvailablePage — search books/movies by name or author
 * Props: books
 */
export default function BookAvailablePage({ books }) {
  const [nameQ, setNameQ]     = useState("");
  const [authorQ, setAuthorQ] = useState("");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    if (!nameQ && !authorQ) return [];
    return books.filter(
      (b) =>
        (!nameQ   || b.name.toLowerCase().includes(nameQ.toLowerCase())) &&
        (!authorQ || b.author.toLowerCase().includes(authorQ.toLowerCase()))
    );
  }, [nameQ, authorQ, books]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Book Availability</div>
        <div className="page-sub">Search for books or movies by name or author</div>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Book / Movie Name</label>
            <input
              className="form-input"
              value={nameQ}
              onChange={(e) => setNameQ(e.target.value)}
              placeholder="Type to search..."
            />
          </div>
          <div className="form-field">
            <label className="form-label">Author Name</label>
            <select
              className="form-select"
              value={authorQ}
              onChange={(e) => setAuthorQ(e.target.value)}
            >
              <option value="">— Select Author —</option>
              {[...new Set(books.map((b) => b.author))].sort().map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {(nameQ || authorQ) && (
        <div className="card">
          <div className="card-title">Search Results ({results.length})</div>
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">No results found</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((b) => (
                    <tr key={b.id}>
                      <td><code style={{ fontSize: 12 }}>{b.id}</code></td>
                      <td><strong>{b.name}</strong></td>
                      <td>{b.author}</td>
                      <td>{b.category}</td>
                      <td>{b.type === "book" ? "📖 Book" : "🎬 Movie"}</td>
                      <td><Badge status={b.status} /></td>
                      <td>
                        {b.status === "Available" && (
                          <input
                            type="radio"
                            name="select-book"
                            checked={selected?.id === b.id}
                            onChange={() => setSelected(b)}
                            style={{ accentColor: "var(--rust)" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="alert alert-success">
          ✓ <strong>{selected.name}</strong> by {selected.author} is available for issue.{" "}
          Serial: <code>{selected.id}</code>
        </div>
      )}
    </div>
  );
}
