import React, { useEffect, useState } from 'react';
import { githubService } from '../services/githubService';
import { aiService } from '../services/aiService';
import { FileAnalysis } from '../types';
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface FileDetailProps {
  repoUrl: string;
  path: string;
  branch: string;
}

export const FileDetail: React.FC<FileDetailProps> = ({ repoUrl, path, branch }) => {
  const [content, setContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const fileContent = await githubService.getFileContent(repoUrl, path, branch);
        setContent(fileContent);
        
        // session storage cache key v2 to force update
        const cacheKey = `analysis_v2_${repoUrl}_${path}_${branch}`;
        const cached = sessionStorage.getItem(cacheKey);
        
        if (cached) {
          setAnalysis(JSON.parse(cached));
        } else {
          const fileAnalysis = await aiService.analyzeFile(path, fileContent);
          setAnalysis(fileAnalysis);
          sessionStorage.setItem(cacheKey, JSON.stringify(fileAnalysis));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load file');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [repoUrl, path, branch]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={32} />
          <span className="text-[10px] uppercase tracking-widest text-white/30">Deconstructing Logic...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-surface p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
          <p className="text-sm text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-l border-white/10 selection-lime overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <div className="mb-6">
          <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">File Intelligence</div>
          <h3 className="text-xl font-light text-white font-serif italic truncate">{path.split('/').pop()}</h3>
          <div className="flex gap-2 mt-4">
            <span className="px-2 py-0.5 border border-accent/40 text-[9px] text-accent uppercase font-mono">{path.split('.').pop()}</span>
            {analysis && (
              <span className={cn(
                "px-2 py-0.5 border text-[9px] uppercase font-mono",
                analysis.complexity === 'High' ? 'border-red-500/40 text-red-400' : 
                analysis.complexity === 'Medium' ? 'border-yellow-500/40 text-yellow-400' : 
                'border-green-500/40 text-green-400'
              )}>
                {analysis.complexity} Complexity
              </span>
            )}
          </div>
        </div>
        
        {analysis && (
          <div className="space-y-6">
            <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm">
              <div className="text-[10px] font-mono text-accent mb-2 uppercase tracking-widest flex items-center gap-2">
                <Zap size={10} /> Core Function
              </div>
              <div className="text-[11px] text-white/70 italic leading-snug">
                "{analysis.summary}"
              </div>
            </div>

            <div className="prose prose-invert prose-xs max-w-none text-[11px] leading-relaxed text-white/50">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3 border-b border-white/5 pb-1">Architectural Breakdown</div>
              <ReactMarkdown 
                components={{
                  h1: ({children}) => <h1 className="text-white text-xs font-bold mt-4 mb-2 uppercase tracking-wider">{children}</h1>,
                  h2: ({children}) => <h2 className="text-white/80 text-[11px] font-bold mt-3 mb-1">{children}</h2>,
                  p: ({children}) => <p className="mb-3">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                  code: ({children}) => <code className="bg-white/10 px-1 rounded font-mono text-accent">{children}</code>
                }}
              >
                {analysis.detailedExplanation}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-ink/30">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4 border-b border-white/5 pb-1">Source Header</div>
        <pre className="text-[11px] font-mono text-white/30 leading-relaxed overflow-x-auto">
          <code>{content?.substring(0, 5000)}{content && content.length > 5000 ? '\n... [Content Truncated]' : ''}</code>
        </pre>
      </div>
    </div>
  );
};
