import { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  ShoppingBag,
  ArrowRightLeft,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { TransactionCard } from "@/components/ui/TransactionCard";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  where,
} from "firebase/firestore";
import PageLayout from "@/components/layout/PageLayout";
import { useNavigate } from "react-router-dom";
import { assignColorsToCategories } from "@/lib/chartUtils";

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [monthlyExpensesData, setMonthlyExpensesData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [pendingSettlements, setPendingSettlements] = useState(0);
  const navigate = useNavigate();

  const handleAddExpense = () => {
    navigate("/expenses?openDialog=true");
  };

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsQuery = query(
        collection(db, "expenses"),
        orderBy("date", "desc"),
        limit(3)
      );
      const querySnapshot = await getDocs(transactionsQuery);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentTransactions(transactions);
    };
    fetchTransactions();
  }, []);

  // Fetch pie chart category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenses = querySnapshot.docs.map((doc) => doc.data());

      const grouped = {};
      expenses.forEach((exp) => {
        const category = exp.category || "Other";
        const amount = parseFloat(exp.amount || 0);
        grouped[category] = (grouped[category] || 0) + amount;
      });

      setCategoryChartData(assignColorsToCategories(grouped));
    };
    fetchCategoryData();
  }, []);

  // Fetch total balance, monthly total, and bar chart data
  useEffect(() => {
    const fetchExpensesData = async () => {
      const expensesSnapshot = await getDocs(collection(db, "expenses"));
      const allExpenses = expensesSnapshot.docs.map((doc) => doc.data());

      let total = 0;
      let monthly = 0;
      const monthlyTotals = {};

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      allExpenses.forEach((exp) => {
        const dateObj = exp.date?.toDate?.() || new Date(exp.date);
        const amount = parseFloat(exp.amount || 0);

        total += amount;

        if (
          dateObj.getMonth() === currentMonth &&
          dateObj.getFullYear() === currentYear
        ) {
          monthly += amount;
        }

        const monthLabel = dateObj.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthlyTotals[monthLabel] =
          (monthlyTotals[monthLabel] || 0) + amount;
      });

      const sortedBarData = Object.entries(monthlyTotals)
        .sort(
          ([a], [b]) =>
            new Date("1 " + a).getTime() - new Date("1 " + b).getTime()
        )
        .map(([month, value]) => ({
          name: month,
          value: parseFloat(value.toFixed(2)),
        }));

      setTotalBalance(parseFloat(total.toFixed(2)));
      setMonthlyTotal(parseFloat(monthly.toFixed(2)));
      setMonthlyExpensesData(sortedBarData);
    };

    fetchExpensesData();
  }, []);

  // Fetch pending settlements
  useEffect(() => {
    const fetchPending = async () => {
      const debtsQuery = query(
        collection(db, "debts"),
        where("settled", "==", false)
      );
      const querySnapshot = await getDocs(debtsQuery);
      let pending = 0;

      querySnapshot.forEach((doc) => {
        pending += parseFloat(doc.data().amount || 0);
      });

      setPendingSettlements(parseFloat(pending.toFixed(2)));
    };

    fetchPending();
  }, []);

  return (
    <PageLayout>
      <PageHeader title="Dashboard" description="Overview of your group finances">
        <Button
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
          onClick={handleAddExpense}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-in">
        <StatCard
          title="Total Balance"
          value={`₹${totalBalance}`}
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 5.2, isPositive: totalBalance >= 0 }}
        />
        <StatCard
          title="Monthly Expenses"
          value={`₹${monthlyTotal}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2.4, isPositive: false }}
        />
        <StatCard
          title="Pending Settlements"
          value={`₹${pendingSettlements}`}
          icon={<PiggyBank className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 shadow-card border border-border/50 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/expenses")}
            >
              <Eye className="h-4 w-4 mr-1" /> View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  icon={<ShoppingBag className="h-5 w-5" />}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent transactions
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold mb-4">
              Spending by Category
            </h3>
            {categoryChartData.length > 0 ? (
              <PieChart data={categoryChartData} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No category data available
              </p>
            )}
          </Card>

          <Card className="p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
            {monthlyExpensesData.length > 0 ? (
              <BarChart data={monthlyExpensesData} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No monthly data available
              </p>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          className="py-6 bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg rounded-xl hover:shadow-xl transition-all"
          onClick={handleAddExpense}
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Expense
        </Button>
        <Button
          variant="outline"
          className="py-6 bg-white border-primary/30 shadow-sm rounded-xl hover:bg-primary/5 transition-all"
          onClick={() => navigate("/budget")}
        >
          <Eye className="mr-2 h-5 w-5" /> View Budget
        </Button>
        <Button
          variant="outline"
          className="py-6 bg-white border-primary/30 shadow-sm rounded-xl hover:bg-primary/5 transition-all"
          onClick={() => navigate("/debt-tracker")}
        >
          <ArrowRightLeft className="mr-2 h-5 w-5" /> Settle Payments
        </Button>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
