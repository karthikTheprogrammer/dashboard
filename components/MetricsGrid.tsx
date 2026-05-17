'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Gauge, Target } from 'lucide-react';
import { QueryResponse } from '@/lib/api';

/**
 * MetricsGrid Component
 * 
 * Animated counter metrics showing:
 * - Token reduction percentage
 * - Latency improvements
 * - Retrieval precision
 * - Accuracy score
 * 
 * Uses Framer Motion for smooth number animations
 */

interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'purple' | 'cyan' | 'green';
  description: string;
}

interface MetricsGridProps {
  queryData?: QueryResponse | null;
}

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration: number;
  decimals?: number;
}

/**
 * Animated counter component
 * Smoothly animates from 'from' to 'to' value
 */
const AnimatedCounter = ({
  from,
  to,
  duration,
  decimals = 0,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const currentValue = from + (to - from) * progress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [from, to, duration]);

  return <span>{displayValue.toFixed(decimals)}</span>;
};

export default function MetricsGrid({ queryData }: MetricsGridProps) {
  // Compute metrics from live data; fall back to zeros before first query
  const tokenReduction = React.useMemo(() => {
    if (!queryData?.rag || !queryData?.graph) return 0;
    const { rag, graph } = queryData;
    if (!rag.total_tokens) return 0;
    return Math.max(0, Math.round(((rag.total_tokens - graph.total_tokens) / rag.total_tokens) * 100));
  }, [queryData]);

  const bertImprovement = React.useMemo(() => {
    if (!queryData?.graph || !queryData?.rag) return 0;
    const graphF1 = queryData.graph.bert_f1 ?? queryData.graph.bert_score?.f1 ?? 0;
    const ragF1 = queryData.rag.bert_f1 ?? queryData.rag.bert_score?.f1 ?? 0;
    return Math.round(Math.max(0, (graphF1 - ragF1) * 100));
  }, [queryData]);

  const latencyReduction = React.useMemo(() => {
    if (!queryData?.llm || !queryData?.graph) return 0;
    const { llm, graph } = queryData;
    if (!llm.latency) return 0;
    return Math.max(0, Math.round(((llm.latency - graph.latency) / llm.latency) * 100));
  }, [queryData]);

  const graphBertF1 = React.useMemo(() => {
    if (!queryData?.graph) return 0;
    const graphF1 = queryData.graph.bert_f1 ?? queryData.graph.bert_score?.f1 ?? 0;
    return Math.round(graphF1 * 100);
  }, [queryData]);

  const metrics: Metric[] = [
    {
      id: 'token-reduction',
      label: 'Token Reduction',
      value: tokenReduction,
      suffix: '%',
      icon: Zap,
      color: 'blue',
      description: 'GraphRAG vs Basic RAG',
    },
    {
      id: 'accuracy-gain',
      label: 'BERTScore Gain',
      value: bertImprovement,
      suffix: '%',
      icon: Target,
      color: 'green',
      description: 'GraphRAG vs Basic RAG F1',
    },
    {
      id: 'latency-reduction',
      label: 'Latency Reduction',
      value: latencyReduction,
      suffix: '%',
      icon: TrendingUp,
      color: 'cyan',
      description: 'GraphRAG vs LLM-Only',
    },
    {
      id: 'retrieval-precision',
      label: 'GraphRAG BERTScore',
      value: graphBertF1,
      suffix: '%',
      icon: Gauge,
      color: 'purple',
      description: 'Semantic similarity (F1)',
    },
  ];

  const colorMap = {
    blue: {
      bg: 'from-blue-600/20 to-blue-400/10',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-300',
      accent: 'bg-blue-500/30',
    },
    purple: {
      bg: 'from-purple-600/20 to-purple-400/10',
      border: 'border-purple-400/30',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-300',
      accent: 'bg-purple-500/30',
    },
    cyan: {
      bg: 'from-cyan-600/20 to-cyan-400/10',
      border: 'border-cyan-400/30',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-300',
      accent: 'bg-cyan-500/30',
    },
    green: {
      bg: 'from-green-600/20 to-green-400/10',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20',
      text: 'text-green-300',
      accent: 'bg-green-500/30',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-primary">Performance Metrics</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Key improvements of GraphRAG over traditional RAG approaches
          </p>
        </motion.div>

        {/* Metrics grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => {
            const colors = colorMap[metric.color];
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.id}
                variants={itemVariants}
                className="group relative"
              >
                {/* Animated glow background on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.bg}`}
                />

                {/* Main card */}
                <div
                  className={`relative glass-effect rounded-2xl border ${colors.border} p-8 transition-all duration-300 group-hover:${colors.glow}`}
                >
                  {/* Icon background */}
                  <div className={`${colors.accent} w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Value with animation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mb-2"
                  >
                    <p className={`text-5xl font-bold ${colors.text}`}>
                      <AnimatedCounter
                        from={0}
                        to={metric.value}
                        duration={2}
                        decimals={metric.value % 1 > 0 ? 1 : 0}
                      />
                      <span className="text-3xl font-semibold">{metric.suffix}</span>
                    </p>
                  </motion.div>

                  {/* Label */}
                  <p className="text-sm font-semibold text-white mb-1">
                    {metric.label}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400">
                    {metric.description}
                  </p>

                  {/* Animated bottom border */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.bg}`}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-6 glass-effect rounded-2xl border border-slate-600/30 text-center"
        >
          <p className="text-slate-300">
            <span className="text-cyan-300 font-semibold">GraphRAG</span> achieves superior performance by combining entity extraction, relationship mapping, and multi-hop graph reasoning
          </p>
        </motion.div>
      </div>
    </section>
  );
}
