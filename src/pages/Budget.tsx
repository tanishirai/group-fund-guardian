
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import BudgetForm from "@/components/BudgetForm";

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
      
      <div className="grid gap-6">
        <BudgetForm onCancel={handleCancel} onSave={handleSave} />
      </div>
    </PageLayout>
  );
};

export default Budget;
