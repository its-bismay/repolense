import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
export const Graph = ({ data, selectedPath, onNodeClick }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare data
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Root node
    const rootNode = { id: 'root', type: 'tree', name: 'root', depth: 0 };
    nodes.push(rootNode);
    nodeMap.set('', rootNode);

    data.forEach(item => {
      const parts = item.path.split('/');
      const name = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      
      const node = {
        id: item.path,
        type: item.type,
        name,
        depth: parts.length
      };
      
      nodes.push(node);
      nodeMap.set(item.path, node);
      links.push({ source: parentPath || 'root', target: item.path });
    });

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50).strength(1))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    const link = g.append('g')
      .attr('stroke', 'rgba(255, 255, 255, 0.05)')
      .selectAll('line')
      .data(links)
      .join('line');

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.id === 'root' ? '' : d.id))
      .call(d3.drag()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }) );

    node.append('circle')
      .attr('r', d => d.type === 'tree' ? 6 : 4)
      .attr('fill', d => {
        if (d.id === selectedPath) return '#D9F99D';
        return d.type === 'tree' ? '#D9F99D' : '#ffffff';
      })
      .attr('opacity', d => d.type === 'tree' ? 1 : 0.6)
      .attr('stroke', '#050505')
      .attr('stroke-width', 2)
      .style('filter', d => d.id === selectedPath ? 'drop-shadow(0 0 12px rgba(217, 249, 157, 0.4))' : 'none');

    node.append('text')
      .text(d => d.name)
      .attr('x', 12)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('fill', d => d.id === selectedPath ? '#D9F99D' : 'rgba(255, 255, 255, 0.4)')
      .attr('font-family', 'JetBrains Mono');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      svg.attr('width', w).attr('height', h);
      simulation.force('center', d3.forceCenter(w / 2, h / 2)).alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, [data, selectedPath]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-ink">
      <div className="grid-background" />
      <svg ref={svgRef} className="w-full h-full relative z-1" />
      <div className="absolute top-6 left-6 p-4 border border-white/10 bg-ink/60 backdrop-blur-sm z-10">
        <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Legend</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
            <div className="w-2 h-2 rounded-none bg-accent" /> Directory
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
            <div className="w-2 h-2 rounded-none bg-white opacity-60" /> Source File
          </div>
        </div>
      </div>
    </div>
  );
};
