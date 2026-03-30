/**
 * Sidebar — left navigation panel
 * Props: nav (array), page (string), setPage (fn)
 */
export default function Sidebar({ nav, page, setPage }) {
  let currentSection = "";

  return (
    <nav className="sidebar">
      {nav.map((item) => {
        const showSection = item.section && item.section !== currentSection;
        if (showSection) currentSection = item.section;

        return (
          <div key={item.key}>
            {showSection && (
              <div className="sidebar-section">{item.section}</div>
            )}
            <div
              className={`nav-item${page === item.key ? " active" : ""}`}
              onClick={() => setPage(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
