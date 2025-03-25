
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgets } from "@/lib/data";
import { ArrowRight, TrendingUp, AlertCircle } from "lucide-react";

const BudgetProgressView = () => {
  // Calculate totals and percentages
  const totalBudget = budgets.monthly;
  const totalSpent = Object.values(budgets.categories).reduce(
    (sum, category) => sum + category.spent, 
    0
  );
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Monthly Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Total Monthly Budget</span>
              <span className="font-semibold">${totalBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="font-semibold">${totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Remaining</span>
              <span className="font-semibold">${(totalBudget - totalSpent).toFixed(2)}</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{totalPercentage}%</span>
              </div>
              <Progress 
                value={totalPercentage} 
                className="h-2" 
                indicatorClassName={totalPercentage > 90 ? "bg-red-500" : "bg-primary"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(budgets.categories).map(([category, { allocated, spent }]) => {
              const percentage = Math.round((spent / allocated) * 100);
              const isOverBudget = spent > allocated;
              const isNearLimit = percentage > 90 && !isOverBudget;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center">
                      <span className="text-sm">${spent.toFixed(2)}</span>
                      <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                      <span className="text-sm">${allocated.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                      indicatorClassName={
                        isOverBudget 
                          ? "bg-red-500" 
                          : isNearLimit 
                            ? "bg-amber-500" 
                            : "bg-primary"
                      }
                    />
                    
                    {isOverBudget && (
                      <div className="flex items-center mt-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Over budget by ${(spent - allocated).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {isNearLimit && (
                      <div className="flex items-center mt-1 text-xs text-amber-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Approaching limit (${(allocated - spent).toFixed(2)} remaining)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetProgressView;
