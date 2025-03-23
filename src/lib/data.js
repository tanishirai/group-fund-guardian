
// Mock data for members
export const members = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    contributed: 1250.75,
    owed: 425.50
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    contributed: 980.25,
    owed: 0
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.j@example.com",
    contributed: 540.00,
    owed: 215.75
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    contributed: 1875.50,
    owed: 300.25
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex.b@example.com",
    contributed: 325.75,
    owed: 650.00
  }
];

// Mock data for categories in charts
export const categoryData = [
  { name: "Food & Dining", value: 450, color: "#4f46e5" },
  { name: "Entertainment", value: 300, color: "#06b6d4" },
  { name: "Transportation", value: 200, color: "#8b5cf6" },
  { name: "Shopping", value: 350, color: "#ec4899" },
  { name: "Bills & Utilities", value: 500, color: "#f59e0b" }
];

// Mock data for monthly expenses
export const monthlyExpensesData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1400 },
  { name: "Mar", value: 1100 },
  { name: "Apr", value: 1300 },
  { name: "May", value: 1500 },
  { name: "Jun", value: 1700 }
];

// Mock data for transactions
export const transactions = [
  {
    id: "tx1",
    title: "Dinner at Italian Restaurant",
    amount: 120.75,
    category: "Food & Dining",
    paidBy: "John Doe",
    date: "May 15, 2023",
    split: {
      type: "Equal"
    }
  },
  {
    id: "tx2",
    title: "Movie Tickets",
    amount: 45.50,
    category: "Entertainment",
    paidBy: "Jane Smith",
    date: "May 12, 2023",
    split: {
      type: "Equal"
    }
  },
  {
    id: "tx3",
    title: "Grocery Shopping",
    amount: 89.25,
    category: "Food & Dining",
    paidBy: "Mike Johnson",
    date: "May 10, 2023",
    split: {
      type: "Equal"
    }
  },
  {
    id: "tx4",
    title: "Uber Ride",
    amount: 35.00,
    category: "Transportation",
    paidBy: "Sarah Williams",
    date: "May 8, 2023",
    split: {
      type: "Custom",
      details: {
        "John": 15.00,
        "Sarah": 20.00
      }
    }
  },
  {
    id: "tx5",
    title: "Amazon Purchase",
    amount: 129.99,
    category: "Shopping",
    paidBy: "Alex Brown",
    date: "May 5, 2023",
    split: {
      type: "Equal"
    }
  }
];

// Adding groups data from data.ts
export const groups = [
  {
    id: "g1",
    name: "Roommates",
    members: ["John Doe", "Jane Smith", "Mike Johnson"],
    balance: 2450.00,
    expenses: ["tr1", "tr2", "tr3"]
  },
  {
    id: "g2",
    name: "Road Trip",
    members: ["John Doe", "Sarah Wilson", "David Brown"],
    balance: 850.75,
    expenses: ["tr4"]
  },
  {
    id: "g3",
    name: "Family",
    members: ["John Doe", "Emma Doe", "Oliver Doe"],
    balance: 320.50,
    expenses: ["tr5"]
  }
];

// Adding remaining data from data.ts for completeness
export const debts = [
  {
    id: "d1",
    from: "John Doe",
    to: "Jane Smith",
    amount: 450.20,
    description: "Share of May expenses"
  },
  {
    id: "d2",
    from: "Mike Johnson",
    to: "Jane Smith",
    amount: 720.15,
    description: "Share of rent and utilities"
  },
  {
    id: "d3",
    from: "Sarah Wilson",
    to: "John Doe",
    amount: 63.22,
    description: "Groceries"
  },
  {
    id: "d4",
    from: "David Brown",
    to: "John Doe",
    amount: 63.21,
    description: "Groceries"
  }
];

export const budgets = {
  monthly: 3000.00,
  categories: {
    Food: { allocated: 600.00, spent: 314.45 },
    Housing: { allocated: 1800.00, spent: 1800.00 },
    Utilities: { allocated: 300.00, spent: 235.40 },
    Entertainment: { allocated: 200.00, spent: 45.00 },
    Transportation: { allocated: 150.00, spent: 120.30 }
  }
};

export const notifications = [
  {
    id: "n1",
    title: "New expense added",
    description: "Jane added a new expense 'Dinner at Italian Restaurant'",
    date: "June 12, 2023",
    read: false
  },
  {
    id: "n2",
    title: "Settlement request",
    description: "Jane requested a settlement of $450.20",
    date: "June 10, 2023",
    read: false
  },
  {
    id: "n3",
    title: "Budget alert",
    description: "You've reached 90% of your Food budget for this month",
    date: "June 8, 2023",
    read: true
  },
  {
    id: "n4",
    title: "New member",
    description: "Sarah joined the 'Road Trip' group",
    date: "June 5, 2023",
    read: true
  }
];
