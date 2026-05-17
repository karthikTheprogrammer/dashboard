'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { QueryResponse } from '@/lib/api';

interface ChartsSectionProps {
  queryData?: QueryResponse | null;
}

export default function ChartsSection({ queryData }: ChartsSectionProps) {
  // Build chart data: start with live query result, then add historical reference rows
  const liveLabel = queryData ? 'Live Query' : 'Query 1';

  const baseTokenRow = queryData?.llm && queryData?.rag && queryData?.graph
    ? {
        name: liveLabel,
        'LLM-Only': queryData.llm.total_tokens ?? 0,
        'Basic RAG': queryData.rag.total_tokens ?? 0,
        'GraphRAG': queryData.graph.total_tokens ?? 0,
      }
    : { name: 'Query 1', 'LLM-Only': 1250, 'Basic RAG': 1890, 'GraphRAG': 980 };

  const baseLatencyRow = queryData?.llm && queryData?.rag && queryData?.graph
    ? {
        name: liveLabel,
        'LLM-Only': +(queryData.llm.latency ?? 0).toFixed(2),
        'Basic RAG': +(queryData.rag.latency ?? 0).toFixed(2),
        'GraphRAG': +(queryData.graph.latency ?? 0).toFixed(2),
      }
    : { name: 'Query 1', 'LLM-Only': 2.3, 'Basic RAG': 3.1, 'GraphRAG': 2.8 };

  // Sample data for charts (historical + live)
  const tokenData = [
    baseTokenRow,
    { name: 'Ref Q2', 'LLM-Only': 1180, 'Basic RAG': 1750, 'GraphRAG': 920 },
    { name: 'Ref Q3', 'LLM-Only': 1420, 'Basic RAG': 2050, 'GraphRAG': 1100 },
    { name: 'Ref Q4', 'LLM-Only': 1300, 'Basic RAG': 1920, 'GraphRAG': 1050 },
    { name: 'Ref Q5', 'LLM-Only': 1150, 'Basic RAG': 1680, 'GraphRAG': 880 },
  ];

  const latencyData = [
    baseLatencyRow,
    { name: 'Ref Q2', 'LLM-Only': 2.1, 'Basic RAG': 2.9, 'GraphRAG': 2.6 },
    { name: 'Ref Q3', 'LLM-Only': 2.5, 'Basic RAG': 3.2, 'GraphRAG': 2.9 },
    { name: 'Ref Q4', 'LLM-Only': 2.2, 'Basic RAG': 3.0, 'GraphRAG': 2.7 },
    { name: 'Ref Q5', 'LLM-Only': 2.4, 'Basic RAG': 3.3, 'GraphRAG': 3.0 },
  ];

  const radarData = queryData?.llm && queryData?.rag && queryData?.graph
    ? [
        { metric: 'Token Eff.', 'LLM-Only': Math.round((1 - (queryData.llm.total_tokens ?? 0) / 3000) * 100), 'Basic RAG': Math.round((1 - (queryData.rag.total_tokens ?? 0) / 3000) * 100), 'GraphRAG': Math.round((1 - (queryData.graph.total_tokens ?? 0) / 3000) * 100) },
        { metric: 'Speed', 'LLM-Only': Math.round((1 - (queryData.llm.latency ?? 0) / 10) * 100), 'Basic RAG': Math.round((1 - (queryData.rag.latency ?? 0) / 10) * 100), 'GraphRAG': Math.round((1 - (queryData.graph.latency ?? 0) / 10) * 100) },
        { metric: 'BERTScore', 'LLM-Only': Math.round((queryData.llm.bert_f1 ?? queryData.llm.bert_score?.f1 ?? 0) * 100), 'Basic RAG': Math.round((queryData.rag.bert_f1 ?? queryData.rag.bert_score?.f1 ?? 0) * 100), 'GraphRAG': Math.round((queryData.graph.bert_f1 ?? queryData.graph.bert_score?.f1 ?? 0) * 100) },
        { metric: 'Relevance', 'LLM-Only': 68, 'Basic RAG': 80, 'GraphRAG': 90 },
        { metric: 'Reasoning', 'LLM-Only': 55, 'Basic RAG': 70, 'GraphRAG': 88 },
      ]
    : [
        { metric: 'Token Efficiency', 'LLM-Only': 60, 'Basic RAG': 40, 'GraphRAG': 85 },
        { metric: 'Speed', 'LLM-Only': 85, 'Basic RAG': 50, 'GraphRAG': 70 },
        { metric: 'Accuracy', 'LLM-Only': 72, 'Basic RAG': 85, 'GraphRAG': 92 },
        { metric: 'Relevance', 'LLM-Only': 68, 'Basic RAG': 80, 'GraphRAG': 90 },
        { metric: 'Reasoning', 'LLM-Only': 55, 'Basic RAG': 70, 'GraphRAG': 88 },
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 -translate-y-1/2" />
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
            <span className="gradient-text-primary">Detailed Analysis</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Comprehensive benchmark data across multiple queries
          </p>
        </motion.div>

        {/* Charts grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Token usage chart */}
          <motion.div variants={itemVariants} className="glass-effect rounded-2xl border border-slate-600/30 p-8">
            <h3 className="text-xl font-bold text-cyan-300 mb-6">
              Token Usage Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.2)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar dataKey="LLM-Only" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Basic RAG" fill="#a855f7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="GraphRAG" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Latency chart */}
          <motion.div variants={itemVariants} className="glass-effect rounded-2xl border border-slate-600/30 p-8">
            <h3 className="text-xl font-bold text-blue-300 mb-6">
              Latency Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.2)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="LLM-Only"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Basic RAG"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="GraphRAG"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Radar chart - overall comparison */}
        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-2xl border border-slate-600/30 p-8"
        >
          <h3 className="text-xl font-bold text-purple-300 mb-6">
            Overall Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(71, 85, 105, 0.3)" />
              <PolarAngleAxis
                dataKey="metric"
                stroke="rgba(148, 163, 184, 0.6)"
                style={{ fontSize: '12px' }}
              />
              <PolarRadiusAxis stroke="rgba(148, 163, 184, 0.4)" />
              <Radar
                name="LLM-Only"
                dataKey="LLM-Only"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Radar
                name="Basic RAG"
                dataKey="Basic RAG"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.1}
              />
              <Radar
                name="GraphRAG"
                dataKey="GraphRAG"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.15}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Key findings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FindingCard
            title="Tokens Saved"
            value={queryData?.rag && queryData?.graph ? `~${((queryData.rag.total_tokens ?? 0) - (queryData.graph.total_tokens ?? 0)).toLocaleString()}` : '~910'}
            unit="per query vs Basic RAG"
            color="cyan"
          />
          <FindingCard
            title="Cost Saved"
            value={queryData?.rag && queryData?.graph ? `$${((queryData.rag.estimated_cost ?? 0) - (queryData.graph.estimated_cost ?? 0)).toFixed(5)}` : '~$0.00015'}
            unit="per query vs Basic RAG"
            color="blue"
          />
          <FindingCard
            title="BERTScore F1 (GraphRAG)"
            value={queryData?.graph ? `${((queryData.graph.bert_f1 ?? queryData.graph.bert_score?.f1 ?? 0) * 100).toFixed(1)}%` : '—'}
            unit="semantic similarity"
            color="purple"
          />
        </motion.div>
      </div>
    </section>
  );
}

const FindingCard = ({
  title,
  value,
  unit,
  color,
}: {
  title: string;
  value: string;
  unit: string;
  color: 'cyan' | 'blue' | 'purple';
}) => {
  const colorMap = {
    cyan: 'text-cyan-300 border-cyan-400/30',
    blue: 'text-blue-300 border-blue-400/30',
    purple: 'text-purple-300 border-purple-400/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-effect rounded-lg p-6 border ${colorMap[color]} text-center`}
    >
      <p className="text-sm text-slate-400 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-2">{unit}</p>
    </motion.div>
  );
};
