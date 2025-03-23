
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function PageLayout({ children, className }) {
  const isMobile = useIsMobile();
  
  return (
    <main 
      className={cn(
        "flex-1 overflow-y-auto animate-fade-in",
        isMobile ? "px-4 py-16" : "ml-64 p-8",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}
