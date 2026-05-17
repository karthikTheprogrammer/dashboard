'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, BarChart3, Trophy, Brain, Database, Network, DollarSign, Clock } from 'lucide-react';
import { QueryResponse, PipelineResult } from '@/lib/api';

interface PipelineCardsProps {
  queryData?: QueryResponse | null;
  isLoading?: boolean;
}

interface CardConfig {
  key: 'llm' | 'rag' | 'graph';
  label: 'LLM-Only' | 'Basic RAG' | 'GraphRAG';
  subtitle: string;
  color: 'blue' | 'purple' | 'cyan';
  icon: React.ComponentType<{ className?: string }>;
}

const CARDS: CardConfig[] = [
  {
    key: 'llm',
    label: 'LLM-Only',
    subtitle: 'Baseline — Direct LLM response, no retrieval',
    color: 'blue',
    icon: Brain,
  },
  {
    key: 'rag',
    label: 'Basic RAG',
    subtitle: 'Industry standard — Vector similarity search + LLM',
    color: 'purple',
    icon: Database,
  },
  {
    key: 'graph',
    label: 'GraphRAG',
    subtitle: 'Advanced — TigerGraph multi-hop entity reasoning',
    color: 'cyan',
    icon: Network,
  },
];

const COLOR_MAP = {
  blue: {
    gradient: 'from-blue-600 to-blue-400',
    glow: 'shadow-blue-500/30',
    border: 'border-blue-400/50',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    bar: 'from-blue-600 to-blue-400',
  },
  purple: {
    gradient: 'from-purple-600 to-purple-400',
    glow: 'shadow-purple-500/30',
    border: 'border-purple-400/50',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    bar: 'from-purple-600 to-purple-400',
  },
  cyan: {
    gradient: 'from-cyan-600 to-cyan-400',
    glow: 'shadow-cyan-500/30',
    border: 'border-cyan-400/50',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    bar: 'from-cyan-600 to-cyan-400',
  },
};

