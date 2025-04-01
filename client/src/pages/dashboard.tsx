import { useState } from "react";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import BudgetOverviewCard from "@/components/dashboard/budget-overview-card";
import FinancialGoalsCard from "@/components/dashboard/financial-goals-card";
import CreditOverviewCard from "@/components/dashboard/credit-overview-card";
import RecentExpensesCard from "@/components/dashboard/recent-expenses-card";
import ResourcesCard from "@/components/dashboard/resources-card";
import EducationSection from "@/components/dashboard/education-section";

const Dashboard = () => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const openExpenseModal = () => {
    setIsExpenseModalOpen(true);
  };

  return (
    <>
      <WelcomeBanner openExpenseModal={openExpenseModal} />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BudgetOverviewCard />
        <FinancialGoalsCard />
        <CreditOverviewCard />
        <RecentExpensesCard openExpenseModal={openExpenseModal} />
        <ResourcesCard />
      </div>
      
      <EducationSection />
    </>
  );
};

export default Dashboard;
