import React, { useState } from 'react';
import { githubService } from './services/githubService';
import { aiService } from './services/aiService';
import { Graph } from './components/Graph';
import { FileTree } from './components/FileTree';
import { AnalysisBoard } from './components/AnalysisBoard';
import { FileDetail } from './components/FileDetail';
import { Search, Github, Star, GitFork, Calendar, Shield, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPath, setSelectedPath] = useState();
  const [activeTab, setActiveTab] = useState('graph');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    setAnalysis(null);
    setSelectedPath(undefined);
    
    try {
      const { owner, repo } = githubService.parseUrl(url);
      const structure = await githubService.getRepoStructure(url);
      setData(structure);
      
      const repoAnalysis = await aiService.analyzeRepo(owner, repo, structure.tree);
      setAnalysis(repoAnalysis);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-ink text-white selection:bg-accent selection:text-black relative">
        <div className="grid-background" />
        
        <header className="h-16 border-b border-white/10 flex items-center px-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-accent"></div>
            <span className="font-bold tracking-tight text-white uppercase text-sm">RepoLens.ai</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl text-center"
          >
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-12 leading-tight text-white selection:bg-accent selection:text-ink font-serif italic">
              Repository <span className="opacity-40 whitespace-nowrap">Intelligence System</span>
            </h2>

            <form onSubmit={handleSearch} className="relative mb-20 group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="HTTPS://GITHUB.COM/OWNER/REPO"
                className="w-full p-4 text-lg bg-ink border border-white/20 rounded-lg placeholder:text-white/40 focus:ring-accent focus:border-accent"
              />
</div>
</main>
</div>
);
}

return (
  // Rest of your component code...
);
}
</div>
</AnimatePresence>
</motion.div>
</div>
</div>
</header>
</div>
</div>
</div>
</AnimatePresence>
</motion.div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>