
import { cn } from "@/lib/utils";

export function TransactionCard({ transaction, icon, className }) {
  const { title, amount, category, paidBy, date } = transaction;
  
  return (
    <div className={cn(
      "card-glass rounded-xl p-4 transition-all duration-250 hover:scale-[1.01]",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <div className="flex items-center space-x-2 text-muted-foreground text-xs">
              <span>{category}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">${amount.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Paid by {paidBy}</div>
        </div>
      </div>
    </div>
  );
}