/** Skeleton card shown while loading */
const SkeletonCard = ({ color }: { color: 'blue' | 'purple' | 'cyan' }) => {
  const colors = COLOR_MAP[color];
  return (
    <div className={`glass-effect rounded-2xl border ${colors.border} p-8 animate-pulse`}>
      <div className="h-7 w-32 bg-slate-700/50 rounded mb-2" />
      <div className="h-4 w-48 bg-slate-700/30 rounded mb-6" />
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-slate-700/40 rounded" />
        <div className="h-4 bg-slate-700/40 rounded w-5/6" />
        <div className="h-4 bg-slate-700/40 rounded w-4/6" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-24 bg-slate-700/40 rounded" />
            <div className="h-3 w-16 bg-slate-700/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricRow = ({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: 'blue' | 'purple' | 'cyan';
  sub?: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${COLOR_MAP[color].text}`} />
      <span className="text-sm text-slate-300">{label}</span>
      {sub && <span className="text-xs text-slate-500">({sub})</span>}
    </div>
    <span className={`font-semibold tabular-nums ${COLOR_MAP[color].text}`}>{value}</span>
  </div>
);

const BertScoreBar = ({
  f1,
  color,
}: {
  f1: number;
  color: 'blue' | 'purple' | 'cyan';
}) => (
  <div>
    <div className="flex justify-between text-xs text-slate-400 mb-1">
      <span>BERTScore F1</span>
      <span className={`font-semibold ${COLOR_MAP[color].text}`}>{(f1 * 100).toFixed(1)}%</span>
    </div>
    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${f1 * 100}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`h-full bg-gradient-to-r ${COLOR_MAP[color].bar}`}
      />
    </div>
  </div>
);

const PipelineCard = ({
  config,
  result,
  isWinner,
  index,
}: {
  config: CardConfig;
  result: PipelineResult;
  isWinner: boolean;
  index: number;
}) => {
  const colors = COLOR_MAP[config.color];
  const Icon = config.icon;
  const bert = result.bert_score ?? { precision: 0, recall: 0, f1: 0 };
  const tokenEfficiency = Math.max(0, 1 - result.total_tokens / 3000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glow on hover */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-br ${colors.gradient}`}
      />

      {/* Card */}
      <div
        className={`relative glass-effect rounded-2xl border ${colors.border} p-8 h-full transition-shadow duration-300 group-hover:shadow-2xl group-hover:${colors.glow}`}
      >
        {/* Winner badge */}
        {isWinner && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.12 + 0.3, type: 'spring' }}
            className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-3 shadow-lg shadow-cyan-500/50"
          >
            <Trophy className="w-5 h-5 text-white" />
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-5 h-5 ${colors.text}`} />
              <h3 className={`text-xl font-bold ${isWinner ? colors.text : 'text-white'}`}>
                {config.label}
              </h3>
            </div>
            <p className="text-xs text-slate-400">{config.subtitle}</p>
          </div>
          {isWinner && (
            <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${colors.badge}`}>
              Winner
            </span>
          )}
        </div>

        {/* Answer */}
        <div className="mb-5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 min-h-[80px]">
          <p className="text-sm text-slate-200 leading-relaxed line-clamp-4">
            {result.answer || 'No response'}
          </p>
        </div>

        {/* Metrics */}
        <div className="space-y-3 mb-5">
          <MetricRow
            icon={Clock}
            label="Latency"
            value={`${result.latency.toFixed(3)}s`}
            color={config.color}
          />
          <MetricRow
            icon={BarChart3}
            label="Tokens"
            value={result.total_tokens.toLocaleString()}
            color={config.color}
            sub={`$${result.estimated_cost.toFixed(6)}`}
          />
          <MetricRow
            icon={Zap}
            label="Prompt / Completion"
            value={`${result.prompt_tokens} / ${result.completion_tokens}`}
            color={config.color}
          />
          <MetricRow
            icon={TrendingDown}
            label="Token Efficiency"
            value={`${(tokenEfficiency * 100).toFixed(1)}%`}
            color={config.color}
          />
        </div>

        {/* BERTScore bar */}
        <BertScoreBar f1={bert.f1} color={config.color} />

        {/* BERTScore sub-metrics */}
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span>P: <span className={colors.text}>{(bert.precision * 100).toFixed(1)}%</span></span>
          <span>R: <span className={colors.text}>{(bert.recall * 100).toFixed(1)}%</span></span>
          <span>F1: <span className={`font-bold ${colors.text}`}>{(bert.f1 * 100).toFixed(1)}%</span></span>
        </div>

        {/* GraphRAG context snippet */}
        {config.key === 'graph' && result.retrieved_graph_context && (
          <div className="mt-4 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 font-semibold mb-1">Graph Context Retrieved</p>
            <p className="text-xs text-slate-400 line-clamp-2">{result.retrieved_graph_context}</p>
            {result.retrieval_latency !== undefined && (
              <p className="text-xs text-slate-500 mt-1">
                Retrieval: {result.retrieval_latency.toFixed(3)}s
              </p>
            )}
          </div>
        )}

        {/* Basic RAG sources */}
        {config.key === 'rag' && result.sources && result.sources.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
            <p className="text-xs text-purple-400 font-semibold mb-1">Sources Retrieved</p>
            <div className="flex flex-wrap gap-1">
              {result.sources.slice(0, 3).map((src, i) => (
                <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  {src.split('/').pop() ?? src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function PipelineCards({ queryData, isLoading = false }: PipelineCardsProps) {
  const winner = queryData?.analysis?.winner;

  // Compute insight stats from real data
  const insights = React.useMemo(() => {
    if (!queryData) return null;
    const { llm, rag, graph } = queryData;
    
    // Add safety checks in case partial data is received
    if (!llm || !rag || !graph) return null;

    const tokenReduction =
      rag.total_tokens > 0
        ? Math.round(((rag.total_tokens - graph.total_tokens) / rag.total_tokens) * 100)
        : 0;
    // bert_f1 may come as a flat field or nested under bert_score.f1 — handle both
    const graphF1 = graph.bert_f1 ?? graph.bert_score?.f1 ?? 0;
    const ragF1   = rag.bert_f1   ?? rag.bert_score?.f1   ?? 0;
    const llmLatency   = llm.latency   ?? 0;
    const graphLatency = graph.latency ?? 0;
    const bertImprovement = Math.round((graphF1 - ragF1) * 100);
    const latencyDelta = llmLatency > 0
      ? Math.round(((llmLatency - graphLatency) / llmLatency) * 100)
      : 0;
    return { tokenReduction, bertImprovement, latencyDelta };
  }, [queryData]);

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-primary">Pipeline Comparison</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {queryData
              ? 'Live results — all metrics computed from real pipeline runs'
              : 'Submit a query above to see real-time results across all three pipelines'}
          </p>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {CARDS.map((c) => (
              <SkeletonCard key={c.key} color={c.color} />
            ))}
          </div>
        ) : queryData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {CARDS.map((c, i) => (
              <PipelineCard
                key={c.key}
                config={c}
                result={queryData[c.key]}
                isWinner={winner === c.key}
                index={i}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {CARDS.map((c) => (
              <div
                key={c.key}
                className={`glass-effect rounded-2xl border ${COLOR_MAP[c.color].border} p-8 flex flex-col items-center justify-center min-h-[300px] text-center`}
              >
                <c.icon className={`w-10 h-10 ${COLOR_MAP[c.color].text} mb-4 opacity-40`} />
                <p className={`text-lg font-semibold ${COLOR_MAP[c.color].text} mb-1`}>{c.label}</p>
                <p className="text-sm text-slate-500">Awaiting query…</p>
              </div>
            ))}
          </div>
        )}

        {/* Real insight stats */}
        {insights && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <InsightCard
              title="Token Reduction"
              value={`${insights.tokenReduction > 0 ? '-' : '+'}${Math.abs(insights.tokenReduction)}%`}
              description="GraphRAG vs Basic RAG"
              icon="⚡"
              positive={insights.tokenReduction > 0}
            />
            <InsightCard
              title="BERTScore Δ"
              value={`${insights.bertImprovement >= 0 ? '+' : ''}${insights.bertImprovement}%`}
              description="GraphRAG vs Basic RAG F1"
              icon="🎯"
              positive={insights.bertImprovement >= 0}
            />
            <InsightCard
              title="Latency vs LLM"
              value={`${insights.latencyDelta >= 0 ? '-' : '+'}${Math.abs(insights.latencyDelta)}%`}
              description="GraphRAG vs LLM-Only"
              icon="⏱️"
              positive={insights.latencyDelta >= 0}
            />
          </motion.div>
        )}

        {/* Winner summary */}
        {queryData?.analysis?.summary && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-6 glass-effect rounded-2xl border border-cyan-500/20 text-center"
          >
            <p className="text-sm text-slate-300">
              <span className="text-cyan-300 font-semibold">🏆 Analysis: </span>
              {queryData.analysis.summary}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const InsightCard = ({
  title,
  value,
  description,
  icon,
  positive,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  positive: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="glass-effect rounded-xl p-6 text-center border border-slate-700/50 hover:border-cyan-400/50 transition-colors"
  >
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-slate-400 text-sm mb-2">{title}</p>
    <p className={`text-3xl font-bold mb-1 ${positive ? 'text-cyan-300' : 'text-red-400'}`}>{value}</p>
    <p className="text-xs text-slate-500">{description}</p>
  </motion.div>
);
