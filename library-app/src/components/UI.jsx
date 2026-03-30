// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────

/**
 * Badge — displays a coloured status pill
 * Props: status (string)
 */
export function Badge({ status }) {
  const map = {
    Available: "badge-green",
    Issued: "badge-yellow",
    Lost: "badge-red",
    Damaged: "badge-gray",
    Active: "badge-green",
    Inactive: "badge-red",
    Overdue: "badge-red",
    Returned: "badge-blue",
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}

/**
 * Modal — overlay dialog wrapper
 * Props: title (string), onClose (fn), children
 */
export function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
