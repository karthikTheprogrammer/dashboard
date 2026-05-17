import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s — BERTScore + LLM calls can be slow
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BertScore {
  precision: number;
  recall: number;
  f1: number;
}

export interface PipelineResult {
  answer: string;
  latency: number;           // seconds
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost: number;    // USD
  bert_score: BertScore;
  bert_f1: number;
  // GraphRAG-specific
  retrieved_graph_context?: string;
  retrieval_trace?: {
    nodes: { id: string; label: string }[];
    edges: { source: string; target: string; label: string }[];
    hops: number;
    source?: string;
  };
  retrieval_latency?: number;
  // Basic RAG-specific
  retrieved_context?: string;
  sources?: string[];
}

export interface WinnerAnalysis {
  winner: 'llm' | 'rag' | 'graph';
  scores: { llm: number; rag: number; graph: number };
  summary: string;
  rankings: [string, number][];
  overall_latency: number;
}

export interface QueryIntelligence {
  category: string;
  difficulty: string;
  recommended_pipeline: string;
  expected_complexity: number;
}

export interface QueryResponse {
  llm: PipelineResult;
  rag: PipelineResult;
  graph: PipelineResult;
  analysis: WinnerAnalysis;
  query_intelligence: QueryIntelligence;
  metadata: {
    query: string;
    total_pipelines: number;
    overall_latency: number;
  };
}

export interface EvalResult {
  bert_score: BertScore;
  llm_judge?: {
    pass_fail: string;
    score: number;
    confidence: number;
    factual_correctness: number;
    completeness: number;
    relevance: number;
    explanation: string;
  };
  exact_match: boolean;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Submit a query and get responses from all 3 pipelines with BERTScore.
 */
export const queryAllPipelines = async (query: string): Promise<QueryResponse> => {
  const response = await api.post<QueryResponse>('/query', { query });
  return response.data;
};

/**
 * Evaluate a single prediction against a reference answer.
 */
export const evaluateAnswer = async (
  query: string,
  reference: string,
  prediction: string,
  useJudge = false,
): Promise<{ metrics: EvalResult }> => {
  const response = await api.post('/eval', {
    query,
    reference,
    prediction,
    use_judge: useJudge,
  });
  return response.data;
};

/**
 * Health check — returns { status: "ok" } when backend is up.
 */
export const healthCheck = async (): Promise<{ status: string; timestamp: number }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
