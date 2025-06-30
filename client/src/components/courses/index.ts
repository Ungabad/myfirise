import BudgetingBasicsCourse from "./BudgetingBasicsCourse";
import UnderstandingCreditScoresCourse from "./UnderstandingCreditScoresCourse";
import SavingStrategiesCourse from "./SavingStrategiesCourse";
import DebtManagementCourse from "./DebtManagementCourse";
import BankingCourse from "./BankingCourse";
import CareerCourse from "./CareerCourse";
import TaxesCourse from "./TaxesCourse";

export const COURSE_COMPONENTS: Record<string, React.FC> = {
  "budgeting-basics": BudgetingBasicsCourse,
  "understanding-credit-scores": UnderstandingCreditScoresCourse,
  "saving-strategies": SavingStrategiesCourse,
  "debt-management": DebtManagementCourse,
  banking: BankingCourse,
  career: CareerCourse,
  taxes: TaxesCourse,
};
