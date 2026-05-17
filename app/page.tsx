'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import PipelineCards from '@/components/PipelineCards';
import MetricsGrid from '@/components/MetricsGrid';
import ChartsSection from '@/components/ChartsSection';
import SimpleGraphVisualization from '@/components/SimpleGraphVisualization';
import RetrievalVisualization from '@/components/RetrievalVisualization';
import { queryAllPipelines, QueryResponse } from '@/lib/api';

/**
 * Main Dashboard Page
 *
 * Wires the real FastAPI backend to every component.
 * State flows from here → children via props.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setLastQuery(query);

    try {
      const data = await queryAllPipelines(query);
      setQueryData(data);
    } catch (err: unknown) {
      console.error('Search error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to reach backend. Is the FastAPI server running on port 8000?';
      setError(message);
      setQueryData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-700/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GR</span>
            </div>
            <span className="hidden sm:inline font-semibold gradient-text-primary">
              GraphRAG Intelligence
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {/* Live backend status indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  error
                    ? 'bg-red-400 animate-pulse'
                    : hasSearched && !isLoading && queryData
                    ? 'bg-green-400'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-400 hidden sm:inline">
                {error ? 'Backend error' : hasSearched && queryData ? 'Live' : 'Ready'}
              </span>
            </div>
            <a href="#metrics" className="text-sm text-slate-300 hover:text-white transition-colors">
              Metrics
            </a>
            <a href="#analysis" className="text-sm text-slate-300 hover:text-white transition-colors">
              Analysis
            </a>
            <a href="#graph" className="text-sm text-slate-300 hover:text-white transition-colors">
              Graph
            </a>
          </motion.div>
        </div>
      </nav>

      {/* Hero section */}
      <Hero />

      {/* Search section */}
      <section className="relative py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Query intelligence badge (shown after search) */}
          <AnimatePresence>
            {queryData?.query_intelligence && !isLoading && (
              <motion.div
                key="qi-badge"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 flex flex-wrap gap-3 justify-center"
              >
                <span className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                  📂 Category:{' '}
                  <span className="text-cyan-300 font-semibold">
                    {queryData.query_intelligence.category}
                  </span>
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                  ⚡ Difficulty:{' '}
                  <span className="text-yellow-300 font-semibold">
                    {queryData.query_intelligence.difficulty}
                  </span>
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                  🏆 Recommended:{' '}
                  <span className="text-green-300 font-semibold">
                    {queryData.query_intelligence.recommended_pipeline}
                  </span>
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                  ⏱ Total latency:{' '}
                  <span className="text-purple-300 font-semibold">
                    {queryData.metadata.overall_latency.toFixed(2)}s
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick tips (only before first search) */}
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col md:flex-row gap-4 justify-center text-xs text-slate-400"
            >
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">📊</span> Compare three pipelines in real-time
              </span>
              <span className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span> BERTScore semantic evaluation
              </span>
              <span className="flex items-center gap-2">
                <span className="text-blue-400">🎯</span> TigerGraph multi-hop reasoning
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pipeline comparison — always visible, shows skeletons while loading */}
      <PipelineCards queryData={queryData} isLoading={isLoading} />

      {/* Metrics section */}
      <section id="metrics">
        <MetricsGrid queryData={queryData} />
      </section>

      {/* Detailed analysis charts */}
      <section id="analysis">
        <ChartsSection queryData={queryData} />
      </section>

      {/* Graph visualization */}
      <section id="graph">
        <SimpleGraphVisualization
          trace={queryData?.graph?.retrieval_trace}
          query={lastQuery}
        />
      </section>

      {/* Retrieval visualization */}
      <section id="retrieval">
        <RetrievalVisualization queryData={queryData} />
      </section>

      {/* CTA section */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="gradient-text-primary">Ready to see GraphRAG in action?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-12"
          >
            Type any query above to compare real-time performance across all three pipelines with live BERTScore evaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/50 hover:shadow-xl transition-all"
            >
              Start Benchmarking
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm"
          >
            <p>
              Built for the{' '}
              <span className="text-cyan-300 font-semibold">TigerGraph GraphRAG Hackathon</span>
            </p>
            <p className="mt-4 md:mt-0">
              LLM-Only · Basic RAG · GraphRAG — powered by Google Gemini &amp; TigerGraph
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-xs"
          >
            <p>© 2024 GraphRAG Intelligence Dashboard. Powered by Next.js, Framer Motion, and Tailwind CSS.</p>
          </motion.div>
        </div>
      </footer>

      {/* Scroll-to-top button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-50"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0l-7 7m7-7v12" />
        </svg>
      </motion.button>
    </main>
  );
}
