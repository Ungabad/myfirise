import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";

const CreditOverviewCard = () => {
  const creditScore = 650;
  const previousScore = 635;
  const scoreDifference = creditScore - previousScore;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-800">Credit Overview</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="material-icons text-neutral-400">info</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-48 text-center text-sm">Understanding your credit is an important part of your financial health</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 text-center">
          <div className="mx-auto mb-2 flex h-28 w-28 flex-col items-center justify-center rounded-full border-8 border-secondary-500 text-center">
            <span className="text-2xl font-bold text-neutral-800">{creditScore}</span>
            <span className="text-xs text-neutral-500">Credit Score</span>
          </div>
          <p className="text-sm text-secondary-500">
            +{scoreDifference} points since last month
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="rounded-md bg-neutral-50 p-3">
            <h4 className="mb-1 font-medium text-neutral-800">Focused on improvement</h4>
            <p className="text-sm text-neutral-600">Your on-time payments are helping improve your score.</p>
          </div>
          
          <div className="rounded-md bg-neutral-50 p-3">
            <h4 className="mb-1 font-medium text-neutral-800">Next steps</h4>
            <p className="text-sm text-neutral-600">Try to keep your credit utilization below 30% for better results.</p>
          </div>
        </div>
        
        <Link href="/education?category=credit" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
          Learn more about credit <span className="material-icons align-text-bottom text-sm">chevron_right</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CreditOverviewCard;
