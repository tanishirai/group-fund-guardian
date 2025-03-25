
import React from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { BudgetForm } from "@/components/BudgetForm";

const Budget = () => {
  return (
    <PageLayout>
      <PageHeader
        title="Budget Management"
        description="Set and manage your group budget allocations"
      />
      
      <div className="grid gap-6">
        <BudgetForm />
      </div>
    </PageLayout>
  );
};

export default Budget;
