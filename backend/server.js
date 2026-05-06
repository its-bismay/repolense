import express from "express";
import { Octokit } from "octokit";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5000;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.use(cors());
app.use(express.json());

app.get("/api/repo/structure", async (req, res) => {
	const { owner, repo } = req.query;
	if (!owner || !repo) {
		return res
			.status(400)
			.json({ error: "Owner and repo are required" });
	}

	try {
		const { data: repoData } = await octokit.rest.repos.get({
			owner: owner,
			repo: repo,
		});

		const defaultBranch = repoData.default_branch;

		const { data: treeData } = await octokit.rest.git.getTree({
			owner: owner,
			repo: repo,
			tree_sha: defaultBranch,
			recursive: "true",
		});

		res.json({
			tree: treeData.tree,
			defaultBranch,
			metadata: {
				stars: repoData.stargazers_count,
				forks: repoData.forks_count,
				description: repoData.description,
				language: repoData.language,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: error.message || "Internal server error",
		});
	}
});

app.get("/api/repo/file", async (req, res) => {
	const { owner, repo, path: filePath, branch } = req.query;
	if (!owner || !repo || !filePath || !branch) {
		return res
			.status(400)
			.json({ error: "Owner, repo, path, and branch are required" });
	}

	try {
		const { data } = await octokit.rest.repos.getContent({
			owner: owner,
			repo: repo,
			path: filePath,
			ref: branch,
		});

		if ("content" in data) {
			const content = Buffer.from(data.content, "base64").toString("utf-8");
			res.json({ content });
		} else {
			res.status(400).json({ error: "Not a file" });
		}
	} catch (error) {
		res.status(500).json({
			error: error.message || "Internal server error",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
