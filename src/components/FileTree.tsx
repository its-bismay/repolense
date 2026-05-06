import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';

interface FileTreeProps {
  data: FileNode[];
  selectedPath?: string;
  onSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  children: Map<string, TreeNode>;
}

export const FileTree: React.FC<FileTreeProps> = ({ data, selectedPath, onSelect }) => {
  const buildTree = () => {
    const root: TreeNode = { name: '', path: '', type: 'tree', children: new Map() };
    data.forEach(item => {
      const parts = item.path.split('/');
      let current = root;
      parts.forEach((part, index) => {
        if (!current.children.has(part)) {
          current.children.set(part, {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: index === parts.length - 1 ? item.type : 'tree',
            children: new Map()
          });
        }
        current = current.children.get(part)!;
      });
    });
    return root;
  };

  const tree = buildTree();

  return (
    <div className="py-4 overflow-y-auto h-full scrollbar-thin bg-surface font-mono">
      <div className="px-4 mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Structure</div>
      </div>
      <div className="space-y-0.5">
        {Array.from(tree.children.values())
          .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'tree' ? -1 : 1))
          .map(node => (
            <TreeItem key={node.path} node={node} selectedPath={selectedPath} onSelect={onSelect} depth={0} />
          ))}
      </div>
    </div>
  );
};

const TreeItem: React.FC<{
  node: TreeNode;
  selectedPath?: string;
  onSelect: (path: string) => void;
  depth: number;
}> = ({ node, selectedPath, onSelect, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isSelected = selectedPath === node.path;
  const isBranch = node.type === 'tree';

  return (
    <div>
      <button
        onClick={() => {
          if (isBranch) setIsOpen(!isOpen);
          onSelect(node.path);
        }}
        className={cn(
          "w-full flex items-center gap-2 py-1.5 px-4 text-[11px] transition-all duration-200 group relative",
          isSelected ? "text-accent bg-accent/5" : "text-white/40 hover:text-accent hover:bg-white/5"
        )}
        style={{ paddingLeft: `${(depth + 1) * 16}px` }}
      >
        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />}
        <span className="flex-shrink-0 opacity-40">
          {isBranch ? (
            isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : (
            <File size={12} />
          )}
        </span>
        <span className={cn("truncate", isBranch && "font-bold uppercase tracking-tighter text-white/60")}>{node.name}</span>
      </button>

      {isBranch && isOpen && (
        <div className={cn(depth > 0 && "border-l border-white/5 ml-[1.125rem] pl-2")}>
          {Array.from(node.children.values())
            .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'tree' ? -1 : 1))
            .map(child => (
              <TreeItem key={child.path} node={child} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
            ))}
        </div>
      )}
    </div>
  );
};
