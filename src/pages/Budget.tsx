
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import BudgetForm from "@/components/BudgetForm";
import BudgetProgressView from "@/components/BudgetProgressView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { budgets } from "@/lib/data";

// Define the schema type to match what BudgetForm expects
type BudgetFormValues = {
  monthly: number;
  categories: Record<string, { allocated: number }>;
};

const Budget = () => {
  const [activeTab, setActiveTab] = useState("view");

  // Add handlers for the BudgetForm
  const handleCancel = () => {
    setActiveTab("view");
  };

  const handleSave = (values: BudgetFormValues) => {
    // Here you would typically save to a database
    // For now we'll just show a toast and switch tabs
    toast.success("Budget updated successfully");
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
          <BudgetProgressView />
        </TabsContent>
        
        <TabsContent value="edit">
          <BudgetForm 
            onCancel={handleCancel} 
            onSave={handleSave} 
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Budget;
