import React from 'react';
import { RepoAnalysis } from '../types';
import { motion } from 'motion/react';
import { Layout, Cpu, Box, FileText, Activity } from 'lucide-react';

interface AnalysisBoardProps {
  analysis: RepoAnalysis;
}

export const AnalysisBoard: React.FC<AnalysisBoardProps> = ({ analysis }) => {
  const cards = [
    {
      title: 'Overview',
      content: analysis.overview,
      icon: <FileText size={18} />,
      span: 'col-span-full'
    },
    {
      title: 'Tech Stack',
      content: (
        <div className="flex flex-wrap gap-2 mt-2">
          {analysis.techStack.map(tech => (
            <span key={tech} className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent uppercase font-mono tracking-wider">
              {tech}
            </span>
          ))}
        </div>
      ),
      icon: <Cpu size={18} />
    },
    {
      title: 'Architecture',
      content: analysis.architecture,
      icon: <Layout size={18} />
    },
    {
      title: 'How It Works',
      content: analysis.howItWorks,
      icon: <Activity size={18} />,
      span: 'col-span-full'
    },
    {
      title: 'Key Files',
      content: (
        <ul className="space-y-2 mt-2">
          {analysis.keyFiles.map((file, i) => (
            <li key={i} className="text-xs text-white/70 flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              {file}
            </li>
          ))}
        </ul>
      ),
      icon: <Box size={18} />
    }
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white/[0.02] border border-white/5 p-6 rounded-none relative overflow-hidden group ${card.span || ''}`}
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
            {card.icon}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-accent"></div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">{card.title}</h4>
          </div>
          <div className="text-[11px] text-white/70 leading-relaxed font-light">
            {card.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
