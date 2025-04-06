
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Expenses from "./pages/Expenses";
import Groups from "./pages/Groups";
import Budget from "./pages/Budget";
import Members from "./pages/Members";
import DebtTracker from "./pages/DebtTracker";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import SidebarNav from "./components/layout/SidebarNav";

function App() {
  return (
    <>
      <Router>
        <div className="flex min-h-screen">
          <SidebarNav />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/members" element={<Members />} />
              <Route path="/debt-tracker" element={<DebtTracker />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
