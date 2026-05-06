export interface RepoMetadata {
  stars: number;
  forks: number;
  description: string;
  language: string;
  updatedAt: string;
  license?: string;
}

export interface FileNode {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface RepoStructure {
  tree: FileNode[];
  defaultBranch: string;
  metadata: RepoMetadata;
}

export interface RepoAnalysis {
  overview: string;
  techStack: string[];
  architecture: string;
  keyFiles: string[];
  howItWorks: string;
}

export interface FileAnalysis {
  summary: string;
  purpose: string;
  complexity: 'Low' | 'Medium' | 'High';
  detailedExplanation: string;
}
