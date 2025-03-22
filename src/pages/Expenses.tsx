
import { useState } from "react";
import { 
  ReceiptText, 
  Plus, 
  Filter,
  Search,
  ShoppingBag,
  Tag,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionCard, Transaction } from "@/components/ui/TransactionCard";
import { transactions } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(transactions[0]);

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm === "" || 
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || 
      transaction.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <PageHeader 
        title="Expense Tracking" 
        description="Manage and track all your shared expenses"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </PageHeader>

      {/* Search and Filters */}
      <Card className="p-4 mb-6 border shadow-card animate-slide-in">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 md:col-span-3">
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses List */}
        <div className="col-span-1 lg:col-span-1 space-y-4 animate-fade-in">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ReceiptText className="mr-2 h-5 w-5 text-primary" />
            Expenses ({filteredTransactions.length})
          </h3>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found matching your criteria
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                onClick={() => setSelectedExpense(transaction)}
                className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
              >
                <TransactionCard 
                  transaction={transaction} 
                  icon={<ShoppingBag className="h-5 w-5" />}
                  className={cn(
                    selectedExpense?.id === transaction.id 
                      ? "border-primary ring-1 ring-primary" 
                      : "border-border"
                  )}
                />
              </div>
            ))
          )}
        </div>

        {/* Expense Details */}
        {selectedExpense && (
          <div className="col-span-1 lg:col-span-2 animate-slide-in">
            <Card className="border shadow-card overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">{selectedExpense.title}</h2>
                <p className="text-muted-foreground">{selectedExpense.date}</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Category</span>
                      </div>
                      <span className="font-medium">{selectedExpense.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>Paid by</span>
                      </div>
                      <span className="font-medium">{selectedExpense.paidBy}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Date</span>
                      </div>
                      <span className="font-medium">{selectedExpense.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Split Method</span>
                      </div>
                      <span className="font-medium capitalize">
                        {selectedExpense.split?.type || "Equal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Split Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Split Details</h3>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-xl font-bold mb-4">
                      ${selectedExpense.amount.toFixed(2)}
                    </div>
                    
                    {selectedExpense.split?.details && (
                      <div className="space-y-2">
                        {Object.entries(selectedExpense.split.details).map(([person, amount], index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{person}</span>
                            <span className="font-medium">${amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-secondary/50 flex justify-end space-x-3">
                <Button variant="outline">Edit Expense</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Expenses;
