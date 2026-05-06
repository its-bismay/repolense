import { GoogleGenAI, Type } from '@google/genai';
import { RepoAnalysis, FileAnalysis, FileNode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  async analyzeRepo(owner: string, repo: string, structure: FileNode[]): Promise<RepoAnalysis> {
    const fileList = structure.map(f => f.path).join('\n');
    const prompt = `Analyze this GitHub repository structure for ${owner}/${repo}. 
Files:
${fileList}

Provide a comprehensive explanation of this repository in JSON format with these exact keys:
1. overview: A high-level 2-sentence summary.
2. techStack: An array of the primary technologies/languages/frameworks used.
3. architecture: A brief description of the project structure and design patterns.
4. keyFiles: An array of 3-5 most important files and why they matter.
5. howItWorks: A step-by-step technical explanation of the main flow.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            architecture: { type: Type.STRING },
            keyFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
            howItWorks: { type: Type.STRING },
          },
          required: ['overview', 'techStack', 'architecture', 'keyFiles', 'howItWorks'],
        },
      },
    });

    return JSON.parse(response.text);
  },

  async analyzeFile(fileName: string, content: string): Promise<FileAnalysis> {
    const prompt = `EXHAUSTIVE TECHNICAL AUDIT REQUEST: ${fileName}.
Analyze the provided code and generate a high-density technical deconstruction. 

CODE CONTENT:
${content.substring(0, 6000)}

Generate a JSON response with:
1. summary: A technical 1-sentence executive summary.
2. purpose: A deep explanation of the specific role this file plays in the system architecture.
3. complexity: "Low", "Medium", or "High" based on cyclomatic complexity and abstraction level.
4. detailedExplanation: A massive, markdown-formatted technical deep-dive. 
   - Start with a "Logic & Flow" section describing the step-by-step execution path.
   - Include a "Pattern Recognition" section (e.g., Hooks, HOCs, Middleware, etc).
   - List every major function/method and its specific algorithmic responsibility.
   - Critique technical debt or potential bottlenecks found in the code.
   - Use bold text and code snippets for clarity.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            purpose: { type: Type.STRING },
            complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            detailedExplanation: { type: Type.STRING },
          },
          required: ['summary', 'purpose', 'complexity', 'detailedExplanation'],
        },
      },
    });

    return JSON.parse(response.text);
  }
};
