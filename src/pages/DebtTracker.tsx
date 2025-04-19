import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Plus,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

interface Debt {
  id: string;
  from: string;
  to: string;
  amount: number;
  description: string;
  timestamp: Date;
  settled?: boolean;
}

const DebtTracker = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [settledDebts, setSettledDebts] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDebt, setNewDebt] = useState({
    from: "",
    to: "",
    amount: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load settled debts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("settledDebts");
    if (saved) setSettledDebts(JSON.parse(saved));
  }, []);

  // Save settled debts to localStorage
  useEffect(() => {
    localStorage.setItem("settledDebts", JSON.stringify(settledDebts));
  }, [settledDebts]);

  // Fetch debts from Firestore
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "debts"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const fetchedDebts = snapshot.docs.map((doc) => ({
          id: doc.id,
          from: doc.data().from,
          to: doc.data().to,
          amount: doc.data().amount,
          description: doc.data().description,
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          settled: doc.data().settled || false,
        }));

        setDebts(fetchedDebts);
      } catch (error) {
        console.error("Firestore error:", error);
        toast({
          title: "Failed to load debts",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [toast]);

  const handleAddDebt = async () => {
    const { from, to, amount, description } = newDebt;

    // Validation
    if (!from || !to || !amount || !description) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (from === to) {
      toast({
        title: "Invalid selection",
        description: "A person cannot owe money to themselves.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "debts"), {
        from,
        to,
        amount: parsedAmount,
        description,
        timestamp: serverTimestamp(),
        settled: false,
      });

      // Update local state
      setDebts((prev) => [
        {
          id: docRef.id,
          from,
          to,
          amount: parsedAmount,
          description,
          timestamp: new Date(),
          settled: false,
        },
        ...prev,
      ]);

      toast({
        title: "Debt added successfully",
        description: `${from} now owes ${to} ₹${parsedAmount.toFixed(2)}.`,
      });

      // Reset form
      setNewDebt({ from: "", to: "", amount: "", description: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Firestore write error:", error);
      toast({
        title: "Error adding debt",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSettled = (id: string) => {
    setSettledDebts((prev) => {
      const newSettled = prev.includes(id)
        ? prev.filter((debtId) => debtId !== id)
        : [...prev, id];

      toast({
        title: prev.includes(id) ? "Debt reactivated" : "Debt settled",
        description: prev.includes(id)
          ? "The debt has been marked as active again."
          : "The debt has been marked as settled.",
      });

      return newSettled;
    });
  };

  const activeDebts = debts.filter((debt) => !settledDebts.includes(debt.id));
  const resolvedDebts = debts.filter((debt) => settledDebts.includes(debt.id));
  const memberNames = members.map((member) => member.name);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading debts...</p>
        </div>
      </PageLayout>
    );
  }

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
          <Plus className="mr-2 h-4 w-4" /> Add Debt
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
              <div key={debt.id} className="card-glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="font-semibold">{debt.from[0]}</span>
                    </div>
                    <ArrowRight className="mx-2 h-5 w-5 text-muted-foreground" />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="font-semibold">{debt.to[0]}</span>
                    </div>
                  </div>
                  <div className="flex-1 mx-4">
                    <p className="font-medium">
                      <span className="text-muted-foreground">From:</span>{" "}
                      {debt.from}
                    </p>
                    <p className="font-medium">
                      <span className="text-muted-foreground">To:</span>{" "}
                      {debt.to}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {debt.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold text-primary">
                      ₹{debt.amount.toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 bg-primary text-white"
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

      {/* Settlement History */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {resolvedDebts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{debt.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{debt.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {debt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      ₹{debt.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground"
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

      {/* Add Debt Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Debt</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="from">From (Who owes)</Label>
                <Select
                  value={newDebt.from}
                  onValueChange={(value) =>
                    setNewDebt({ ...newDebt, from: value })
                  }
                >
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
                <Select
                  value={newDebt.to}
                  onValueChange={(value) =>
                    setNewDebt({ ...newDebt, to: value })
                  }
                >
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
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newDebt.amount}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, amount: e.target.value })
                }
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newDebt.description}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, description: e.target.value })
                }
                placeholder="What was this debt for?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddDebt}>Add Debt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DebtTracker;