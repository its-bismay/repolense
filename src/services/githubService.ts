import { RepoStructure } from '../types';

export const githubService = {
  async getRepoStructure(url: string): Promise<RepoStructure> {
    const { owner, repo } = this.parseUrl(url);
    const response = await fetch(`/api/repo/structure?owner=${owner}&repo=${repo}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch repo structure');
    }
    return response.json();
  },

  async getFileContent(url: string, path: string, branch: string): Promise<string> {
    const { owner, repo } = this.parseUrl(url);
    const response = await fetch(`/api/repo/file?owner=${owner}&repo=${repo}&path=${path}&branch=${branch}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch file content');
    }
    const data = await response.json();
    return data.content;
  },

  parseUrl(url: string) {
    try {
      const parsedUrl = new URL(url);
      const parts = parsedUrl.pathname.split('/').filter(Boolean);
      if (parts.length < 2) throw new Error('Invalid GitHub URL');
      return { owner: parts[0], repo: parts[1] };
    } catch (e) {
      throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
    }
  }
};
