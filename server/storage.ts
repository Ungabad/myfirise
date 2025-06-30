import {
  users,
  type User,
  type InsertUser,
  expenses,
  type Expense,
  type InsertExpense,
  categories,
  type Category,
  type InsertCategory,
  goals,
  type Goal,
  type InsertGoal,
  budgets,
  type Budget,
  type InsertBudget,
  resources,
  type Resource,
  type InsertResource,
  articles,
  type Article,
  type InsertArticle,
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(userId?: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Expense methods
  getExpenses(userId: number): Promise<Expense[]>;
  getRecentExpenses(userId: number, limit: number): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(
    id: number,
    expense: Partial<Expense>
  ): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;

  // Goal methods
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Budget methods
  getBudgets(userId: number, month: number, year: number): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  getBudgetByCategory(
    userId: number,
    categoryId: number,
    month: number,
    year: number
  ): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(
    id: number,
    budget: Partial<Budget>
  ): Promise<Budget | undefined>;

  // Resource methods
  getResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  toggleResourceBookmark(id: number): Promise<Resource | undefined>;

  // Article methods
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private expenses: Map<number, Expense>;
  private goals: Map<number, Goal>;
  private budgets: Map<number, Budget>;
  private resources: Map<number, Resource>;
  private articles: Map<number, Article>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentExpenseId: number;
  private currentGoalId: number;
  private currentBudgetId: number;
  private currentResourceId: number;
  private currentArticleId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.expenses = new Map();
    this.goals = new Map();
    this.budgets = new Map();
    this.resources = new Map();
    this.articles = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentExpenseId = 1;
    this.currentGoalId = 1;
    this.currentBudgetId = 1;
    this.currentResourceId = 1;
    this.currentArticleId = 1;

    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      fullName: insertUser.fullName,
      email: insertUser.email ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(userId?: number): Promise<Category[]> {
    if (userId) {
      return Array.from(this.categories.values()).filter(
        (category) => !category.userId || category.userId === userId
      );
    }
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = {
      id,
      name: insertCategory.name,
      icon: insertCategory.icon,
      userId: insertCategory.userId ?? null,
    };
    this.categories.set(id, category);
    return category;
  }

  // Expense methods
  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((expense) => expense.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRecentExpenses(userId: number, limit: number): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((expense) => expense.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const expense: Expense = {
      id,
      description: insertExpense.description,
      amount: insertExpense.amount,
      date: insertExpense.date,
      categoryId: insertExpense.categoryId ?? null,
      userId: insertExpense.userId,
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(
    id: number,
    expenseUpdate: Partial<Expense>
  ): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const updatedExpense = { ...expense, ...expenseUpdate };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Goal methods
  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter((goal) => goal.userId === userId)
      .sort((a, b) =>
        a.targetDate && b.targetDate
          ? new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
          : 0
      );
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      id,
      name: insertGoal.name,
      targetAmount: insertGoal.targetAmount,
      currentAmount: insertGoal.currentAmount ?? "0",
      targetDate: insertGoal.targetDate ?? null,
      completed: false,
      userId: insertGoal.userId,
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(
    id: number,
    goalUpdate: Partial<Goal>
  ): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...goalUpdate };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Budget methods
  async getBudgets(
    userId: number,
    month: number,
    year: number
  ): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      (budget) =>
        budget.userId === userId &&
        budget.month === month &&
        budget.year === year
    );
  }

  async getBudget(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }

  async getBudgetByCategory(
    userId: number,
    categoryId: number,
    month: number,
    year: number
  ): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(
      (budget) =>
        budget.userId === userId &&
        budget.categoryId === categoryId &&
        budget.month === month &&
        budget.year === year
    );
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.currentBudgetId++;
    const budget: Budget = { ...insertBudget, id };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(
    id: number,
    budgetUpdate: Partial<Budget>
  ): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;

    const updatedBudget = { ...budget, ...budgetUpdate };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async toggleResourceBookmark(id: number): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;

    const updatedResource = { ...resource, bookmarked: !resource.bookmarked };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  // Seed initial data
  private seedData() {
    // Seed demo user
    const user: User = {
      id: this.currentUserId++,
      username: "jamie",
      password: "password123", // In a real app, this would be hashed
      fullName: "Jamie Smith",
      email: "jamie@example.com",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);

    // Seed default categories
    const categories = [
      {
        id: this.currentCategoryId++,
        name: "Housing",
        icon: "home",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Food",
        icon: "restaurant",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Transportation",
        icon: "directions_bus",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Utilities",
        icon: "power",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Healthcare",
        icon: "local_hospital",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Personal",
        icon: "person",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Education",
        icon: "school",
        userId: null,
      },
      {
        id: this.currentCategoryId++,
        name: "Other",
        icon: "more_horiz",
        userId: null,
      },
    ];

    categories.forEach((category) => {
      this.categories.set(category.id, category as Category);
    });

    // Seed budgets for the demo user
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const budgets = [
      {
        id: this.currentBudgetId++,
        amount: "650",
        categoryId: 1,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      {
        id: this.currentBudgetId++,
        amount: "300",
        categoryId: 2,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      {
        id: this.currentBudgetId++,
        amount: "200",
        categoryId: 3,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      {
        id: this.currentBudgetId++,
        amount: "150",
        categoryId: 4,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      {
        id: this.currentBudgetId++,
        amount: "100",
        categoryId: 5,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      {
        id: this.currentBudgetId++,
        amount: "100",
        categoryId: 6,
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    ];

    budgets.forEach((budget) => {
      this.budgets.set(budget.id, budget as Budget);
    });

    // Seed expenses for the demo user
    const expenses = [
      {
        id: this.currentExpenseId++,
        description: "Grocery Store",
        amount: "78.25",
        date: "2023-09-15",
        categoryId: 2,
        userId: user.id,
      },
      {
        id: this.currentExpenseId++,
        description: "Lunch Cafe",
        amount: "12.50",
        date: "2023-09-14",
        categoryId: 2,
        userId: user.id,
      },
      {
        id: this.currentExpenseId++,
        description: "Public Transit",
        amount: "5.75",
        date: "2023-09-13",
        categoryId: 3,
        userId: user.id,
      },
      {
        id: this.currentExpenseId++,
        description: "Electric Bill",
        amount: "87.32",
        date: "2023-09-10",
        categoryId: 4,
        userId: user.id,
      },
      {
        id: this.currentExpenseId++,
        description: "Rent",
        amount: "650",
        date: "2023-09-01",
        categoryId: 1,
        userId: user.id,
      },
    ];

    expenses.forEach((expense) => {
      this.expenses.set(expense.id, expense as Expense);
    });

    // Seed goals for the demo user
    const goals = [
      {
        id: this.currentGoalId++,
        name: "Emergency Fund",
        targetAmount: "1000",
        currentAmount: "450",
        targetDate: "2023-10-30",
        completed: false,
        userId: user.id,
      },
      {
        id: this.currentGoalId++,
        name: "Pay Off Credit Card",
        targetAmount: "3000",
        currentAmount: "750",
        targetDate: "2024-03-15",
        completed: false,
        userId: user.id,
      },
    ];

    goals.forEach((goal) => {
      this.goals.set(goal.id, goal as Goal);
    });

    // Seed resources
    const resources = [
      {
        id: this.currentResourceId++,
        name: "Job Training Program",
        description: "Free career training and placement services",
        address: "123 Main St, City, State 12345",
        distance: "3.2",
        type: "employment",
        bookmarked: false,
      },
      {
        id: this.currentResourceId++,
        name: "Financial Counseling",
        description: "Free 1-on-1 sessions with a certified counselor",
        address: "456 Oak Ave, City, State 12345",
        distance: "5.7",
        type: "financial",
        bookmarked: false,
      },
      {
        id: this.currentResourceId++,
        name: "Community Action Agency",
        description: "Assistance with housing, utilities, and more",
        address: "789 Elm St, City, State 12345",
        distance: "1.8",
        type: "housing",
        bookmarked: false,
      },
    ];

    resources.forEach((resource) => {
      this.resources.set(resource.id, resource as Resource);
    });

    // Seed educational articles
    const articles = [
      {
        id: this.currentArticleId++,
        title: "Budgeting Basics",
        description:
          "Learn the essentials of creating and sticking to a personal budget that works for you.",
        content: `
          <h1>Budgeting Basics</h1>
          <p>A budget is a plan for your money. It helps you track your income and expenses, so you can make sure you're not spending more than you earn.</p>
          <h2>Why Budget?</h2>
          <p>Budgeting helps you:</p>
          <ul>
            <li>Take control of your finances</li>
            <li>Save for future goals</li>
            <li>Reduce financial stress</li>
            <li>Make better spending decisions</li>
          </ul>
          <h2>How to Create a Budget</h2>
          <ol>
            <li>Calculate your total income</li>
            <li>Track your expenses for a month</li>
            <li>Categorize your expenses</li>
            <li>Set spending limits for each category</li>
            <li>Review and adjust regularly</li>
          </ol>
          <h2>Budgeting Tips</h2>
          <p>Start small with just tracking expenses, then build from there. Use the 50/30/20 rule as a starting point: 50% for needs, 30% for wants, and 20% for savings and debt repayment.</p>
          <p>Remember that budgeting is a skill that takes practice. Be patient with yourself as you learn.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
        category: "budgeting",
      },
      {
        id: this.currentArticleId++,
        title: "Understanding Credit Scores",
        description:
          "Demystifying credit scores and how to improve yours over time.",
        content: `
          <h1>Understanding Credit Scores</h1>
          <p>Your credit score is a number that represents your creditworthiness. Lenders use this score to decide whether to give you loans and what interest rates to charge.</p>
          <h2>What Makes Up Your Credit Score</h2>
          <ul>
            <li><strong>Payment History (35%)</strong>: Do you pay your bills on time?</li>
            <li><strong>Credit Utilization (30%)</strong>: How much of your available credit are you using?</li>
            <li><strong>Length of Credit History (15%)</strong>: How long have you had credit?</li>
            <li><strong>New Credit (10%)</strong>: Have you applied for a lot of credit recently?</li>
            <li><strong>Credit Mix (10%)</strong>: Do you have different types of credit?</li>
          </ul>
          <h2>How to Improve Your Credit Score</h2>
          <ol>
            <li>Pay all your bills on time</li>
            <li>Keep your credit card balances low</li>
            <li>Don't close old credit accounts</li>
            <li>Limit applications for new credit</li>
            <li>Check your credit report regularly for errors</li>
          </ol>
          <h2>Building Credit from Scratch</h2>
          <p>If you don't have a credit history, consider a secured credit card, becoming an authorized user on someone else's account, or a credit-builder loan.</p>
          <p>Remember, improving your credit score takes time. Be patient and consistent with good financial habits.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
        category: "credit",
      },
      {
        id: this.currentArticleId++,
        title: "Saving Strategies",
        description:
          "Practical tips for building savings, even when money is tight.",
        content: `
          <h1>Saving Strategies</h1>
          <p>Saving money is an important part of financial health, but it can be challenging, especially when income is limited.</p>
          <h2>Why Saving Matters</h2>
          <p>Savings help you:</p>
          <ul>
            <li>Handle unexpected expenses</li>
            <li>Avoid debt</li>
            <li>Work toward financial goals</li>
            <li>Reduce financial stress</li>
          </ul>
          <h2>Effective Saving Strategies</h2>
          <ol>
            <li><strong>Start small</strong>: Even $5 a week adds up over time</li>
            <li><strong>Automate savings</strong>: Set up automatic transfers to a savings account</li>
            <li><strong>Save windfalls</strong>: Put tax refunds, gifts, and bonuses into savings</li>
            <li><strong>Use the 24-hour rule</strong>: Wait 24 hours before making non-essential purchases</li>
            <li><strong>Track your progress</strong>: Celebrate small wins along the way</li>
          </ol>
          <h2>Emergency Fund Goal</h2>
          <p>Try to save at least $500 for emergencies, then work toward 3-6 months of essential expenses. If that feels overwhelming, focus on the first $500 first.</p>
          <p>Remember that any amount of savings is better than none. Don't get discouraged if progress is slow - keep at it!</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
        category: "saving",
      },
      {
        id: this.currentArticleId++,
        title: "Debt Management",
        description:
          "Learn how to control and pay off your debts in a responsible way.",
        content: `
          <h1>Debt Management</h1>
          <p>Debt management is the process of controlling and paying off your debts in a responsible way. It helps you avoid financial stress and build a better financial future.</p>
          <h2>What is Debt Management?</h2>
          <p>Debt management involves making a plan to pay off your debts, keeping track of what you owe, and making payments on time. It can also include working with a credit counselor or using a debt management plan.</p>
          <h2>Tips for Managing Debt</h2>
          <ul>
            <li>Make a budget to track your income and expenses.</li>
            <li>Pay more than the minimum payment when possible.</li>
            <li>Avoid taking on new debt while paying off existing debt.</li>
            <li>Contact creditors if you have trouble making payments.</li>
          </ul>
          <p>Managing your debt well can improve your credit score and reduce financial stress.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        category: "debt",
      },
      {
        id: this.currentArticleId++,
        title: "Banking",
        description:
          "Understand the basics of banking and how to use financial institutions to your advantage.",
        content: `
          <h1>Banking</h1>
          <p>Banking involves managing your money through financial institutions like banks and credit unions. It helps you keep your money safe and access financial services.</p>
          <h2>What is Banking?</h2>
          <p>Banks offer a safe place to store your money and provide services like checking accounts, savings accounts, and loans.</p>
          <h2>Types of Bank Accounts</h2>
          <ul>
            <li><strong>Checking Account:</strong> Used for everyday spending and bill payments.</li>
            <li><strong>Savings Account:</strong> Used to save money and earn interest.</li>
            <li><strong>Certificate of Deposit (CD):</strong> A savings account with a fixed interest rate and term.</li>
          </ul>
          <p>Understanding banking helps you make better financial decisions and keep your money secure.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1518183214770-9cffbec72538?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        category: "banking",
      },
      {
        id: this.currentArticleId++,
        title: "Career",
        description:
          "Explore how to build a successful career and achieve your professional goals.",
        content: `
          <h1>Career</h1>
          <p>A career is a series of connected employment opportunities, where you build up skills and experience over time. Building a career can help you achieve your professional and financial goals.</p>
          <h2>What is a Career?</h2>
          <p>A career is more than just a job. It is a path of learning, growth, and advancement in your chosen field.</p>
          <h2>Building Your Career</h2>
          <ul>
            <li>Set professional goals and work towards them.</li>
            <li>Gain experience through different roles and responsibilities.</li>
            <li>Learn new skills and continue your education.</li>
            <li>Network with others in your field.</li>
          </ul>
          <p>Investing in your career can lead to greater job satisfaction and financial stability.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        category: "career",
      },
      {
        id: this.currentArticleId++,
        title: "Taxes",
        description:
          "Understand the basics of taxes and how they affect your finances.",
        content: `
          <h1>Taxes</h1>
          <p>Taxes are mandatory payments made to the government to fund public services and infrastructure. Understanding taxes helps you manage your finances and meet your legal obligations.</p>
          <h2>What are Taxes?</h2>
          <p>Taxes are collected by federal, state, and local governments. They pay for things like schools, roads, and emergency services.</p>
          <h2>Types of Taxes</h2>
          <ul>
            <li><strong>Income Tax:</strong> Paid on the money you earn from work or investments.</li>
            <li><strong>Sales Tax:</strong> Added to the price of goods and services you buy.</li>
            <li><strong>Property Tax:</strong> Paid by people who own real estate.</li>
          </ul>
          <p>Knowing how taxes work can help you plan, save, and avoid surprises at tax time.</p>
        `,
        imageUrl:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        category: "taxes",
      },
    ];

    articles.forEach((article) => {
      this.articles.set(article.id, article as Article);
    });
  }
}

export const storage = new MemStorage();
