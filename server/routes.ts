import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableGitHubClient } from "./github";
import { githubUploadSchema } from "@shared/schema";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/github/upload", async (req, res) => {
    try {
      const validation = githubUploadSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { repoName, repoDescription, isPrivate, includeReadme } = validation.data;
      
      // Get GitHub client
      const octokit = await getUncachableGitHubClient();
      
      // Get authenticated user
      const { data: user } = await octokit.rest.users.getAuthenticated();
      
      // Create repository
      const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription || undefined,
        private: isPrivate,
        auto_init: includeReadme,
      });

      // Get current directory contents (excluding node_modules, .git, etc.)
      const excludeDirs = ['node_modules', '.git', 'blis', 'obj', 'dist', '.next', 'build'];
      const filesToUpload: { path: string; content: string }[] = [];

      function walkDir(dir: string, base: string = '') {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (excludeDirs.includes(file)) continue;
            if (file.startsWith('.') && file !== '.gitignore') continue;

            const fullPath = path.join(dir, file);
            const relativePath = base ? `${base}/${file}` : file;
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              walkDir(fullPath, relativePath);
            } else if (stat.size < 1024 * 1024) { // Skip files larger than 1MB
              try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                filesToUpload.push({ path: relativePath, content });
              } catch {
                // Skip binary files
              }
            }
          }
        } catch (error) {
          // Ignore read errors
        }
      }

      walkDir(process.cwd());

      // Upload files to repository
      for (const file of filesToUpload.slice(0, 100)) { // Limit to 100 files
        try {
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: user.login,
            repo: repoName,
            path: file.path,
            message: `Add ${file.path}`,
            content: Buffer.from(file.content).toString('base64'),
          });
        } catch (error) {
          // Continue on individual file errors
        }
      }

      res.json({
        success: true,
        url: repo.html_url,
        owner: user.login,
        repoName: repo.name,
      });
    } catch (error: any) {
      console.error("GitHub upload error:", error);
      res.status(500).json({
        error: error.message || "Failed to upload to GitHub",
      });
    }
  });

  return httpServer;
}
