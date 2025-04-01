export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const EXPENSE_CATEGORIES = [
  { id: 1, name: "Housing", icon: "home" },
  { id: 2, name: "Food", icon: "restaurant" },
  { id: 3, name: "Transportation", icon: "directions_bus" },
  { id: 4, name: "Utilities", icon: "power" },
  { id: 5, name: "Healthcare", icon: "local_hospital" },
  { id: 6, name: "Personal", icon: "person" },
  { id: 7, name: "Education", icon: "school" },
  { id: 8, name: "Other", icon: "more_horiz" }
];

export const RESOURCE_TYPES = [
  { value: "employment", label: "Employment" },
  { value: "housing", label: "Housing" },
  { value: "financial", label: "Financial" },
  { value: "education", label: "Education" },
  { value: "health", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "community", label: "Community" }
];

export const ARTICLE_CATEGORIES = [
  { value: "budgeting", label: "Budgeting" },
  { value: "credit", label: "Credit" },
  { value: "saving", label: "Saving" },
  { value: "debt", label: "Debt Management" },
  { value: "banking", label: "Banking" },
  { value: "career", label: "Career" },
  { value: "taxes", label: "Taxes" }
];

// Common date formatting functions
export const formatDateToMonthDay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDateToFull = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
};

// Format currency
export const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(Number(amount));
};

// Calculate percentage
export const calculatePercentage = (current: number, total: number) => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};
