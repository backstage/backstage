export type EvalTier = 'recipe' | 'component';

export interface EvalTask {
  id: string;
  tier: EvalTier;
  title: string;
  prompt: string;
  relevantComponents: string[];
  /** Source recipe story file path (relative to repo root), Tier 1 only. */
  referenceStoryPath?: string;
  /** Key JSX composition chains that must appear in Tier 1 output, e.g. [['Grid', 'Card', 'List', 'ListRow']] */
  requiredCompositionChains?: string[][];
}

export interface JudgeScores {
  propAccuracy: number | null;
  importCorrectness: number;
  componentSelection: number;
  /** Only set for Tier 1 (recipe) tasks. */
  recipeConformance: number | null;
  /** Weighted composite: average of all non-null dimensions. */
  composite: number;
}

export interface EvalResult {
  taskId: string;
  tier: EvalTier;
  mode: 'baseline' | 'mcp';
  generatedCode: string;
  scores: JudgeScores;
  mcpDocsUsed?: string[];
  durationMs: number;
  error?: string;
}

export interface RunReport {
  timestamp: string;
  results: EvalResult[];
}
