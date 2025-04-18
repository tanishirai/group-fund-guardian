import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import BudgetForm from "@/components/BudgetForm";
import BudgetProgressView from "@/components/BudgetProgressView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  allocated: number;
  spent: number;
}

interface BudgetData {
  monthly: number;
  categories: Record<string, Category>;
}

const Budget = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthly: 3000,
    categories: {
      "Utilities": { allocated: 500, spent: 400 },
      "Food": { allocated: 800, spent: 750 },
      "Transport": { allocated: 300, spent: 350 },
      "Entertainment": { allocated: 400, spent: 200 },
    }
  });

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem("budgetData");
    if (savedData) {
      setBudgetData(JSON.parse(savedData));
    }
  }, []);

  const handleSave = (values: { monthly: number; categories: Record<string, { allocated: number }> }) => {
    // Preserve the spent values while updating allocations
    const updatedCategories = Object.keys(values.categories).reduce((acc, category) => {
      acc[category] = {
        allocated: values.categories[category].allocated,
        spent: budgetData.categories[category]?.spent || 0
      };
      return acc;
    }, {} as Record<string, Category>);

    const updatedData = {
      monthly: values.monthly,
      categories: updatedCategories
    };

    setBudgetData(updatedData);
    localStorage.setItem("budgetData", JSON.stringify(updatedData));
    setActiveTab("view");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Budget Management"
        description="Set and manage your group budget allocations"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="view">View Budget</TabsTrigger>
          <TabsTrigger value="edit">Edit Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <BudgetProgressView budgetData={budgetData} />
        </TabsContent>
        
        <TabsContent value="edit">
          <BudgetForm 
            onCancel={() => setActiveTab("view")} 
            onSave={handleSave}
            initialData={{
              monthly: budgetData.monthly,
              categories: Object.entries(budgetData.categories).reduce((acc, [category, data]) => {
                acc[category] = { allocated: data.allocated };
                return acc;
              }, {} as Record<string, { allocated: number }>)
            }}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Budget;