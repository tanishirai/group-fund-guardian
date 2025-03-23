
import { useState } from "react";
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  ShoppingBag, 
  ArrowRightLeft,
  Plus, 
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { TransactionCard } from "@/components/ui/TransactionCard";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { transactions, categoryData, monthlyExpensesData } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState(transactions.slice(0, 3));

  return (
    <PageLayout>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your group finances"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-in">
        <StatCard 
          title="Total Balance" 
          value="$3,621.25" 
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard 
          title="Monthly Expenses" 
          value="$2,514.80" 
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2.4, isPositive: false }}
        />
        <StatCard 
          title="Pending Settlements" 
          value="$1,296.78" 
          icon={<PiggyBank className="h-5 w-5" />}
        />
      </div>

      {/* Recent Transactions & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Transactions */}
        <Card className="p-6 shadow-card border border-border/50 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Eye className="h-4 w-4 mr-1" /> View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction} 
                icon={<ShoppingBag className="h-5 w-5" />} 
              />
            ))}
          </div>
        </Card>

        {/* Charts */}
        <div className="space-y-8">
          {/* Category Distribution */}
          <Card className="p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <PieChart data={categoryData} />
          </Card>

          {/* Monthly Trends */}
          <Card className="p-6 shadow-card border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
            <BarChart data={monthlyExpensesData} />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button 
          className="py-6 bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg rounded-xl hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Expense
        </Button>
        <Button 
          variant="outline" 
          className="py-6 bg-white border-primary/30 shadow-sm rounded-xl hover:bg-primary/5 transition-all"
        >
          <Eye className="mr-2 h-5 w-5" /> View Budget
        </Button>
        <Button 
          variant="outline" 
          className="py-6 bg-white border-primary/30 shadow-sm rounded-xl hover:bg-primary/5 transition-all"
        >
          <ArrowRightLeft className="mr-2 h-5 w-5" /> Settle Payments
        </Button>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
