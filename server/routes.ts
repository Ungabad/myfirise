import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertExpenseSchema, insertGoalSchema, insertBudgetSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Error handling middleware
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // User routes
  router.get("/users/current", async (req, res) => {
    try {
      // For demo purposes, return the first user
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Category routes
  router.get("/categories", async (req, res) => {
    try {
      // Get userId from query params if available
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Expense routes
  router.get("/expenses", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      const expenses = await storage.getExpenses(userId);
      res.json(expenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/expenses/recent", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const expenses = await storage.getRecentExpenses(userId, limit);
      res.json(expenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/expenses", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      req.body.userId = userId;
      
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  router.put("/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = 1; // For demo purposes
      
      // Ensure the expense exists and belongs to the user
      const existingExpense = await storage.getExpense(id);
      if (!existingExpense || existingExpense.userId !== userId) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      const updatedExpense = await storage.updateExpense(id, req.body);
      res.json(updatedExpense);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = 1; // For demo purposes
      
      // Ensure the expense exists and belongs to the user
      const existingExpense = await storage.getExpense(id);
      if (!existingExpense || existingExpense.userId !== userId) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      const result = await storage.deleteExpense(id);
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Goal routes
  router.get("/goals", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/goals", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      req.body.userId = userId;
      
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      res.status(201).json(goal);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  router.put("/goals/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = 1; // For demo purposes
      
      // Ensure the goal exists and belongs to the user
      const existingGoal = await storage.getGoal(id);
      if (!existingGoal || existingGoal.userId !== userId) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const updatedGoal = await storage.updateGoal(id, req.body);
      res.json(updatedGoal);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/goals/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = 1; // For demo purposes
      
      // Ensure the goal exists and belongs to the user
      const existingGoal = await storage.getGoal(id);
      if (!existingGoal || existingGoal.userId !== userId) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const result = await storage.deleteGoal(id);
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Goal not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Budget routes
  router.get("/budgets", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      
      // Default to current month if not specified
      const date = new Date();
      const month = req.query.month ? Number(req.query.month) : date.getMonth() + 1;
      const year = req.query.year ? Number(req.query.year) : date.getFullYear();
      
      const budgets = await storage.getBudgets(userId, month, year);
      res.json(budgets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/budgets", async (req, res) => {
    try {
      // For demo purposes, use the first user
      const userId = 1;
      req.body.userId = userId;
      
      const validatedData = insertBudgetSchema.parse(req.body);
      
      // Check if budget already exists for this category, month, and year
      const existingBudget = await storage.getBudgetByCategory(
        userId,
        validatedData.categoryId,
        validatedData.month,
        validatedData.year
      );
      
      if (existingBudget) {
        // Update existing budget
        const updatedBudget = await storage.updateBudget(existingBudget.id, {
          amount: validatedData.amount
        });
        return res.json(updatedBudget);
      }
      
      // Create new budget
      const budget = await storage.createBudget(validatedData);
      res.status(201).json(budget);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Resource routes
  router.get("/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/resources/:id/bookmark", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updatedResource = await storage.toggleResourceBookmark(id);
      
      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(updatedResource);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Article routes
  router.get("/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/articles/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register the API routes with the /api prefix
  app.use("/api", router);

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
