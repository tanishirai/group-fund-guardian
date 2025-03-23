
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn("flex flex-col mb-8 space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0", 
      className
    )}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}
