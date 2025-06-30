import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Budget, Expense } from "@shared/schema";
import { formatCurrency, calculatePercentage } from "@/lib/constants";
import { Link } from "wouter";
import { useState, useEffect } from "react";

interface CategoryBudget {
  id: number;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  percentage: number;
}

const BudgetOverviewCard = () => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Get current month and year
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const { data: budgets } = useQuery<Budget[]>({
    queryKey: [`/api/budgets?month=${month}&year=${year}`],
  });

  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  useEffect(() => {
    if (budgets && categories && expenses) {
      // Filter expenses for current month
      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === month &&
          expenseDate.getFullYear() === year
        );
      });

      // Calculate spent by category
      const spentByCategory = currentMonthExpenses.reduce((acc, expense) => {
        const categoryId = expense.categoryId || 0;
        acc[categoryId] = (acc[categoryId] || 0) + Number(expense.amount);
        return acc;
      }, {} as Record<number, number>);

      // Create category budgets with spending info
      const categoryBudgetData = budgets.map((budget) => {
        const category = Array.isArray(categories)
          ? categories.find((c: any) => c.id === budget.categoryId)
          : undefined;
        const spent = spentByCategory[budget.categoryId] || 0;
        const budgetAmount = Number(budget.amount);
        return {
          id: budget.categoryId,
          name: category?.name || "Unknown",
          icon: category?.icon || "help_outline",
          budget: budgetAmount,
          spent,
          percentage: calculatePercentage(spent, budgetAmount),
        };
      });

      setCategoryBudgets(categoryBudgetData);

      // Calculate totals
      const totalBudgetAmount = budgets.reduce(
        (sum, budget) => sum + Number(budget.amount),
        0
      );
      const totalSpentAmount = Object.values(spentByCategory).reduce(
        (sum, amt) => sum + amt,
        0
      );

      setTotalBudget(totalBudgetAmount);
      setTotalSpent(totalSpentAmount);
      setTotalPercentage(
        calculatePercentage(totalSpentAmount, totalBudgetAmount)
      );
    }
  }, [budgets, categories, expenses, month, year]);

  const getProgressColorClass = (percentage: number) => {
    if (percentage >= 100) return "bg-warning";
    if (percentage >= 90) return "bg-error";
    return "bg-primary-500";
  };

  return (
    <Card className='col-span-1 lg:col-span-2'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-medium text-neutral-800'>
          Monthly Budget Overview
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className='material-icons text-neutral-400'>info</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className='w-48 text-center text-sm'>
                Your budget shows your spending for this month compared to your
                planned budget
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        <div className='mt-2 space-y-4'>
          {/* Total Budget */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='text-sm font-medium text-neutral-700'>
                  Total Budget
                </span>
              </div>
              <div className='text-right'>
                <span className='text-sm font-medium text-neutral-700'>
                  {formatCurrency(totalSpent)} spent of{" "}
                  {formatCurrency(totalBudget)}
                </span>
              </div>
            </div>
            <Progress
              value={totalPercentage}
              className='h-3'
              indicatorClass={getProgressColorClass(totalPercentage)}
            />
          </div>

          {/* Category Budgets */}
          {categoryBudgets.map((item) => (
            <div key={item.id}>
              <div className='mb-1 flex items-center justify-between'>
                <div className='flex items-center'>
                  <span className='material-icons mr-2 text-sm text-neutral-500'>
                    {item.icon}
                  </span>
                  <span className='text-sm font-medium text-neutral-700'>
                    {item.name}
                  </span>
                </div>
                <div className='text-right'>
                  <span className='text-sm font-medium text-neutral-700'>
                    {formatCurrency(item.spent)} of{" "}
                    {formatCurrency(item.budget)}
                  </span>
                </div>
              </div>
              <Progress
                value={item.percentage}
                className='h-2'
                indicatorClass={getProgressColorClass(item.percentage)}
              />
            </div>
          ))}
        </div>

        <Link
          href='/expenses'
          className='mt-6 inline-block text-sm font-medium text-primary-600 hover:text-primary-700'
        >
          View detailed budget{" "}
          <span className='material-icons align-text-bottom text-sm'>
            chevron_right
          </span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BudgetOverviewCard;
