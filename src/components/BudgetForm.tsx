import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

// 1. Define validation schema
const budgetFormSchema = z.object({
  monthly: z.coerce.number().positive("Budget must be greater than 0"),
  categories: z.record(
    z.object({
      allocated: z.coerce.number().min(0, "Allocation can't be negative")
    })
  )
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  onCancel: () => void;
  onSave: (values: BudgetFormValues) => void;
  initialData: {
    monthly: number;
    categories: Record<string, { allocated: number }>;
  };
}

// 2. Export the component properly
export function BudgetForm({ onCancel, onSave, initialData }: BudgetFormProps) {
  // 3. Initialize form with default values
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      monthly: initialData.monthly,
      categories: Object.keys(initialData.categories).reduce((acc, category) => {
        acc[category] = { allocated: initialData.categories[category].allocated };
        return acc;
      }, {} as Record<string, { allocated: number }>)
    }
  });

  // 4. Handle form submission
  const onSubmit = (data: BudgetFormValues) => {
    try {
      const totalAllocated = Object.values(data.categories).reduce(
        (sum, { allocated }) => sum + allocated, 0
      );
      
      if (totalAllocated > data.monthly) {
        toast.warning("Category allocations exceed monthly budget!");
        return;
      }

      onSave(data);
      toast.success("Budget updated successfully!");
    } catch (error) {
      toast.error("Failed to update budget");
      console.error("Budget update error:", error);
    }
  };

  // 5. Render form
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Edit Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="1" 
                      min="0" 
                      placeholder="Enter monthly budget"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Category Allocations</h3>
              
              {Object.keys(initialData.categories).map((category) => (
                <FormField
                  key={category}
                  control={form.control}
                  name={`categories.${category}.allocated`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4">
                        <FormLabel className="min-w-[100px]">{category}</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2 w-full max-w-[200px]">
                            <span className="text-muted-foreground">₹</span>
                            <Input
                              type="number"
                              step="1"
                              min="0"
                              placeholder="0"
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

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// 6. Default export (can use either named or default export)
export default BudgetForm;