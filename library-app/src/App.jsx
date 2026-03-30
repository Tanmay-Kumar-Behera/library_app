import { useState } from "react";

// ── Styles ────────────────────────────────────────────────────────────────────
import "./styles/global.css";

// ── Data & Utilities ──────────────────────────────────────────────────────────
import {
  INITIAL_USERS,
  INITIAL_BOOKS,
  INITIAL_MEMBERSHIPS,
  INITIAL_ISSUES,
} from "./data/constants";

// ── Layout Components ─────────────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";

// ── Pages ─────────────────────────────────────────────────────────────────────
import LoginPage            from "./pages/LoginPage";
import HomePage             from "./pages/HomePage";
import BookAvailablePage    from "./pages/BookAvailablePage";
import IssueBookPage        from "./pages/IssueBookPage";
import ReturnBookPage       from "./pages/ReturnBookPage";
import PayFinePage          from "./pages/PayFinePage";
import UserManagementPage   from "./pages/UserManagementPage";

import {
  MasterListPage,
  MembershipsPage,
  ActiveIssuesPage,
  OverdueReturnsPage,
  IssueRequestsPage,
} from "./pages/ReportPages";

import {
  MaintenancePage,
  AddMembershipPage,
  UpdateMembershipPage,
} from "./pages/MaintenancePages";

import { AddBookPage, UpdateBookPage } from "./pages/BookPages";

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Global state ────────────────────────────────────────────────────────────
  const [currentUser,  setCurrentUser]  = useState(null);
  const [page,         setPage]         = useState("home");
  const [books,        setBooks]        = useState(INITIAL_BOOKS);
  const [memberships,  setMemberships]  = useState(INITIAL_MEMBERSHIPS);
  const [users,        setUsers]        = useState(INITIAL_USERS);
  const [issues,       setIssues]       = useState(INITIAL_ISSUES);
  const [alert_,       setAlert]        = useState(null);

  // ── Alert helper ─────────────────────────────────────────────────────────
  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // ── Guard: show login if not authenticated ───────────────────────────────
  if (!currentUser) {
    return <LoginPage users={users} onLogin={setCurrentUser} />;
  }

  const isAdmin = currentUser.isAdmin;

  // ── Shared context passed to every page ─────────────────────────────────
  const ctx = {
    books, setBooks,
    memberships, setMemberships,
    users, setUsers,
    issues, setIssues,
    showAlert,
    isAdmin,
    currentUser, setCurrentUser,
    setPage,
  };

  // ── Navigation definition ────────────────────────────────────────────────
  const nav = [
    { key: "home",           label: "Dashboard",         icon: "⊞",  section: "Overview" },
    { key: "transactions",   label: "Transactions",      icon: "⇄",  section: "Transactions" },
    { key: "bookAvailable",  label: "Book Availability", icon: "◉"  },
    { key: "issueBook",      label: "Issue Book",        icon: "↗"  },
    { key: "returnBook",     label: "Return Book",       icon: "↩"  },
    { key: "payFine",        label: "Pay Fine",          icon: "₹"  },
    { key: "reports",        label: "Reports",           icon: "📊", section: "Reports" },
    { key: "masterBooks",    label: "Books List",        icon: "📖" },
    { key: "masterMovies",   label: "Movies List",       icon: "🎬" },
    { key: "memberships",    label: "Memberships",       icon: "👤" },
    { key: "activeIssues",   label: "Active Issues",     icon: "📌" },
    { key: "overdueReturns", label: "Overdue Returns",   icon: "⚠"  },
    { key: "issueRequests",  label: "Issue Requests",    icon: "📋" },
    ...(isAdmin
      ? [
          { key: "maintenance",      label: "Maintenance",       icon: "⚙",  section: "Maintenance" },
          { key: "addMembership",    label: "Add Membership",    icon: "➕" },
          { key: "updateMembership", label: "Update Membership", icon: "✏"  },
          { key: "addBook",          label: "Add Book/Movie",    icon: "➕" },
          { key: "updateBook",       label: "Update Book/Movie", icon: "✏"  },
          { key: "userManagement",   label: "User Management",   icon: "👥" },
        ]
      : []),
  ];

  // ── Page map ─────────────────────────────────────────────────────────────
  const pages = {
    home:             <HomePage             {...ctx} />,
    transactions:     <ActiveIssuesPage     {...ctx} />,   // reuse active issues as "transactions"
    bookAvailable:    <BookAvailablePage    {...ctx} />,
    issueBook:        <IssueBookPage        {...ctx} />,
    returnBook:       <ReturnBookPage       {...ctx} />,
    payFine:          <PayFinePage          {...ctx} />,
    reports:          <ActiveIssuesPage     {...ctx} />,   // overview — same data, different entry
    masterBooks:      <MasterListPage       {...ctx} type="book"  />,
    masterMovies:     <MasterListPage       {...ctx} type="movie" />,
    memberships:      <MembershipsPage      {...ctx} />,
    activeIssues:     <ActiveIssuesPage     {...ctx} />,
    overdueReturns:   <OverdueReturnsPage   {...ctx} />,
    issueRequests:    <IssueRequestsPage    {...ctx} />,
    maintenance:      <MaintenancePage      setPage={setPage} />,
    addMembership:    <AddMembershipPage    {...ctx} />,
    updateMembership: <UpdateMembershipPage {...ctx} />,
    addBook:          <AddBookPage          {...ctx} />,
    updateBook:       <UpdateBookPage       {...ctx} />,
    userManagement:   <UserManagementPage   {...ctx} />,
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="topbar">
        <span className="topbar-brand">📚 Library Management System</span>
        <span className="topbar-user">
          Logged in as <strong>{currentUser.name}</strong>
        </span>
        {isAdmin && <span className="topbar-badge">ADMIN</span>}
        <button className="topbar-btn" onClick={() => setCurrentUser(null)}>
          Log Out
        </button>
      </header>

      {/* ── Shell: sidebar + main ─────────────────────────────────────────── */}
      <div className="shell">
        <Sidebar nav={nav} page={page} setPage={setPage} />

        <main className="main">
          {/* Global alert banner */}
          {alert_ && (
            <div className={`alert alert-${alert_.type}`}>{alert_.msg}</div>
          )}

          {/* Active page */}
          {pages[page] ?? pages.home}
        </main>
      </div>
    </div>
  );
}
