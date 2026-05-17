'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Link2, Eye } from 'lucide-react';
import { QueryResponse } from '@/lib/api';

interface RetrievalVisualizationProps {
  queryData?: QueryResponse | null;
}

interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
  source: string;
  entities: string[];
}

interface EntityRelation {
  entity1: string;
  relation: string;
  entity2: string;
}

export default function RetrievalVisualization({ queryData }: RetrievalVisualizationProps) {
  const [expandedChunk, setExpandedChunk] = useState<string | null>(null);

  // Use real graph context + trace if available, else show demo chunks
  const graphTrace = queryData?.graph?.retrieval_trace;
  const ragContext = queryData?.rag?.retrieved_context || '';
  const graphContext = queryData?.graph?.retrieved_graph_context || '';
  const hops = graphTrace?.hops ?? 0;

  // Sample retrieved chunks
  const chunks: RetrievedChunk[] = [
    {
      id: '1',
      content: 'GraphRAG combines knowledge graphs with retrieval-augmented generation to enable more accurate and relevant responses by leveraging structured entity relationships.',
      similarity: 0.94,
      source: 'Document A',
      entities: ['GraphRAG', 'Knowledge Graph', 'Entity Relationships'],
    },
    {
      id: '2',
      content: 'Entity extraction is a critical step in building knowledge graphs, identifying named entities such as people, organizations, locations, and concepts within documents.',
      similarity: 0.87,
      source: 'Document B',
      entities: ['Entity Extraction', 'Named Entities', 'Knowledge Graphs'],
    },
    {
      id: '3',
      content: 'Multi-hop reasoning allows the system to traverse multiple steps through the knowledge graph, answering complex questions that require understanding connections between distant concepts.',
      similarity: 0.81,
      source: 'Document C',
      entities: ['Multi-hop Reasoning', 'Knowledge Graph', 'Complex Questions'],
    },
  ];

  // Sample entity relationships
  const relations: EntityRelation[] = [
    { entity1: 'GraphRAG', relation: 'uses', entity2: 'Knowledge Graph' },
    { entity1: 'Knowledge Graph', relation: 'contains', entity2: 'Entities' },
    { entity1: 'Entities', relation: 'have', entity2: 'Relationships' },
    { entity1: 'Multi-hop Reasoning', relation: 'traverses', entity2: 'Knowledge Graph' },
  ];

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-primary">Retrieval & Reasoning</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Visualize how GraphRAG retrieves relevant information and reasons across entity relationships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Retrieved chunks */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl font-bold text-cyan-300 mb-6">Retrieved Context</h3>
            <div className="space-y-4">
              {chunks.map((chunk, index) => (
                <ChunkCard
                  key={chunk.id}
                  chunk={chunk}
                  isExpanded={expandedChunk === chunk.id}
                  onToggle={() =>
                    setExpandedChunk(
                      expandedChunk === chunk.id ? null : chunk.id
                    )
                  }
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Entity relationships */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-purple-300 mb-6">
              Entity Relationships
            </h3>
            <div className="space-y-3">
              {relations.map((rel, index) => (
                <RelationCard key={index} relation={rel} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Retrieval flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 glass-effect rounded-2xl border border-slate-600/30 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-8">Retrieval Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FlowStep
              number={1}
              title="Query"
              description="Process user question"
              color="blue"
            />
            <FlowArrow />
            <FlowStep
              number={2}
              title="Entity Extract"
              description="Identify key entities"
              color="purple"
            />
            <FlowArrow />
            <FlowStep
              number={3}
              title="Graph Traverse"
              description="Navigate relationships"
              color="cyan"
            />
            <FlowArrow />
            <FlowStep
              number={4}
              title="Retrieve Chunks"
              description="Gather context"
              color="green"
            />
            <FlowArrow />
            <FlowStep
              number={5}
              title="Generate"
              description="Create response"
              color="pink"
            />
          </div>
        </motion.div>

        {/* Performance insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <InsightBox
            title="Graph BERTScore F1"
            value={queryData?.graph ? `${((queryData.graph.bert_f1 ?? queryData.graph.bert_score?.f1 ?? 0) * 100).toFixed(1)}%` : '—'}
            color="cyan"
          />
          <InsightBox
            title="Graph Hops"
            value={hops > 0 ? `${hops} hop${hops !== 1 ? 's' : ''}` : '—'}
            color="purple"
          />
          <InsightBox
            title="GraphRAG Latency"
            value={queryData?.graph ? `${(queryData.graph.latency ?? 0).toFixed(3)}s` : '—'}
            color="pink"
          />
        </motion.div>
      </div>
    </section>
  );
}

const ChunkCard = ({
  chunk,
  isExpanded,
  onToggle,
  index,
}: {
  chunk: RetrievedChunk;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const similarityPercent = Math.round(chunk.similarity * 100);
  const similarityColor =
    similarityPercent >= 90
      ? 'text-green-300'
      : similarityPercent >= 80
      ? 'text-cyan-300'
      : 'text-yellow-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-effect rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-500/50 transition-colors"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start justify-between hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className={`font-semibold ${similarityColor}`}>
              {similarityPercent}% match
            </span>
            <span className="text-xs text-slate-400">{chunk.source}</span>
          </div>
          <p className="text-slate-300 line-clamp-2 text-sm">
            {chunk.content}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700/50 bg-slate-800/10"
          >
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  Full Content
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {chunk.content}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider">
                  Extracted Entities
                </p>
                <div className="flex flex-wrap gap-2">
                  {chunk.entities.map((entity, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-xs text-cyan-300"
                    >
                      {entity}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">
                  Used in multi-hop reasoning chain
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RelationCard = ({
  relation,
  index,
}: {
  relation: EntityRelation;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-effect rounded-lg border border-purple-400/30 p-4 hover:border-purple-400/50 transition-colors"
  >
    <div className="flex items-center gap-2 text-sm">
      <span className="text-cyan-300 font-semibold truncate">
        {relation.entity1}
      </span>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <Link2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
        <span className="text-purple-400 text-xs font-medium">
          {relation.relation}
        </span>
      </div>
      <span className="text-pink-300 font-semibold truncate">
        {relation.entity2}
      </span>
    </div>
  </motion.div>
);

const FlowStep = ({
  number,
  title,
  description,
  color,
}: {
  number: number;
  title: string;
  description: string;
  color: string;
}) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> =
    {
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-400/50',
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-400/50',
      },
      cyan: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-300',
        border: 'border-cyan-400/50',
      },
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-400/50',
      },
      pink: {
        bg: 'bg-pink-500/20',
        text: 'text-pink-300',
        border: 'border-pink-400/50',
      },
    };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${c.bg} border ${c.border} rounded-lg p-4 text-center`}
    >
      <div className={`text-2xl font-bold ${c.text} mb-2`}>{number}</div>
      <p className="font-semibold text-white text-sm mb-1">{title}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </motion.div>
  );
};

const FlowArrow = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="flex items-center justify-center"
  >
    <div className="text-slate-500 hidden md:block">→</div>
  </motion.div>
);

const InsightBox = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => {
  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-400/30 text-cyan-300',
    purple: 'border-purple-400/30 text-purple-300',
    pink: 'border-pink-400/30 text-pink-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-effect rounded-lg border ${colorMap[color]} p-6 text-center`}
    >
      <p className="text-sm text-slate-400 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color].split(' ')[1]}`}>
        {value}
      </p>
    </motion.div>
  );
};
