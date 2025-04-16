
import { useState } from "react";
import { 
  ArrowLeftRight, 
  Plus, 
  ArrowRight,
  CheckCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { debts as initialDebts } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { members } from "@/lib/data";

const DebtTracker = () => {
  const [settledDebts, setSettledDebts] = useState<string[]>([]);
  const [debts, setDebts] = useState(initialDebts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContribution, setNewContribution] = useState({
    from: "",
    to: "",
    amount: "",
    description: ""
  });
  
  const { toast } = useToast();

  const toggleSettled = (id: string) => {
    if (settledDebts.includes(id)) {
      setSettledDebts(settledDebts.filter(debtId => debtId !== id));
      toast({
        title: "Settlement undone",
        description: "The debt has been marked as active again.",
      });
    } else {
      setSettledDebts([...settledDebts, id]);
      toast({
        title: "Debt settled",
        description: "The debt has been marked as settled.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContribution({
      ...newContribution,
      [name]: value
    });
  };

  const handleAddContribution = () => {
    // Validate form
    if (!newContribution.from || !newContribution.to || !newContribution.amount || !newContribution.description) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if from and to are different people
    if (newContribution.from === newContribution.to) {
      toast({
        title: "Invalid selection",
        description: "A person cannot owe money to themselves.",
        variant: "destructive"
      });
      return;
    }

    // Create new debt object
    const amount = parseFloat(newContribution.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    const newDebt = {
      id: `d${Date.now()}`,
      from: newContribution.from,
      to: newContribution.to,
      amount: amount,
      description: newContribution.description
    };

    setDebts([newDebt, ...debts]);
    
    toast({
      title: "Contribution added",
      description: `${newContribution.from} now owes ${newContribution.to} $${amount.toFixed(2)}.`,
    });

    // Reset form and close dialog
    setNewContribution({
      from: "",
      to: "",
      amount: "",
      description: ""
    });
    setIsAddDialogOpen(false);
  };

  const activeDebts = debts.filter(debt => !settledDebts.includes(debt.id));
  const resolvedDebts = debts.filter(debt => settledDebts.includes(debt.id));
  const memberNames = members.map(member => member.name);

  return (
    <PageLayout>
      <PageHeader 
        title="Debt & Contribution Tracker" 
        description="Manage who owes who in your groups"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Contribution
        </Button>
      </PageHeader>

      {/* Active Debts */}
      <Card className="p-6 mb-8 border shadow-card animate-slide-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ArrowLeftRight className="mr-2 h-5 w-5 text-primary" />
          Active Settlements
        </h3>

        {activeDebts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active debts to settle. You're all caught up!
          </div>
        ) : (
          <div className="space-y-4">
            {activeDebts.map((debt) => (
              <div 
                key={debt.id}
                className="card-glass rounded-xl p-4 transition-all duration-250"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="font-semibold">{debt.from.split(' ')[0][0]}</span>
                    </div>
                    <ArrowRight className="mx-2 h-5 w-5 text-muted-foreground" />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="font-semibold">{debt.to.split(' ')[0][0]}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <p className="font-medium">
                      <span className="text-muted-foreground">From:</span> {debt.from}
                    </p>
                    <p className="font-medium">
                      <span className="text-muted-foreground">To:</span> {debt.to}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{debt.description}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold text-primary">${debt.amount.toFixed(2)}</div>
                    <Button 
                      size="sm" 
                      className="mt-2 bg-primary text-white hover:bg-primary/90 transition-colors"
                      onClick={() => toggleSettled(debt.id)}
                    >
                      Settle
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment History */}
      <Card className="p-6 border shadow-card animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-positive" />
          Settlement History
        </h3>

        {resolvedDebts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No settlement history to show yet.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {resolvedDebts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{debt.from}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{debt.to}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{debt.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="font-semibold">${debt.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSettled(debt.id)}
                      >
                        Undo
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Contribution Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Contribution</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="from">From (Who owes)</Label>
                <Select name="from" value={newContribution.from} onValueChange={(value) => {
                  setNewContribution({...newContribution, from: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="to">To (Who is owed)</Label>
                <Select name="to" value={newContribution.to} onValueChange={(value) => {
                  setNewContribution({...newContribution, to: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newContribution.amount}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Share of dinner bill"
                value={newContribution.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" onClick={handleAddContribution}>
              <Plus className="mr-2 h-4 w-4" /> Add Contribution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DebtTracker;
