'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TraceNode {
  id: string;
  label: string;
}

interface TraceEdge {
  source: string;
  target: string;
  label: string;
}

interface RetrievalTrace {
  nodes: TraceNode[];
  edges: TraceEdge[];
  hops: number;
  source?: string;
}

interface SimpleGraphVisualizationProps {
  trace?: RetrievalTrace | null;
  query?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
  label?: string;
}

const PALETTE = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b'];

export default function SimpleGraphVisualization({ trace, query }: SimpleGraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animationRef = useRef<number>();

  // Build graph data from trace or default
  useEffect(() => {
    const width = canvasRef.current?.clientWidth || 800;
    const height = canvasRef.current?.clientHeight || 500;
    const cx = width / 2;
    const cy = height / 2;

    let nodes: Node[];
    let edges: Edge[];

    if (trace && trace.nodes && trace.nodes.length > 0) {
      // Use real TigerGraph trace
      nodes = trace.nodes.map((n, i) => ({
        id: n.id,
        label: n.label.length > 12 ? n.label.slice(0, 12) + '…' : n.label,
        x: cx + Math.cos((i / trace.nodes.length) * Math.PI * 2) * 180,
        y: cy + Math.sin((i / trace.nodes.length) * Math.PI * 2) * 150,
        vx: 0,
        vy: 0,
        size: i === 0 ? 38 : 28,
        color: PALETTE[i % PALETTE.length],
      }));
      edges = trace.edges.map((e) => ({
        source: e.source,
        target: e.target,
        strength: 1,
        label: e.label,
      }));
    } else {
      // Default demo graph
      nodes = [
        { id: 'graphrag', label: 'GraphRAG', x: cx, y: cy, vx: 0, vy: 0, size: 40, color: '#06b6d4' },
        { id: 'entities', label: 'Entities', x: cx - 150, y: cy - 100, vx: 0, vy: 0, size: 30, color: '#3b82f6' },
        { id: 'relations', label: 'Relations', x: cx + 150, y: cy - 100, vx: 0, vy: 0, size: 30, color: '#3b82f6' },
        { id: 'llm', label: 'LLM', x: cx - 150, y: cy + 100, vx: 0, vy: 0, size: 28, color: '#8b5cf6' },
        { id: 'retrieval', label: 'Retrieval', x: cx + 150, y: cy + 100, vx: 0, vy: 0, size: 28, color: '#8b5cf6' },
        { id: 'knowledge', label: 'Knowledge Graph', x: cx, y: cy - 250, vx: 0, vy: 0, size: 28, color: '#10b981' },
        { id: 'response', label: 'Response', x: cx, y: cy + 250, vx: 0, vy: 0, size: 28, color: '#ec4899' },
      ];
      edges = [
        { source: 'graphrag', target: 'entities', strength: 1 },
        { source: 'graphrag', target: 'relations', strength: 1 },
        { source: 'graphrag', target: 'knowledge', strength: 1.2 },
        { source: 'entities', target: 'knowledge', strength: 0.8 },
        { source: 'relations', target: 'knowledge', strength: 0.8 },
        { source: 'graphrag', target: 'llm', strength: 1 },
        { source: 'graphrag', target: 'retrieval', strength: 1 },
        { source: 'knowledge', target: 'retrieval', strength: 1.2 },
        { source: 'llm', target: 'response', strength: 1 },
        { source: 'retrieval', target: 'response', strength: 1 },
      ];
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [trace]);

  // Physics simulation — re-run when trace changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const animate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Physics simulation
      const K = 200; // Spring constant
      const damping = 0.95;
      const repulsion = 5000;
      const timeStep = 0.016; // 60fps

      // Calculate forces
      for (let i = 0; i < nodes.length; i++) {
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;

          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.hypot(dx, dy) || 1;

          // Repulsion
          const repelForce = (repulsion * nodes[i].size * nodes[j].size) / (distance * distance);
          fx -= (dx / distance) * repelForce;
          fy -= (dy / distance) * repelForce;
        }

        // Attraction via edges
        for (const edge of edges) {
          let source, target;

          if (edge.source === nodes[i].id) {
            source = nodes[i];
            target = nodes.find((n) => n.id === edge.target);
          } else if (edge.target === nodes[i].id) {
            source = nodes[i];
            target = nodes.find((n) => n.id === edge.source);
          }

          if (target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.hypot(dx, dy) || 1;
            const targetDistance = 150 / edge.strength;
            const springForce = K * (distance - targetDistance) * edge.strength;

            fx += (dx / distance) * springForce;
            fy += (dy / distance) * springForce;
          }
        }

        // Apply forces with damping
        nodes[i].vx = (nodes[i].vx + fx * timeStep) * damping;
        nodes[i].vy = (nodes[i].vy + fy * timeStep) * damping;

        nodes[i].x += nodes[i].vx * timeStep;
        nodes[i].y += nodes[i].vy * timeStep;

        // Keep nodes in bounds
        nodes[i].x = Math.max(nodes[i].size, Math.min(canvas.width - nodes[i].size, nodes[i].x));
        nodes[i].y = Math.max(nodes[i].size, Math.min(canvas.height - nodes[i].size, nodes[i].y));
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.lineWidth = 2;

      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);

        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();

          // Draw glowing edge for highlight
          ctx.strokeStyle = `rgba(34, 211, 238, 0.1)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const node of nodes) {
        // Node shadow/glow
        ctx.fillStyle = `${node.color}33`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 10, 0, Math.PI * 2);
        ctx.fill();

        // Node body
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = `${node.color}88`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trace]);

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-primary">Knowledge Graph Visualization</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl">
            See how GraphRAG extracts entities, builds relationships, and leverages the knowledge graph for intelligent reasoning
          </p>
        </motion.div>

        {/* Canvas container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl border border-slate-600/30 overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="w-full bg-gradient-to-b from-slate-900/50 to-black/50"
            style={{ minHeight: '500px', display: 'block' }}
          />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"
        >
          <LegendItem color="#06b6d4" label="Core (GraphRAG)" />
          <LegendItem color="#3b82f6" label="Components" />
          <LegendItem color="#10b981" label="Knowledge Graph" />
          <LegendItem color="#8b5cf6" label="Processing" />
          <LegendItem color="#ec4899" label="Output" />
        </motion.div>

        {/* Key insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-effect rounded-xl p-6 border border-slate-600/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">How GraphRAG Works:</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>
              <span className="text-cyan-300 font-semibold">1. Entity Extraction:</span> Identifies key entities in documents
            </li>
            <li>
              <span className="text-cyan-300 font-semibold">2. Relationship Mapping:</span> Discovers connections between entities
            </li>
            <li>
              <span className="text-cyan-300 font-semibold">3. Graph Construction:</span> Builds a structured knowledge graph
            </li>
            <li>
              <span className="text-cyan-300 font-semibold">4. Multi-hop Reasoning:</span> Traverses the graph for deeper insights
            </li>
            <li>
              <span className="text-cyan-300 font-semibold">5. LLM Integration:</span> Combines graph context with language understanding
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    className="flex items-center gap-2"
  >
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span className="text-slate-400">{label}</span>
  </motion.div>
);
