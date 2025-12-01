import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const githubUploadSchema = z.object({
  repoName: z.string().min(1, "Repository name is required"),
  repoDescription: z.string().optional(),
  isPrivate: z.boolean().default(false),
  includeReadme: z.boolean().default(true),
});

export type GitHubUploadRequest = z.infer<typeof githubUploadSchema>;
