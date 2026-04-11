import type { EvalTask, JudgeScores } from '../types';
import { scoreImportCorrectness } from './import-check';
import { scoreComponentSelection } from './component-use';
import { scorePropAccuracy } from './prop-accuracy';
import { scoreRecipeConformance } from './recipe-conformance';
import { extractDocumentedProps } from './props-from-docs';

export interface JudgeInput {
  task: EvalTask;
  code: string;
  /** Raw MCP doc text per component name, for prop accuracy scoring. */
  mcpDocs?: Map<string, string>;
}

/**
 * Runs all applicable judge scorers against the generated code and returns
 * a JudgeScores object with individual dimension scores and a composite.
 */
export function judge(input: JudgeInput): JudgeScores {
  const { task, code, mcpDocs } = input;

  // --- Import correctness ---
  const importCorrectness = scoreImportCorrectness(code);

  // --- Component selection ---
  const componentSelection = scoreComponentSelection(
    code,
    task.relevantComponents,
  );

  // --- Prop accuracy ---
  let propAccuracy: number | null = null;
  if (mcpDocs && mcpDocs.size > 0) {
    const documentedProps = new Map<string, Set<string>>();
    for (const [component, docText] of mcpDocs.entries()) {
      documentedProps.set(component, extractDocumentedProps(docText));
    }
    propAccuracy = scorePropAccuracy(code, documentedProps);
  }

  // --- Recipe conformance (Tier 1 only) ---
  let recipeConformance: number | null = null;
  if (task.tier === 'recipe' && task.requiredCompositionChains) {
    recipeConformance = scoreRecipeConformance(
      code,
      task.requiredCompositionChains,
      task.referenceStoryPath,
    );
  }

  // --- Composite ---
  const dimensions: number[] = [importCorrectness, componentSelection];
  if (propAccuracy !== null) dimensions.push(propAccuracy);
  if (recipeConformance !== null) dimensions.push(recipeConformance);
  const composite = Math.round(
    dimensions.reduce((a, b) => a + b, 0) / dimensions.length,
  );

  return {
    propAccuracy,
    importCorrectness,
    componentSelection,
    recipeConformance,
    composite,
  };
}
