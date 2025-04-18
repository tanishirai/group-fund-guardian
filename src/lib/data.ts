export const transactions = [
  {
    id: "tr1",
    title: "Dinner at Italian Restaurant",
    amount: 124.80,
    category: "Food",
    paidBy: "Tanishi Rai",
    date: "April 15, 2025",
    split: {
      type: "equal",
      details: {
        "Tanishi Rai": 41.60,
        "Aditi Mishra": 41.60,
        "Swasti Bansal": 41.60,
      }
    }
  },
  {
    id: "tr2",
    title: "Monthly Rent",
    amount: 1800.00,
    category: "Housing",
    paidBy: "Aditi Mishra",
    date: "April 1, 2025",
    split: {
      type: "custom",
      details: {
        "Tanishi Rai": 600.00,
        "Aditi Mishra": 600.00,
        "Swasti Bansal": 600.00,
      }
    }
  },
  {
    id: "tr3",
    title: "Utility Bills",
    amount: 235.40,
    category: "Utilities",
    paidBy: "Swasti Bansal",
    date: "March 28, 2025",
    split: {
      type: "equal",
      details: {
        "Tanishi Rai": 78.47,
        "Aditi Mishra": 78.47,
        "Swasti Bansal": 78.46,
      }
    }
  },
  {
    id: "tr4",
    title: "Groceries",
    amount: 189.65,
    category: "Food",
    paidBy: "Tanishi Rai",
    date: "March 25, 2025",
    split: {
      type: "equal",
      details: {
        "Tanishi Rai": 63.22,
        "Vanshika Singh": 63.22,
        "Arpit Dhiman": 63.21,
      }
    }
  },
  {
    id: "tr5",
    title: "Movie Tickets",
    amount: 45.00,
    category: "Entertainment",
    paidBy: "Aditi Mishra",
    date: "March 20, 2025",
    split: {
      type: "equal",
      details: {
        "Tanishi Rai": 15.00,
        "Aditi Mishra": 15.00,
        "Swasti Bansal": 15.00,
      }
    }
  }
];

export const groups = [
  {
    id: "g1",
    name: "Roommates",
    members: ["Tanishi Rai", "Aditi Mishra", "Swasti Bansal"],
    balance: 2450.00,
    expenses: ["tr1", "tr2", "tr3"]
  },
  {
    id: "g2",
    name: "Road Trip",
    members: ["Tanishi Rai", "Vanshika Singh", "Arpit Dhiman"],
    balance: 850.75,
    expenses: ["tr4"]
  },
  {
    id: "g3",
    name: "Family",
    members: ["Tanishi Rai", "Aditi Mishra", "Swasti Bansal"],
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
    name: "Tanishi Rai",
    email: "tanishi@example.com",
    contributed: 1240.60,
    owed: 450.20
  },
  {
    id: "m2",
    name: "Aditi Mishra",
    email: "aditi@example.com",
    contributed: 1845.00,
    owed: 720.15
  },
  {
    id: "m3",
    name: "Swasti Bansal",
    email: "swasti@example.com",
    contributed: 235.40,
    owed: 1150.65
  },
  {
    id: "m4",
    name: "Vanshika Singh",
    email: "vanshika@example.com",
    contributed: 0.00,
    owed: 63.22
  },
  {
    id: "m5",
    name: "Arpit Dhiman",
    email: "arpit@example.com",
    contributed: 0.00,
    owed: 63.21
  }
];

export const debts = [
  {
    id: "d1",
    from: "Tanishi Rai",
    to: "Aditi Mishra",
    amount: 450.20,
    description: "Share of March expenses"
  },
  {
    id: "d2",
    from: "Swasti Bansal",
    to: "Aditi Mishra",
    amount: 720.15,
    description: "Share of rent and utilities"
  },
  {
    id: "d3",
    from: "Vanshika Singh",
    to: "Tanishi Rai",
    amount: 63.22,
    description: "Groceries"
  },
  {
    id: "d4",
    from: "Arpit Dhiman",
    to: "Tanishi Rai",
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
