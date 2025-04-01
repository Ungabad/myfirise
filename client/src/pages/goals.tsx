import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Goal } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateToFull, calculatePercentage } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  targetAmount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(Number(val)), "Amount must be a number")
    .refine(val => Number(val) > 0, "Amount must be greater than zero"),
  currentAmount: z.string()
    .min(1, "Current amount is required")
    .refine(val => !isNaN(Number(val)), "Amount must be a number")
    .refine(val => Number(val) >= 0, "Amount cannot be negative"),
  targetDate: z.string().min(1, "Target date is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: new Date().toISOString().split('T')[0],
    },
  });

  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const createGoalMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest("POST", "/api/goals", {
        name: values.name,
        targetAmount: values.targetAmount,
        currentAmount: values.currentAmount,
        targetDate: values.targetDate,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Goal created",
        description: "Your financial goal has been created successfully",
      });
      form.reset({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      
      // Invalidate goals query
      await queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create goal: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (values: FormValues & { id: number }) => {
      return apiRequest("PUT", `/api/goals/${values.id}`, {
        name: values.name,
        targetAmount: values.targetAmount,
        currentAmount: values.currentAmount,
        targetDate: values.targetDate,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Goal updated",
        description: "Your financial goal has been updated successfully",
      });
      setIsModalOpen(false);
      setSelectedGoal(null);
      
      // Invalidate goals query
      await queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update goal: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/goals/${id}`, undefined);
    },
    onSuccess: async () => {
      toast({
        title: "Goal deleted",
        description: "Your financial goal has been deleted",
      });
      
      // Invalidate goals query
      await queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete goal: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const openModal = (goal?: Goal) => {
    if (goal) {
      setSelectedGoal(goal);
      form.reset({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
      });
    } else {
      setSelectedGoal(null);
      form.reset({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (selectedGoal) {
      updateGoalMutation.mutate({ ...values, id: selectedGoal.id });
    } else {
      createGoalMutation.mutate(values);
    }
  };

  const getStatusBadge = (goal: Goal) => {
    const currentAmount = Number(goal.currentAmount);
    const targetAmount = Number(goal.targetAmount);
    const percentage = calculatePercentage(currentAmount, targetAmount);
    
    if (goal.completed) {
      return <Badge className="bg-secondary-500 text-white">Completed</Badge>;
    }
    if (percentage >= 75) {
      return <Badge className="bg-secondary-500 text-white">Almost There</Badge>;
    }
    if (percentage >= 25) {
      return <Badge className="bg-accent-500 text-neutral-800">{percentage}% Complete</Badge>;
    }
    return <Badge className="bg-primary-500 text-white">Just Started</Badge>;
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Financial Goals</h1>
        <Button onClick={() => openModal()}>
          <span className="material-icons mr-2 text-sm">add</span>
          New Goal
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-icons animate-spin text-primary-500">refresh</span>
        </div>
      ) : goals && goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const percentage = calculatePercentage(
              Number(goal.currentAmount),
              Number(goal.targetAmount)
            );
            
            return (
              <Card key={goal.id} className="group hover:border-primary-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold">{goal.name}</CardTitle>
                    {goal.targetDate && (
                      <CardDescription>
                        Target: {formatDateToFull(goal.targetDate)}
                      </CardDescription>
                    )}
                  </div>
                  {getStatusBadge(goal)}
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Progress</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-3"
                      indicatorClass={
                        goal.completed
                          ? "bg-secondary-500"
                          : percentage >= 75
                          ? "bg-secondary-500"
                          : "bg-primary-500"
                      }
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openModal(goal)}
                    >
                      <span className="material-icons mr-1 text-sm">edit</span>
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this goal?")) {
                          deleteGoalMutation.mutate(goal.id);
                        }
                      }}
                    >
                      <span className="material-icons mr-1 text-sm">delete</span>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <span className="material-icons text-primary-500">flag</span>
          </div>
          <h3 className="mb-2 text-lg font-medium">No Financial Goals Yet</h3>
          <p className="mb-6 text-neutral-600">
            Set goals to help you save for important life expenses and track your progress.
          </p>
          <Button onClick={() => openModal()}>Create Your First Goal</Button>
        </Card>
      )}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedGoal ? "Update Goal" : "Create New Goal"}</DialogTitle>
            <DialogDescription>
              {selectedGoal
                ? "Update your financial goal details below."
                : "Set a new financial goal and track your progress over time."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Emergency Fund" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">$</span>
                        <Input placeholder="1000.00" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Savings</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">$</span>
                        <Input placeholder="0.00" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
                >
                  {createGoalMutation.isPending || updateGoalMutation.isPending
                    ? "Saving..."
                    : selectedGoal
                    ? "Update Goal"
                    : "Create Goal"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Goals;
