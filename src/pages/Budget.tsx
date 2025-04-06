
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import BudgetForm from "@/components/BudgetForm";
import BudgetProgressView from "@/components/BudgetProgressView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Budget = () => {
  const [activeTab, setActiveTab] = useState("view");

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
          <BudgetForm />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Budget;
