import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/repo/structure', async (req, res) => {
    const { owner, repo } = req.query;
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    try {
      // Get the default branch first
      const { data: repoData } = await octokit.rest.repos.get({
        owner: owner as string,
        repo: repo as string,
      });

      const defaultBranch = repoData.default_branch;

      // Fetch the recursive tree
      const { data: treeData } = await octokit.rest.git.getTree({
        owner: owner as string,
        repo: repo as string,
        tree_sha: defaultBranch,
        recursive: 'true',
      });

      res.json({
        tree: treeData.tree,
        defaultBranch,
        metadata: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          description: repoData.description,
          language: repoData.language,
          updatedAt: repoData.updated_at,
          license: repoData.license?.name
        }
      });
    } catch (error: any) {
      console.error('Error fetching repo structure:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch repo structure' });
    }
  });

  app.get('/api/repo/file', async (req, res) => {
    const { owner, repo, path: filePath, branch } = req.query;
    if (!owner || !repo || !filePath) {
      return res.status(400).json({ error: 'Owner, repo, and path are required' });
    }

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: owner as string,
        repo: repo as string,
        path: filePath as string,
        ref: branch as string,
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        res.json({ content });
      } else {
        res.status(400).json({ error: 'Not a file' });
      }
    } catch (error: any) {
      console.error('Error fetching file content:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch file content' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
