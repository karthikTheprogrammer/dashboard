'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * Premium AI-themed search input with:
 * - Glowing border on focus
 * - Smooth hover effects
 * - Animated search icon
 * - Loading state support
 * - Beginner-friendly implementation
 */

interface SearchBarProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = 'Ask anything about your data...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Glow background effect */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 ${
            isFocused
              ? 'opacity-100 bg-gradient-to-r from-blue-500/40 to-purple-500/40'
              : 'opacity-0'
          }`}
        />

        {/* Main input container */}
        <div
          className={`relative glass-effect rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'border-blue-400/60 shadow-lg shadow-blue-500/20'
              : 'border-slate-600/40'
          }`}
        >
          <div className="flex items-center gap-4 px-6 py-4">
            {/* Search Icon */}
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isLoading ? Infinity : 0 }}
            >
              <Search className="w-5 h-5 text-cyan-400/70" />
            </motion.div>

            {/* Input field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-slate-400/70 focus:outline-none text-lg font-medium"
            />

            {/* Sparkle icon + Submit button */}
            <motion.button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              whileHover={!isLoading && query.trim() ? { scale: 1.05 } : {}}
              whileTap={!isLoading && query.trim() ? { scale: 0.95 } : {}}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isLoading || !query.trim()
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Search</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Animated border glow */}
          {isFocused && (
            <motion.div
              layoutId="searchBorder"
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5))',
                mask: 'linear-gradient(transparent 0%, transparent calc(100% - 4px), black calc(100% - 4px))',
                maskComposite: 'intersect',
              }}
            />
          )}
        </div>

        {/* Helpful suggestion text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-slate-400/70 mt-3"
        >
          💡 Try: "Tell me about AI", "What are the benefits of GraphRAG?"
        </motion.p>
      </motion.div>
    </div>
  );
}
