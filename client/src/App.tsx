import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Expenses from "@/pages/expenses";
import Goals from "@/pages/goals";
import Education from "@/pages/education";
import Resources from "@/pages/resources";
import Article from "@/pages/article";
import Profile from "@/pages/profile";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState } from "react";
import AddExpenseModal from "@/components/modals/add-expense-modal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/goals" component={Goals} />
      <Route path="/education" component={Education} />
      <Route path="/education/:id" component={Article} />
      <Route path="/resources" component={Resources} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const openExpenseModal = () => {
    setIsExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-800">
        <Navbar openExpenseModal={openExpenseModal} />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Router />
          </div>
        </main>
        <Footer />
        <AddExpenseModal isOpen={isExpenseModalOpen} onClose={closeExpenseModal} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
