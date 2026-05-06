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
                className="w-full bg-transparent border-b border-white/20 py-6 px-4 focus:outline-none focus:border-accent transition-all text-2xl font-mono uppercase tracking-widest placeholder:text-white/5"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-0 bottom-6 bg-accent text-ink px-8 py-3 rounded-none uppercase text-xs tracking-widest font-bold flex items-center gap-2 hover:bg-white transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                  <>
                    <Search size={16} />
                    <span>Analyze Repository</span>
                  </>
                )}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-accent">
                  <Maximize2 size={16} />
                </div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Structural Mapping</h3>
                <p className="text-xs text-white/40 leading-relaxed">Force-directed node graphs visualize complex folder hierarchies and file relationships in real-time.</p>
              </div>
              <div className="space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-accent">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Gemini Analysis</h3>
                <p className="text-xs text-white/40 leading-relaxed">Integrated LLM agents deconstruct architecture, stack choices, and specific file logic instantly.</p>
              </div>
              <div className="space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-accent">
                  <Shield size={16} />
                </div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Local Persistence</h3>
                <p className="text-xs text-white/40 leading-relaxed">Session-based caching ensures rapid re-exploration of files without redundant compute calls.</p>
              </div>
            </div>
          </motion.div>
        </main>

        <section className="bg-white/[0.02] border-t border-white/5 py-20 px-8 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-accent mb-4 font-bold">Built with Precision</div>
              <h4 className="text-2xl text-white font-serif italic mb-6">Cutting-edge technology meets minimalistic design.</h4>
              <div className="flex flex-wrap gap-3">
                {['React 19', 'Gemini 3 Flash', 'D3.js', 'Motion', 'Tailwind v4', 'Express'].map(t => (
                  <span key={t} className="px-3 py-1 border border-white/10 text-[9px] uppercase tracking-widest text-white/60">{t}</span>
                ))}
              </div>
            </div>
            <div className="border border-white/10 p-8 flex flex-col justify-center">
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Current Capacity</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl text-white font-mono">100%</span>
                <span className="text-xs text-accent font-mono uppercase tracking-widest">Available</span>
              </div>
              <p className="text-xs text-white/30 mt-4">System is optimized for repositories up to 5,000 nodes with recursive analysis enabled by default.</p>
            </div>
          </div>
        </section>

        <footer className="h-12 border-t border-white/10 px-8 flex items-center justify-between text-[10px] font-mono text-white/20">
          <div>GEOMETRIC BALANCE V2.0</div>
          <div className="flex gap-6">
            <span>READY</span>
            <span>0.0.0-PRO</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ink text-[#D4D4D4] overflow-hidden selection:bg-accent selection:text-black">
      <div className="grid-background opacity-[0.02]" />
      
      {/* Header Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-ink/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setData(null)} className="flex items-center gap-2 group">
            <div className="w-3 h-3 bg-accent scale-100 group-hover:scale-125 transition-transform" />
            <span className="font-bold tracking-tight text-white uppercase text-sm">RepoLens.ai</span>
          </button>
          <div className="h-4 w-[1px] bg-white/20" />
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-white/40 uppercase">Repository:</span>
            <span className="text-accent truncate max-w-[200px]">{url.split('/').slice(-2).join(' / ')}</span>
            <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-white/60 uppercase">{data.defaultBranch}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2 bg-white/5 p-1 rounded-sm border border-white/5">
            <button 
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all ${activeTab === 'graph' ? 'bg-accent text-ink' : 'text-white/30 hover:text-white'}`}
            >
              Graph
            </button>
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all ${activeTab === 'analysis' ? 'bg-accent text-ink' : 'text-white/30 hover:text-white'}`}
            >
              Intelligence
            </button>
          </nav>
          
          <div className="h-4 w-[1px] bg-white/20" />
          
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <span className="text-accent">★</span> {(data.metadata.stars / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-accent">⑂</span> {(data.metadata.forks / 1000).toFixed(1)}k
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-surface z-10">
          <FileTree data={data.tree} selectedPath={selectedPath} onSelect={setSelectedPath} />
        </aside>

        {/* Center Space */}
        <main className="flex-1 relative bg-ink overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'graph' ? (
              <motion.div 
                key="graph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Graph data={data.tree} selectedPath={selectedPath} onNodeClick={setSelectedPath} />
              </motion.div>
            ) : (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto scrollbar-thin relative z-10"
              >
                {analysis ? <AnalysisBoard analysis={analysis} /> : (
                  <div className="h-full flex items-center justify-center p-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-accent" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Synthesizing architecture...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Detail Pane */}
        <AnimatePresence>
          {selectedPath && !data.tree.find(f => f.path === selectedPath)?.type.includes('tree') && (
            <motion.aside 
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-[320px] z-20 shadow-2xl relative shadow-black/80"
            >
              <FileDetail 
                repoUrl={url} 
                path={selectedPath} 
                branch={data.defaultBranch} 
              />
              <button 
                onClick={() => setSelectedPath(undefined)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
              >
                <Minimize2 size={14} />
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <footer className="h-10 border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-mono text-white/20 bg-ink z-20">
        <div className="flex gap-6 uppercase">
          <span>Nodes: {data.tree.length.toLocaleString()}</span>
          <span>System: stable</span>
        </div>
        <div className="flex gap-4">
          <span className="text-accent uppercase tracking-widest font-bold">Encrypted Connection</span>
          <span className="opacity-40">REP-LEN-PRO-2.4</span>
        </div>
      </footer>
    </div>
  );
}

const Cpu = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </svg>
);
