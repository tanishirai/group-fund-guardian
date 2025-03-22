
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Settings } from "lucide-react";
import { budgets, categoryData } from "@/lib/data";
import { PieChart } from "@/components/charts/PieChart";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Budget() {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  
  // Calculate total spent and percentage
  const totalBudget = budgets.monthly;
  const totalSpent = Object.values(budgets.categories).reduce(
    (acc, { spent }) => acc + spent,
    0
  );
  const spentPercentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const toggleBudgetForm = () => {
    setShowBudgetForm(!showBudgetForm);
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
        <BudgetForm onCancel={toggleBudgetForm} />
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
                  // Remove the indicatorClassName prop
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
                {Object.entries(budgets.categories).map(([category, { allocated, spent }]) => {
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
                        // Remove the indicatorClassName prop
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

function BudgetForm({ onCancel }: { onCancel: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Set your monthly budget and category limits to help track your expenses.
        </p>
        <div className="space-y-6">
          {/* Form fields would go here */}
          <p className="italic text-muted-foreground">Budget form implementation coming soon...</p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button>Save Budget</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
