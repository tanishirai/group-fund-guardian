
import { 
  PieChart as PieChartIcon, 
  DollarSign, 
  BarChart as BarChartIcon,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { categoryData, monthlyExpensesData, budgets } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";

const Budget = () => {
  // Calculate total spent
  const totalSpent = Object.values(budgets.categories).reduce(
    (sum, category) => sum + category.spent, 
    0
  );

  // Calculate budget remaining
  const remaining = budgets.monthly - totalSpent;
  const percentSpent = (totalSpent / budgets.monthly) * 100;

  // Format category data for charts
  const categoryChartData = Object.entries(budgets.categories).map(([name, data]) => ({
    name,
    value: data.spent,
    color: categoryData.find(cat => cat.name === name)?.color || "#000000"
  }));

  return (
    <PageLayout>
      <PageHeader 
        title="Budget & Analytics" 
        description="Track your spending and analyze financial patterns"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
        >
          <DollarSign className="mr-2 h-4 w-4" /> Set Budget
        </Button>
      </PageHeader>

      {/* Budget Overview Card */}
      <Card className="p-6 mb-8 border shadow-card animate-slide-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-lg font-semibold mb-1">Monthly Budget Overview</h3>
            <p className="text-muted-foreground">
              {remaining >= 0 
                ? `You still have $${remaining.toFixed(2)} left to spend` 
                : `You've exceeded your budget by $${Math.abs(remaining).toFixed(2)}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">${totalSpent.toFixed(2)}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">${budgets.monthly.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>
              {percentSpent <= 100 
                ? `${Math.round(percentSpent)}% spent` 
                : "Budget exceeded"}
            </span>
            <span className={cn(
              remaining >= 0 ? "text-positive" : "text-negative", 
              "font-medium"
            )}>
              {remaining >= 0 
                ? `$${remaining.toFixed(2)} remaining` 
                : `$${Math.abs(remaining).toFixed(2)} over budget`}
            </span>
          </div>
          <Progress 
            value={Math.min(percentSpent, 100)} 
            className={cn(
              "h-2",
              percentSpent > 90 ? "bg-negative/20" : "bg-muted"
            )}
            indicatorClassName={cn(
              percentSpent > 90 ? "bg-negative" : "bg-primary"
            )}
          />
        </div>
      </Card>

      {/* Category Budgets & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Budgets */}
        <Card className="p-6 border shadow-card">
          <h3 className="text-lg font-semibold mb-4">Category Budgets</h3>
          
          <div className="space-y-5">
            {Object.entries(budgets.categories).map(([category, { allocated, spent }]) => {
              const percentUsed = (spent / allocated) * 100;
              const isOverBudget = spent > allocated;
              
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium">{category}</span>
                      {isOverBudget ? (
                        <AlertCircle className="ml-2 h-4 w-4 text-negative" />
                      ) : percentUsed > 90 ? (
                        <AlertCircle className="ml-2 h-4 w-4 text-warning" />
                      ) : (
                        <CheckCircle2 className="ml-2 h-4 w-4 text-positive" />
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">${spent.toFixed(2)}</span>
                      <span className="text-muted-foreground"> / ${allocated.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={Math.min(percentUsed, 100)} 
                    className={cn(
                      "h-2",
                      isOverBudget 
                        ? "bg-negative/20" 
                        : percentUsed > 90 
                          ? "bg-warning/20" 
                          : "bg-muted"
                    )}
                    indicatorClassName={cn(
                      isOverBudget 
                        ? "bg-negative" 
                        : percentUsed > 90 
                          ? "bg-warning" 
                          : "bg-primary"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Spending Distribution Chart */}
        <Card className="p-6 border shadow-card">
          <h3 className="text-lg font-semibold mb-4">Spending Distribution</h3>
          <PieChart data={categoryChartData} />
        </Card>
      </div>

      {/* Monthly Trends Chart */}
      <Card className="p-6 border shadow-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">Monthly Expense Trends</h3>
        <div className="h-80">
          <BarChart data={monthlyExpensesData} />
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-xl font-semibold mt-1">
              ${(monthlyExpensesData.reduce((sum, item) => sum + item.value, 0) / monthlyExpensesData.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">This month</p>
            <div className="flex items-center mt-1">
              <p className="text-xl font-semibold">
                ${monthlyExpensesData[monthlyExpensesData.length - 1].value.toFixed(2)}
              </p>
              {monthlyExpensesData[monthlyExpensesData.length - 1].value > 
               monthlyExpensesData[monthlyExpensesData.length - 2].value ? (
                <ArrowUp className="ml-2 h-4 w-4 text-negative" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4 text-positive" />
              )}
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Highest</p>
            <p className="text-xl font-semibold mt-1">
              ${Math.max(...monthlyExpensesData.map(item => item.value)).toFixed(2)}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Lowest</p>
            <p className="text-xl font-semibold mt-1">
              ${Math.min(...monthlyExpensesData.map(item => item.value)).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Budget;
