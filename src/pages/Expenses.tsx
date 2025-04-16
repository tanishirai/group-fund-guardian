
import { useState, useEffect } from "react";
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
import { transactions as initialTransactions, groups } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(initialTransactions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    paidBy: "",
    splitType: "equal",
    date: new Date().toISOString().split('T')[0]
  });
  const [editingExpense, setEditingExpense] = useState({
    id: "",
    title: "",
    amount: "",
    category: "",
    paidBy: "",
    splitType: "equal",
    date: ""
  });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Check URL parameters to see if we should open the dialog
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openDialog') === 'true') {
      setIsDialogOpen(true);
      // Clean up the URL after opening dialog
      navigate('/expenses', { replace: true });
    }
  }, [location, navigate]);

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  
  // Get all members from all groups
  const allMembers = Array.from(new Set(groups.flatMap(group => group.members)));

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm === "" || 
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || categoryFilter === "all-categories" || 
      transaction.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingExpense({
      ...editingExpense,
      [name]: value
    });
  };

  const handleAddExpense = () => {
    // Validate form
    if (!newExpense.title || !newExpense.amount || !newExpense.category || !newExpense.paidBy) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create new expense object
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be done through an API call
    // For now, we'll create a new transaction and add it to our state
    const newTransaction: Transaction = {
      id: `tr${Date.now()}`,
      title: newExpense.title,
      amount: amount,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      split: {
        type: newExpense.splitType,
        details: allMembers.reduce((acc, member) => {
          acc[member] = amount / allMembers.length;
          return acc;
        }, {} as { [key: string]: number })
      }
    };

    setTransactions([newTransaction, ...transactions]);
    setSelectedExpense(newTransaction);
    
    toast({
      title: "Expense added",
      description: `${newExpense.title} ($${amount.toFixed(2)}) has been added successfully.`,
    });

    // Reset form and close dialog
    setNewExpense({
      title: "",
      amount: "",
      category: "",
      paidBy: "",
      splitType: "equal",
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
  };

  const handleEditExpense = () => {
    // Validate form
    if (!editingExpense.title || !editingExpense.amount || !editingExpense.category || !editingExpense.paidBy) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create updated expense object
    const amount = parseFloat(editingExpense.amount.toString());
    if (isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    // Update the transaction in our state
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === editingExpense.id) {
        return {
          ...transaction,
          title: editingExpense.title,
          amount: amount,
          category: editingExpense.category,
          paidBy: editingExpense.paidBy,
          date: editingExpense.date
        };
      }
      return transaction;
    });

    setTransactions(updatedTransactions);
    const updatedExpense = updatedTransactions.find(t => t.id === editingExpense.id);
    setSelectedExpense(updatedExpense || null);
    
    toast({
      title: "Expense updated",
      description: `${editingExpense.title} has been updated successfully.`,
    });

    // Close the dialog
    setIsEditDialogOpen(false);
  };

  const handleDeleteExpense = () => {
    if (!selectedExpense) return;
    
    // Filter out the expense to delete
    const updatedTransactions = transactions.filter(transaction => transaction.id !== selectedExpense.id);
    
    setTransactions(updatedTransactions);
    setSelectedExpense(updatedTransactions[0] || null);
    
    toast({
      title: "Expense deleted",
      description: `${selectedExpense.title} has been deleted.`,
    });
    
    // Close the dialog
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = () => {
    if (selectedExpense) {
      setEditingExpense({
        id: selectedExpense.id,
        title: selectedExpense.title,
        amount: selectedExpense.amount.toString(),
        category: selectedExpense.category,
        paidBy: selectedExpense.paidBy,
        splitType: selectedExpense.split?.type || "equal",
        date: selectedExpense.date
      });
      setIsEditDialogOpen(true);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Expense Tracking" 
        description="Manage and track all your shared expenses"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
          onClick={() => setIsDialogOpen(true)}
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
                <SelectItem value="all-categories">All Categories</SelectItem>
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

              <div className="p-6 bg-secondary/50 flex justify-end space-x-3">
                <Button variant="outline" onClick={openEditDialog}>Edit Expense</Button>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Expense</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Dinner at Restaurant"
                value={newExpense.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={newExpense.category} onValueChange={(value) => {
                  setNewExpense({...newExpense, category: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <Select name="paidBy" value={newExpense.paidBy} onValueChange={(value) => {
                  setNewExpense({...newExpense, paidBy: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="splitType">Split Type</Label>
              <Select name="splitType" value={newExpense.splitType} onValueChange={(value) => {
                setNewExpense({...newExpense, splitType: value});
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select split method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal Split</SelectItem>
                  <SelectItem value="custom">Custom Split</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Expense</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="e.g., Dinner at Restaurant"
                value={editingExpense.title}
                onChange={handleEditInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-amount">Amount ($)</Label>
                <Input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={editingExpense.amount}
                  onChange={handleEditInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={editingExpense.date.split(',')[1]?.trim() || new Date().toISOString().split('T')[0]}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" value={editingExpense.category} onValueChange={(value) => {
                  setEditingExpense({...editingExpense, category: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-paidBy">Paid By</Label>
                <Select name="paidBy" value={editingExpense.paidBy} onValueChange={(value) => {
                  setEditingExpense({...editingExpense, paidBy: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleEditExpense}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete this expense?</p>
            <p className="font-medium mt-2">{selectedExpense?.title} - ${selectedExpense?.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteExpense}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Expenses;
