# GraphRAG Intelligence Dashboard - Frontend

A futuristic, modern Next.js dashboard for the TigerGraph GraphRAG Hackathon project. This dashboard compares three intelligent retrieval pipelines: LLM-Only, Basic RAG, and GraphRAG.

## 🎨 Design Features

### Futuristic AI Aesthetics
- **Dark Theme**: Premium, cyberpunk-inspired design with black backgrounds
- **Glowing Accents**: Cyan, blue, and purple gradient effects with animated glows
- **Glassmorphism**: Modern frosted glass effect on cards and containers
- **Smooth Animations**: Framer Motion-powered transitions and interactions
- **Floating Effects**: Animated particles and depth layering for premium feel

### Key Visual Components
1. **Hero Section**: Animated gradient background with floating particles
2. **Premium Search Bar**: AI-themed input with glowing borders and focus effects
3. **Pipeline Cards**: 3-way comparison with glassmorphism and hover elevation
4. **Metrics Grid**: Animated counters showing key performance improvements
5. **Charts Section**: Recharts visualizations for token usage and latency
6. **Graph Visualization**: Canvas-based entity relationship visualization
7. **Retrieval Display**: Expandable cards showing retrieved context and reasoning

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3 + Custom CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- FastAPI backend running on `http://localhost:8000`

### Setup Steps

1. **Clone and navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure API endpoint** (optional)
Edit `.env.local` and update `NEXT_PUBLIC_API_URL` if your backend is on a different host:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. **Start development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open browser**
Navigate to `http://localhost:3000`

## 📂 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with dark theme setup
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Tailwind + custom animations
├── components/
│   ├── Hero.tsx            # Hero section with particles
│   ├── SearchBar.tsx       # Premium AI search input
│   ├── PipelineCards.tsx   # 3-way pipeline comparison
│   ├── MetricsGrid.tsx     # Animated metric counters
│   ├── ChartsSection.tsx   # Recharts visualizations
│   ├── SimpleGraphVisualization.tsx  # Entity graph
│   └── RetrievalVisualization.tsx    # Retrieval details
├── lib/
│   ├── api.ts             # API client for FastAPI backend
│   └── utils.ts           # Utility functions
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Component Overview

### Hero Component
- Animated gradient background with floating particles
- Staggered fade-in animations
- CTA buttons with hover effects
- Scroll indicator

### SearchBar Component
- Glowing border on focus
- Real-time query input
- Loading state with spinner
- Animated search icon

### PipelineCards Component
- Three comparison cards (LLM-Only, Basic RAG, GraphRAG)
- Glassmorphism design with hover elevation
- Token usage, latency, and accuracy metrics
- Winner badge animation
- Progress bars for efficiency visualization

### MetricsGrid Component
- Animated counter animations using requestAnimationFrame
- Four key metrics with icons
- Color-coded cards with gradient accents
- Hover effects and smooth transitions

### ChartsSection Component
- Bar chart: Token usage comparison
- Line chart: Latency comparison
- Radar chart: Overall performance metrics
- Custom tooltip styling
- Responsive layout

### GraphVisualization Component
- Canvas-based physics simulation (NO Three.js)
- Force-directed graph layout
- Animated nodes and edges
- Beginner-friendly implementation
- Shows entity relationships and reasoning flow

### RetrievalVisualization Component
- Expandable chunk cards
- Semantic similarity scores
- Entity tags within chunks
- Relationship flow visualization
- Multi-step retrieval pipeline illustration

## 🚀 Features

### Animations
- ✨ Page fade-ins and stagger animations
- 🎯 Hover glow effects on cards
- 📊 Animated metric counters
- 🌊 Smooth transitions between states
- 🎨 Gradient animations and effects

### Interactivity
- 🔍 Real-time search with loading state
- 📈 Expandable retrieval details
- 💾 Local storage integration (optional)
- ⌨️ Keyboard support (Enter to search)
- 📱 Fully responsive design

### Performance
- ⚡ Optimized Next.js with SWC compiler
- 🎬 Smooth 60fps animations
- 🔄 Debounced search input
- 📦 Lazy loading and code splitting
- 🖼️ Canvas optimization for graph

## 🔌 API Integration

The dashboard calls your FastAPI backend at `/query` endpoint. Ensure your backend returns data in this format:

```json
{
  "llm": {
    "answer": "...",
    "tokens": 1250,
    "latency": 2.3
  },
  "rag": {
    "answer": "...",
    "tokens": 1890,
    "latency": 3.1,
    "retrieved_chunks": [...]
  },
  "graphrag": {
    "answer": "...",
    "tokens": 980,
    "latency": 2.8,
    "entities": [...],
    "relationships": [...]
  }
}
```

See `lib/api.ts` for all available API functions.

## 🎨 Customization

### Colors
Edit `app/globals.css` to customize the color palette:
- Blue: `#3b82f6`
- Purple: `#8b5cf6`
- Cyan: `#06b6d4`
- Green: `#10b981`

### Animations
All animations are defined in `app/globals.css` under `@keyframes` and can be modified:
- `@keyframes gradientShift` - Background gradient animation
- `@keyframes glow` - Glowing effects
- `@keyframes float` - Floating animations
- Add custom keyframes and use with `animation` property

### Tailwind Theme
Extend the Tailwind config in `tailwind.config.js` for custom colors, spacing, or fonts.

## 📝 Beginner Tips

1. **Component Structure**: Each component is self-contained with inline comments
2. **Animation Patterns**: Use Framer Motion's `motion` components for animations
3. **Styling**: Combine Tailwind classes with custom CSS from `globals.css`
4. **API Calls**: Use functions from `lib/api.ts` to interact with backend
5. **State Management**: Keep state local to components (no Redux needed for this project)

## 🔗 Integration with Backend

1. Ensure FastAPI backend is running:
```bash
cd ..
python -m uvicorn app.main:app --reload
```

2. Update `.env.local` if backend is on different host

3. Test API connection:
```bash
curl http://localhost:8000/health
```

4. Make first query through dashboard UI

## 🐛 Troubleshooting

**API not connecting?**
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Animations not smooth?**
- Ensure hardware acceleration is enabled in browser
- Check browser console for performance warnings
- Reduce number of particles if needed

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Examples](https://recharts.org/examples)

## 📄 License

This project is part of the TigerGraph GraphRAG Hackathon. See main `LICENSE` for details.

---

**Built with ❤️ for the GraphRAG Hackathon** 🚀
