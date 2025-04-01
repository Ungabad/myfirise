import { pgTable, text, serial, integer, boolean, date, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

// Expense categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  userId: true,
});

// Expenses
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  description: true,
  amount: true,
  date: true,
  categoryId: true,
  userId: true,
});

// Financial goals
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  targetDate: date("target_date"),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  name: true,
  targetAmount: true,
  currentAmount: true,
  targetDate: true,
  userId: true,
});

// Budget
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
});

export const insertBudgetSchema = createInsertSchema(budgets).pick({
  amount: true,
  categoryId: true,
  userId: true,
  month: true,
  year: true,
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address"),
  distance: numeric("distance", { precision: 5, scale: 2 }),
  type: text("type").notNull(),
  bookmarked: boolean("bookmarked").default(false),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  name: true,
  description: true,
  address: true,
  distance: true,
  type: true,
  bookmarked: true,
});

// Educational content
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  description: true,
  content: true,
  imageUrl: true,
  category: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
