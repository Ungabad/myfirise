import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Goal } from "@shared/schema";
import { formatCurrency, formatDateToFull, calculatePercentage } from "@/lib/constants";

const FinancialGoalsCard = () => {
  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const getGoalStatus = (goal: Goal) => {
    const currentAmount = Number(goal.currentAmount);
    const targetAmount = Number(goal.targetAmount);
    const percentage = calculatePercentage(currentAmount, targetAmount);
    
    if (goal.completed) return { label: "Completed", color: "bg-secondary-500" };
    if (percentage >= 75) return { label: "Almost There", color: "bg-secondary-500" };
    if (percentage >= 25) return { label: `${percentage}% Complete`, color: "bg-accent-500" };
    return { label: "Just Started", color: "bg-primary-500" };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-800">Financial Goals</CardTitle>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/goals">
            <span className="material-icons rounded-full p-1 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500">add</span>
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="material-icons animate-spin text-primary-500">refresh</span>
            </div>
          ) : goals && goals.length > 0 ? (
            goals.slice(0, 3).map((goal) => {
              const status = getGoalStatus(goal);
              const percentage = calculatePercentage(Number(goal.currentAmount), Number(goal.targetAmount));
              
              return (
                <div key={goal.id} className="rounded-md border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-neutral-800">{goal.name}</h4>
                    <Badge className={`${status.color} text-white`} variant="secondary">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-neutral-600">
                    {formatCurrency(goal.currentAmount)} saved of {formatCurrency(goal.targetAmount)} goal
                  </p>
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClass={status.color}
                  />
                  {goal.targetDate && (
                    <p className="mt-2 text-xs text-neutral-500">
                      Target date: {formatDateToFull(goal.targetDate)}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
              <p className="text-sm text-neutral-600">
                You haven't set any financial goals yet.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/goals">
                  Create Your First Goal
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <Link href="/goals" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
          Manage all goals <span className="material-icons align-text-bottom text-sm">chevron_right</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FinancialGoalsCard;
