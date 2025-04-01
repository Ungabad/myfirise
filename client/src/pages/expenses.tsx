import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Expense, Budget } from "@shared/schema";
import { formatCurrency, formatDateToFull, calculatePercentage, MONTHS, EXPENSE_CATEGORIES } from "@/lib/constants";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";

const Expenses = () => {
  const [monthFilter, setMonthFilter] = useState<string>(String(new Date().getMonth() + 1));
  const [yearFilter, setYearFilter] = useState<string>(String(new Date().getFullYear()));
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: budgets, isLoading: budgetsLoading } = useQuery<Budget[]>({
    queryKey: [`/api/budgets?month=${monthFilter}&year=${yearFilter}`],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Filter expenses
  const filteredExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth() + 1;
    const expenseYear = expenseDate.getFullYear();
    
    const monthMatch = expenseMonth === Number(monthFilter);
    const yearMatch = expenseYear === Number(yearFilter);
    const categoryMatch = categoryFilter === "all" || expense.categoryId === Number(categoryFilter);
    
    return monthMatch && yearMatch && categoryMatch;
  }) || [];

  // Calculate total spent for the month
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Calculate total budget for the month
  const totalBudget = budgets?.reduce((sum, budget) => sum + Number(budget.amount), 0) || 0;

  // Calculate spending by category for pie chart
  const categorySpending = filteredExpenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId || 0;
    acc[categoryId] = (acc[categoryId] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<number, number>);

  const pieChartData = EXPENSE_CATEGORIES.map(category => ({
    name: category.name,
    value: categorySpending[category.id] || 0
  })).filter(item => item.value > 0);

  // Pie chart colors
  const COLORS = ['#4681f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#ff9800', '#795548', '#607d8b'];

  const isLoading = expensesLoading || budgetsLoading || categoriesLoading;

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-neutral-800 sm:mb-0">Expense Tracker</h1>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2021, 2022, 2023, 2024].map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <div className="flex items-center">
                    <span className="material-icons mr-2 text-sm">{category.icon}</span>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="material-icons animate-spin text-primary-500">refresh</span>
              </div>
            ) : filteredExpenses.length > 0 ? (
              <>
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-neutral-700">Total Spent</span>
                    <span className="font-medium text-neutral-700">
                      {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
                    </span>
                  </div>
                  <Progress
                    value={calculatePercentage(totalSpent, totalBudget)}
                    className="h-4"
                    indicatorClass={totalSpent > totalBudget ? "bg-error" : "bg-primary-500"}
                  />
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="border-b border-neutral-200">
                      <tr>
                        <th className="pb-2 text-left text-sm font-medium text-neutral-500">Date</th>
                        <th className="pb-2 text-left text-sm font-medium text-neutral-500">Description</th>
                        <th className="pb-2 text-left text-sm font-medium text-neutral-500">Category</th>
                        <th className="pb-2 text-right text-sm font-medium text-neutral-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredExpenses.map(expense => {
                        const category = EXPENSE_CATEGORIES.find(c => c.id === expense.categoryId);
                        
                        return (
                          <tr key={expense.id} className="hover:bg-neutral-50">
                            <td className="py-3 text-sm text-neutral-600">
                              {formatDateToFull(expense.date)}
                            </td>
                            <td className="py-3 text-sm font-medium text-neutral-800">
                              {expense.description}
                            </td>
                            <td className="py-3 text-sm text-neutral-600">
                              <div className="flex items-center">
                                <span className="material-icons mr-1 text-sm">{category?.icon || 'help_outline'}</span>
                                {category?.name || 'Other'}
                              </div>
                            </td>
                            <td className="py-3 text-right text-sm font-medium text-neutral-800">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="material-icons mb-4 text-4xl text-neutral-300">receipt_long</span>
                <p className="text-center text-neutral-500">No expenses found for this period.</p>
                <Button className="mt-4" size="sm" onClick={() => window.dispatchEvent(new CustomEvent("openExpenseModal"))}>
                  Add Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="material-icons animate-spin text-primary-500">refresh</span>
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="material-icons mb-4 text-4xl text-neutral-300">pie_chart</span>
                <p className="text-center text-neutral-500">No data to display.</p>
              </div>
            )}
            
            <div className="mt-4 space-y-2">
              {pieChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="mr-2 h-3 w-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-neutral-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-800">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Expenses;
