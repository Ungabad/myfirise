import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface WelcomeBannerProps {
  openExpenseModal: () => void;
}

const WelcomeBanner = ({ openExpenseModal }: WelcomeBannerProps) => {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });

  return (
    <section className="mb-8">
      <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white shadow-md">
        <h2 className="mb-2 text-2xl font-bold">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}</h2>
        <p className="mb-4 text-primary-100">Your journey to financial confidence continues. You've made great progress!</p>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <Button
            onClick={openExpenseModal}
            variant="secondary"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-primary-50"
          >
            <span className="material-icons mr-2 text-sm">add_circle</span>
            Track Expense
          </Button>
          <Button
            variant="secondary"
            className="inline-flex items-center rounded-md bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-600"
            asChild
          >
            <a href="/goals">
              <span className="material-icons mr-2 text-sm">flag</span>
              View Goals
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
