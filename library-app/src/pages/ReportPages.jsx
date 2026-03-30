import { useState, useMemo } from "react";
import { Badge } from "../components/UI";
import { today, diffDays } from "../utils/helpers";

// ─── MASTER LIST ──────────────────────────────────────────────────────────────

/**
 * MasterListPage — list all books or movies
 * Props: books, type ("book" | "movie")
 */
export function MasterListPage({ books, type }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          b.type === type &&
          (b.name.toLowerCase().includes(q.toLowerCase()) ||
            b.author.toLowerCase().includes(q.toLowerCase()))
      ),
    [books, type, q]
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          Master List of {type === "book" ? "Books" : "Movies"}
        </div>
      </div>
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by name or author..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Cost (₹)</th>
                <th>Procurement Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td><code style={{ fontSize: 12 }}>{b.id}</code></td>
                  <td><strong>{b.name}</strong></td>
                  <td>{b.author}</td>
                  <td><span className="badge badge-blue">{b.category}</span></td>
                  <td><Badge status={b.status} /></td>
                  <td>₹{b.cost}</td>
                  <td>{b.procurementDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted" style={{ padding: 32 }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBERSHIPS ──────────────────────────────────────────────────────────────

/**
 * MembershipsPage — list all memberships
 * Props: memberships
 */
export function MembershipsPage({ memberships }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      memberships.filter(
        (m) =>
          m.id.toLowerCase().includes(q.toLowerCase()) ||
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q.toLowerCase())
      ),
    [memberships, q]
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Master List of Memberships</div>
      </div>
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by ID or name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Membership ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Aadhar</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Fine Pending</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td><code style={{ fontSize: 12 }}>{m.id}</code></td>
                  <td><strong>{m.firstName} {m.lastName}</strong></td>
                  <td>{m.contactNumber}</td>
                  <td
                    style={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.contactAddress}
                  </td>
                  <td><code style={{ fontSize: 12 }}>{m.aadharCardNo}</code></td>
                  <td>{m.startDate}</td>
                  <td>{m.endDate}</td>
                  <td><Badge status={m.isActive ? "Active" : "Inactive"} /></td>
                  <td>
                    {m.amountPending > 0 ? (
                      <span className="badge badge-red">₹{m.amountPending}</span>
                    ) : (
                      <span className="badge badge-green">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted" style={{ padding: 32 }}>
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVE ISSUES ────────────────────────────────────────────────────────────

/**
 * ActiveIssuesPage — all currently issued items
 * Props: issues
 */
export function ActiveIssuesPage({ issues }) {
  const active = issues.filter((i) => i.status === "Active");

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Active Issues</div>
        <div className="page-sub">{active.length} currently issued item(s)</div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Serial No (Book/Movie)</th>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {active.map((i) => {
                const overdue = i.returnDate < today();
                return (
                  <tr key={i.id}>
                    <td><code style={{ fontSize: 12 }}>{i.id}</code></td>
                    <td><code style={{ fontSize: 12 }}>{i.bookId}</code></td>
                    <td>{i.bookName}</td>
                    <td>{i.membershipId}</td>
                    <td>{i.issueDate}</td>
                    <td style={{ color: overdue ? "var(--rust)" : "inherit" }}>
                      {i.returnDate}{overdue && " ⚠"}
                    </td>
                    <td><Badge status={overdue ? "Overdue" : "Active"} /></td>
                  </tr>
                );
              })}
              {active.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted" style={{ padding: 32 }}>
                    No active issues
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── OVERDUE RETURNS ──────────────────────────────────────────────────────────

/**
 * OverdueReturnsPage — overdue items with estimated fine
 * Props: issues
 */
export function OverdueReturnsPage({ issues }) {
  const overdue = issues.filter(
    (i) => i.status === "Active" && i.returnDate < today()
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Overdue Returns</div>
        <div className="page-sub">{overdue.length} overdue item(s)</div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Serial No</th>
                <th>Book Name</th>
                <th>Membership ID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Est. Fine</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((i) => {
                const days = diffDays(today(), i.returnDate);
                return (
                  <tr key={i.id}>
                    <td><code style={{ fontSize: 12 }}>{i.id}</code></td>
                    <td><code style={{ fontSize: 12 }}>{i.bookId}</code></td>
                    <td>{i.bookName}</td>
                    <td>{i.membershipId}</td>
                    <td>{i.issueDate}</td>
                    <td style={{ color: "var(--rust)" }}>{i.returnDate}</td>
                    <td><span className="badge badge-red">{days} days</span></td>
                    <td><strong>₹{days * 10}</strong></td>
                  </tr>
                );
              })}
              {overdue.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted" style={{ padding: 32 }}>
                    🎉 No overdue returns!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ISSUE REQUESTS ───────────────────────────────────────────────────────────

/**
 * IssueRequestsPage — pending issue requests
 * Props: memberships, books
 */
export function IssueRequestsPage() {
  const [requests] = useState([
    { id: "REQ001", membershipId: "MEM001", bookName: "The Great Gatsby", requestedDate: "2026-03-28", fulfilledDate: null },
    { id: "REQ002", membershipId: "MEM003", bookName: "Sapiens", requestedDate: "2026-03-29", fulfilledDate: null },
  ]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Pending Issue Requests</div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Membership ID</th>
                <th>Book / Movie Name</th>
                <th>Requested Date</th>
                <th>Fulfilled Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td><code style={{ fontSize: 12 }}>{r.id}</code></td>
                  <td>{r.membershipId}</td>
                  <td>{r.bookName}</td>
                  <td>{r.requestedDate}</td>
                  <td>
                    {r.fulfilledDate || (
                      <span className="text-muted">Pending</span>
                    )}
                  </td>
                  <td>
                    <Badge status={r.fulfilledDate ? "Available" : "Issued"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
