
import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon, trend, className }) {
  return (
    <div className={cn(
      "card-glass rounded-xl p-6 flex flex-col space-y-2",
      className
    )}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold">{value}</h3>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            trend.isPositive ? "text-positive" : "text-negative"
          )}>
            <span className="mr-1">
              {trend.isPositive ? "↑" : "↓"}
            </span>
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
}
