
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import BudgetForm from "@/components/BudgetForm";
import BudgetProgressView from "@/components/BudgetProgressView";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Budget = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (values: any) => {
    console.log("Budget values saved:", values);
    setIsEditing(false);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Budget Management"
        description="Set and manage your group budget allocations"
      />
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="view">View Budget</TabsTrigger>
          <TabsTrigger value="edit">Edit Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <BudgetProgressView />
        </TabsContent>
        
        <TabsContent value="edit">
          <BudgetForm onCancel={handleCancel} onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Budget;
