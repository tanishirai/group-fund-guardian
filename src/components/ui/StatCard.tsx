
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
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
