
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Settings } from "lucide-react";
import { budgets, categoryData } from "@/lib/data";
import { PieChart } from "@/components/charts/PieChart";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import BudgetForm from "@/components/BudgetForm";
import { toast } from "sonner";

export default function Budget() {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetData, setBudgetData] = useState(budgets);
  
  // Calculate total spent and percentage
  const totalBudget = budgetData.monthly;
  const totalSpent = Object.values(budgetData.categories).reduce(
    (acc, { spent }) => acc + spent,
    0
  );
  const spentPercentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const toggleBudgetForm = () => {
    setShowBudgetForm(!showBudgetForm);
  };
  
  const handleSaveBudget = (values: any) => {
    // Create a new budget object that maintains spent values but updates allocations
    const updatedCategories = Object.entries(values.categories).reduce((acc, [category, { allocated }]) => {
      acc[category] = {
        allocated: allocated as number,
        spent: budgetData.categories[category]?.spent || 0
      };
      return acc;
    }, {} as typeof budgetData.categories);
    
    const updatedBudget = {
      monthly: values.monthly,
      categories: updatedCategories
    };
    
    setBudgetData(updatedBudget);
    setShowBudgetForm(false);
    toast.success("Budget updated successfully");
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Budget" 
        description="Manage your monthly budgets and track spending by category."
      >
        <Button onClick={toggleBudgetForm}>
          {showBudgetForm ? (
            <>Cancel</>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Set Budget
            </>
          )}
        </Button>
      </PageHeader>

      {showBudgetForm ? (
        <BudgetForm 
          onCancel={toggleBudgetForm} 
          onSave={handleSaveBudget}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Monthly Budget Overview */}
          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle>Monthly Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Total Budget</div>
                  <div className="text-sm font-medium">${totalBudget.toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Spent</div>
                  <div className="text-sm font-medium">${totalSpent.toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium">Remaining</div>
                  <div className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-primary"}`}>
                    ${remainingBudget.toFixed(2)}
                  </div>
                </div>
                <Progress 
                  value={spentPercentage} 
                  className="h-2 w-full"
                />
                <p className="mt-2 text-xs text-muted-foreground text-right">
                  {spentPercentage}% of budget used
                </p>
              </div>
              
              <Button className="w-full" onClick={toggleBudgetForm}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adjust Budget
              </Button>
            </CardContent>
          </Card>

          {/* Spending Distribution */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={categoryData} />
            </CardContent>
          </Card>

          {/* Category Budgets */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Category Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(budgetData.categories).map(([category, { allocated, spent }]) => {
                  const categoryPercentage = Math.min(Math.round((spent / allocated) * 100), 100);
                  const isOverCategoryBudget = spent > allocated;
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">{category}</div>
                        <div className="text-sm font-medium">
                          ${spent.toFixed(2)} of ${allocated.toFixed(2)}
                        </div>
                      </div>
                      <Progress 
                        value={categoryPercentage} 
                        className="h-2 w-full" 
                      />
                      <p className="mt-1 text-xs text-muted-foreground text-right">
                        {categoryPercentage}%
                        {isOverCategoryBudget && " (Over budget)"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
