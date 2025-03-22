
import { useState } from "react";
import { 
  ArrowLeftRight, 
  Plus, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { debts } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";

const DebtTracker = () => {
  const [settledDebts, setSettledDebts] = useState<string[]>([]);

  const toggleSettled = (id: string) => {
    if (settledDebts.includes(id)) {
      setSettledDebts(settledDebts.filter(debtId => debtId !== id));
    } else {
      setSettledDebts([...settledDebts, id]);
    }
  };

  const activeDebts = debts.filter(debt => !settledDebts.includes(debt.id));
  const resolvedDebts = debts.filter(debt => settledDebts.includes(debt.id));

  return (
    <PageLayout>
      <PageHeader 
        title="Debt & Contribution Tracker" 
        description="Manage who owes who in your groups"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
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
    </PageLayout>
  );
};

export default DebtTracker;
