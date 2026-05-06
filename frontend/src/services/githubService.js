const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const githubService = {
  async getRepoStructure(url) {
    const { owner, repo } = this.parseUrl(url);
    const response = await fetch(`${BACKEND_URL}/api/repo/structure?owner=${owner}&repo=${repo}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch repo structure');
    }
    return response.json();
  },

  async getFileContent(url, path, branch) {
    const { owner, repo } = this.parseUrl(url);
    const response = await fetch(`${BACKEND_URL}/api/repo/file?owner=${owner}&repo=${repo}&path=${path}&branch=${branch}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch file content');
    }
    const data = await response.json();
    return data.content;
  },

  parseUrl(url) {
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
