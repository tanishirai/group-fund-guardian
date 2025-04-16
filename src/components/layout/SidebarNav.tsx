
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  PieChart, 
  ArrowLeftRight, 
  Bell,
  Menu,
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Members", href: "/members", icon: User },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Budget", href: "/budget", icon: PieChart },
  { name: "Debt Tracker", href: "/debt-tracker", icon: ArrowLeftRight },
  // { name: "Notifications", href: "/notifications", icon: Bell },
];

export default function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-white hover:bg-primary/80 transition-colors duration-200 focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white">GroupFund</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                    )
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-colors duration-200",
                    isActive ? "text-white" : "text-sidebar-foreground group-hover:text-white"
                  )} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <NavLink 
              to="/profile"
              className={({ isActive }) => cn(
                "flex items-center p-2 rounded-md cursor-pointer",
                isActive ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
              )}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-sidebar-foreground/70">View Profile</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
