import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Expense } from "@shared/schema";
import { formatCurrency, formatDateToMonthDay } from "@/lib/constants";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

interface RecentExpensesCardProps {
  openExpenseModal: () => void;
}

const RecentExpensesCard = ({ openExpenseModal }: RecentExpensesCardProps) => {
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses/recent"],
  });

  const getCategoryIcon = (categoryId: number | null) => {
    if (!categoryId) return "more_horiz";
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || "more_horiz";
  };

  const getCategoryBgClass = (categoryId: number | null) => {
    switch(categoryId) {
      case 1: // Housing
        return "bg-blue-50 text-blue-500";
      case 2: // Food
        return "bg-accent-100 text-warning";
      case 3: // Transportation
        return "bg-neutral-100 text-neutral-500";
      case 4: // Utilities
        return "bg-neutral-100 text-neutral-500";
      case 5: // Healthcare
        return "bg-red-50 text-red-500";
      case 6: // Personal
        return "bg-purple-50 text-purple-500";
      case 7: // Education
        return "bg-green-50 text-green-500";
      default:
        return "bg-primary-50 text-primary-500";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-800">Recent Expenses</CardTitle>
        <Button
          size="sm"
          className="inline-flex items-center rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-100"
          onClick={openExpenseModal}
        >
          <span className="material-icons mr-1 text-sm">add</span>
          Add Expense
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-hidden rounded-md border border-neutral-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="material-icons animate-spin text-primary-500">refresh</span>
            </div>
          ) : expenses && expenses.length > 0 ? (
            <ul className="-mb-px divide-y divide-neutral-100">
              {expenses.map((expense) => (
                <li key={expense.id} className="expense-item flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${getCategoryBgClass(expense.categoryId)}`}>
                      <span className="material-icons">{getCategoryIcon(expense.categoryId)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{expense.description}</p>
                      <p className="text-sm text-neutral-500">{formatDateToMonthDay(expense.date)}</p>
                    </div>
                  </div>
                  <span className="font-medium text-neutral-800">{formatCurrency(expense.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-neutral-600">No expenses recorded yet.</p>
              <Button className="mt-4" size="sm" onClick={openExpenseModal}>
                Add Your First Expense
              </Button>
            </div>
          )}
        </div>
        
        <Link href="/expenses" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
          View all expenses <span className="material-icons align-text-bottom text-sm">chevron_right</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentExpensesCard;
