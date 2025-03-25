
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { budgets } from "@/lib/data";

// Create schema for budget form validation
const budgetFormSchema = z.object({
  monthly: z.coerce.number().positive("Budget must be greater than 0"),
  categories: z.record(
    z.object({
      allocated: z.coerce.number().nonnegative("Allocation must be a positive number"),
    })
  ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  onCancel: () => void;
  onSave: (values: BudgetFormValues) => void;
}

export default function BudgetForm({ onCancel, onSave }: BudgetFormProps) {
  // Initialize form with existing budget values
  const defaultValues: BudgetFormValues = {
    monthly: budgets.monthly,
    categories: Object.entries(budgets.categories).reduce((acc, [category, values]) => {
      acc[category] = { allocated: values.allocated };
      return acc;
    }, {} as Record<string, { allocated: number }>),
  };

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: BudgetFormValues) => {
    // Here we would normally save to a database
    console.log("Budget form submitted:", values);
    toast.success("Budget updated successfully");
    onSave(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Set your monthly budget and category limits to help track your expenses.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Category Allocations</h3>
              
              {Object.entries(budgets.categories).map(([category]) => (
                <FormField
                  key={category}
                  control={form.control}
                  name={`categories.${category}.allocated`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="w-1/3">{category}</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">$</span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              className="w-full" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel} type="button">
                Cancel
              </Button>
              <Button type="submit">Save Budget</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
