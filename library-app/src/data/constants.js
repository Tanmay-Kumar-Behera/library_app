// ─── SEED DATA ────────────────────────────────────────────────────────────────

export const INITIAL_USERS = [
  { id: 1, name: "Admin", username: "adm", password: "adm", isAdmin: true, isActive: true },
  { id: 2, name: "User One", username: "user", password: "user", isAdmin: false, isActive: true },
];

export const CATEGORIES = [
  "Science",
  "Economics",
  "Fiction",
  "Children",
  "Personal Development",
];

export const INITIAL_BOOKS = [
  { id: "SC(B)000001", name: "A Brief History of Time", author: "Stephen Hawking", category: "Science", type: "book", status: "Available", cost: 450, procurementDate: "2020-01-15", quantity: 3 },
  { id: "SC(B)000002", name: "The Selfish Gene", author: "Richard Dawkins", category: "Science", type: "book", status: "Available", cost: 380, procurementDate: "2020-03-20", quantity: 2 },
  { id: "EC(B)000001", name: "The Wealth of Nations", author: "Adam Smith", category: "Economics", type: "book", status: "Available", cost: 520, procurementDate: "2019-06-10", quantity: 4 },
  { id: "EC(B)000002", name: "Thinking Fast and Slow", author: "Daniel Kahneman", category: "Economics", type: "book", status: "Available", cost: 490, procurementDate: "2021-02-28", quantity: 2 },
  { id: "FC(B)000001", name: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", type: "book", status: "Available", cost: 300, procurementDate: "2018-11-05", quantity: 5 },
  { id: "FC(B)000002", name: "1984", author: "George Orwell", category: "Fiction", type: "book", status: "Issued", cost: 280, procurementDate: "2018-11-05", quantity: 3 },
  { id: "CH(B)000001", name: "Charlotte's Web", author: "E.B. White", category: "Children", type: "book", status: "Available", cost: 200, procurementDate: "2022-01-10", quantity: 6 },
  { id: "PD(B)000001", name: "Atomic Habits", author: "James Clear", category: "Personal Development", type: "book", status: "Available", cost: 420, procurementDate: "2021-09-14", quantity: 4 },
  { id: "SC(M)000001", name: "Cosmos", author: "Carl Sagan", category: "Science", type: "movie", status: "Available", cost: 350, procurementDate: "2020-05-20", quantity: 2 },
  { id: "FC(M)000001", name: "Inception", author: "Christopher Nolan", category: "Fiction", type: "movie", status: "Available", cost: 400, procurementDate: "2021-07-01", quantity: 3 },
];

export const INITIAL_MEMBERSHIPS = [
  { id: "MEM001", firstName: "Arjun", lastName: "Sharma", contactNumber: "9876543210", contactAddress: "12, MG Road, Kolkata", aadharCardNo: "1234-5678-9012", startDate: "2024-01-01", endDate: "2024-12-31", duration: "1year", isActive: true, amountPending: 0 },
  { id: "MEM002", firstName: "Priya", lastName: "Patel", contactNumber: "8765432109", contactAddress: "45, Park Street, Mumbai", aadharCardNo: "2345-6789-0123", startDate: "2024-03-01", endDate: "2024-08-31", duration: "6months", isActive: true, amountPending: 50 },
  { id: "MEM003", firstName: "Rahul", lastName: "Verma", contactNumber: "7654321098", contactAddress: "78, Civil Lines, Delhi", aadharCardNo: "3456-7890-1234", startDate: "2023-06-01", endDate: "2025-05-31", duration: "2years", isActive: true, amountPending: 0 },
];

export const INITIAL_ISSUES = [
  { id: "ISS001", bookId: "FC(B)000002", bookName: "1984", membershipId: "MEM001", issueDate: "2026-03-10", returnDate: "2026-03-25", actualReturnDate: null, remarks: "", fine: 1000, finePaid: false, status: "Active" },
  { id: "ISS002", bookId: "EC(B)000001", bookName: "The Wealth of Nations", membershipId: "MEM002", issueDate: "2026-02-15", returnDate: "2026-03-01", actualReturnDate: null, remarks: "", fine: 145, finePaid: false, status: "Overdue" },
];
