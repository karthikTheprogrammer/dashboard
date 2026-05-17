'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Hero Component
 * 
 * Creates a futuristic, animated hero section with:
 * - Animated gradient background
 * - Floating particles
 * - Glowing text effects
 * - Smooth fade-in animations
 * 
 * DESIGN: AI-native, premium, intelligence platform vibes
 */

// Floating particle component for background effect
// x/y are 0-100 numbers used as CSS left/top percentages.
// Motion animates a separate translateY offset (pure numbers, no unit mixing).
const Particle = ({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) => (
  <motion.div
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, translateY: 0, translateX: 0 }}
    animate={{
      opacity: [0, 0.5, 0],
      translateY: [0, -60, -120],
      translateX: [0, 12, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none blur-sm"
  />
);

// Generate random particles for background
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 5 + Math.random() * 3,
  }));
};

export default function Hero() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(generateParticles(30));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pt-20 pb-32">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />

      {/* Glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-floatSlow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-floatSlow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-floatSlow" style={{ animationDelay: '4s' }} />

      {/* Animated particles */}
      <div className="absolute inset-0 w-full h-full">
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
            x={particle.x}
            y={particle.y}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium">
            ✨ Futuristic AI Intelligence Platform
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="gradient-text-primary inline-block">GraphRAG</span>
          <br />
          <span className="text-white">Intelligence Dashboard</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Comparing three intelligent retrieval pipelines on{' '}
          <span className="text-cyan-400 font-semibold">token efficiency</span>,{' '}
          <span className="text-blue-400 font-semibold">latency</span>, and{' '}
          <span className="text-purple-400 font-semibold">accuracy</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
          >
            Explore Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-slate-800/50 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition-all duration-300"
          >
            View Metrics
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <svg
          className="w-6 h-6 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
}
