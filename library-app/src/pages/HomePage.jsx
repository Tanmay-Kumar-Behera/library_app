import { Badge } from "../components/UI";
import { today } from "../utils/helpers";

/**
 * HomePage — dashboard with stats & quick actions
 * Props: books, memberships, issues, setPage, isAdmin
 */
export default function HomePage({ books, memberships, issues, setPage, isAdmin }) {
  const totalBooks   = books.filter((b) => b.type === "book").length;
  const totalMovies  = books.filter((b) => b.type === "movie").length;
  const activeMem    = memberships.filter((m) => m.isActive).length;
  const overdueCount = issues.filter(
    (i) => i.status === "Overdue" || (i.status === "Active" && i.returnDate < today())
  ).length;
  const activeIssues = issues.filter((i) => i.status === "Active").length;
  const recentIssues = issues.slice(-5).reverse();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Good day, welcome back 👋</div>
        <div className="page-sub">
          Here's your library snapshot for today,{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-box">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">📖 Books</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalMovies}</div>
          <div className="stat-label">🎬 Movies</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{activeMem}</div>
          <div className="stat-label">👤 Active Members</div>
        </div>
        <div className="stat-box">
          <div className="stat-value stat-accent">{overdueCount}</div>
          <div className="stat-label">⚠ Overdue Returns</div>
        </div>
      </div>

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <div className="stat-box">
          <div className="stat-value">{activeIssues}</div>
          <div className="stat-label">📌 Active Issues</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {issues.filter((i) => i.fine > 0 && !i.finePaid).length}
          </div>
          <div className="stat-label">₹ Pending Fines</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-rust" onClick={() => setPage("bookAvailable")}>
            🔍 Check Availability
          </button>
          <button className="btn btn-outline" onClick={() => setPage("issueBook")}>
            ↗ Issue Book
          </button>
          <button className="btn btn-outline" onClick={() => setPage("returnBook")}>
            ↩ Return Book
          </button>
          <button className="btn btn-outline" onClick={() => setPage("payFine")}>
            ₹ Pay Fine
          </button>
          {isAdmin && (
            <button className="btn btn-green" onClick={() => setPage("addBook")}>
              ➕ Add Book/Movie
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-green" onClick={() => setPage("addMembership")}>
              ➕ Add Member
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Transactions</div>
        {recentIssues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No transactions yet</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((i) => (
                  <tr key={i.id}>
                    <td><code style={{ fontSize: 12 }}>{i.id}</code></td>
                    <td>{i.bookName}</td>
                    <td>{i.membershipId}</td>
                    <td>{i.issueDate}</td>
                    <td>{i.returnDate}</td>
                    <td>
                      <Badge
                        status={
                          i.status === "Active" && i.returnDate < today()
                            ? "Overdue"
                            : i.status
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
