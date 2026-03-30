// ─── DATE UTILITIES ────────────────────────────────────────────────────────────

export const today = () => new Date().toISOString().split("T")[0];

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const diffDays = (a, b) =>
  Math.floor((new Date(a) - new Date(b)) / 86400000);

export const durationToEnd = (start, dur) => {
  const d = new Date(start);
  if (dur === "6months") d.setMonth(d.getMonth() + 6);
  else if (dur === "1year") d.setFullYear(d.getFullYear() + 1);
  else d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().split("T")[0];
};

// ─── ID GENERATORS ─────────────────────────────────────────────────────────────

export const generateBookId = (books, category, type) => {
  const prefix = {
    Science: "SC",
    Economics: "EC",
    Fiction: "FC",
    Children: "CH",
    "Personal Development": "PD",
  }[category] || "XX";
  const typeCode = type === "book" ? "B" : "M";
  const count = books.filter((b) => b.category === category && b.type === type).length + 1;
  return `${prefix}(${typeCode})${String(count).padStart(6, "0")}`;
};

export const generateMembershipId = (memberships) =>
  "MEM" + String(memberships.length + 1).padStart(3, "0");

export const generateIssueId = (issues) =>
  "ISS" + String(issues.length + 1).padStart(3, "0");
