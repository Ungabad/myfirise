import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required")
    .refine(val => !isNaN(Number(val)), "Amount must be a number")
    .refine(val => Number(val) > 0, "Amount must be greater than zero"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
});

const AddExpenseModal = ({ isOpen, onClose }: AddExpenseModalProps) => {
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      amount: "",
      date: today,
      description: "",
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/expenses", {
        categoryId: parseInt(values.categoryId),
        amount: values.amount,
        date: values.date,
        description: values.description,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Expense added",
        description: "Your expense has been added successfully",
      });
      form.reset({
        categoryId: "",
        amount: "",
        date: today,
        description: "",
      });
      onClose();
      
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/expenses/recent"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createExpenseMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-neutral-900">Add New Expense</DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Track your spending by adding expense details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center">
                            <span className="material-icons mr-2 text-sm text-neutral-500">{category.icon}</span>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">Amount</FormLabel>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">$</span>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Grocery shopping at Market"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={createExpenseMutation.isPending}
            >
              {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
