
export const transactions = [
  {
    id: "tr1",
    title: "Dinner at Italian Restaurant",
    amount: 124.80,
    category: "Food",
    paidBy: "John Doe",
    date: "June 12, 2023",
    split: {
      type: "equal",
      details: {
        "John Doe": 41.60,
        "Jane Smith": 41.60,
        "Mike Johnson": 41.60,
      }
    }
  },
  {
    id: "tr2",
    title: "Monthly Rent",
    amount: 1800.00,
    category: "Housing",
    paidBy: "Jane Smith",
    date: "June 1, 2023",
    split: {
      type: "custom",
      details: {
        "John Doe": 600.00,
        "Jane Smith": 600.00,
        "Mike Johnson": 600.00,
      }
    }
  },
  {
    id: "tr3",
    title: "Utility Bills",
    amount: 235.40,
    category: "Utilities",
    paidBy: "Mike Johnson",
    date: "May 28, 2023",
    split: {
      type: "equal",
      details: {
        "John Doe": 78.47,
        "Jane Smith": 78.47,
        "Mike Johnson": 78.46,
      }
    }
  },
  {
    id: "tr4",
    title: "Groceries",
    amount: 189.65,
    category: "Food",
    paidBy: "John Doe",
    date: "May 25, 2023",
    split: {
      type: "equal",
      details: {
        "John Doe": 63.22,
        "Jane Smith": 63.22,
        "Mike Johnson": 63.21,
      }
    }
  },
  {
    id: "tr5",
    title: "Movie Tickets",
    amount: 45.00,
    category: "Entertainment",
    paidBy: "Jane Smith",
    date: "May 20, 2023",
    split: {
      type: "equal",
      details: {
        "John Doe": 15.00,
        "Jane Smith": 15.00,
        "Mike Johnson": 15.00,
      }
    }
  }
];

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

export const categoryData = [
  { name: "Food", value: 314.45, color: "#4F46E5" },
  { name: "Housing", value: 1800.00, color: "#2DD4BF" },
  { name: "Utilities", value: 235.40, color: "#F59E0B" },
  { name: "Entertainment", value: 45.00, color: "#EC4899" },
  { name: "Transportation", value: 120.30, color: "#8B5CF6" }
];

export const monthlyExpensesData = [
  { name: "Jan", value: 2100 },
  { name: "Feb", value: 1900 },
  { name: "Mar", value: 2300 },
  { name: "Apr", value: 1850 },
  { name: "May", value: 2500 },
  { name: "Jun", value: 2400 }
];

export const members = [
  {
    id: "m1",
    name: "John Doe",
    email: "john@example.com",
    contributed: 1240.60,
    owed: 450.20
  },
  {
    id: "m2",
    name: "Jane Smith",
    email: "jane@example.com",
    contributed: 1845.00,
    owed: 720.15
  },
  {
    id: "m3",
    name: "Mike Johnson",
    email: "mike@example.com",
    contributed: 235.40,
    owed: 1150.65
  },
  {
    id: "m4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    contributed: 0.00,
    owed: 63.22
  },
  {
    id: "m5",
    name: "David Brown",
    email: "david@example.com",
    contributed: 0.00,
    owed: 63.21
  }
];

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
