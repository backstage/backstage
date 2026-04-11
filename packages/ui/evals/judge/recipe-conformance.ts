import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCode, collectJsxElements } from './ast';

/**
 * Checks whether the generated code follows the composition patterns
 * defined in the reference recipe story.
 *
 * For each required chain (e.g. ['Grid', 'Card', 'CardBody', 'List', 'ListRow']),
 * we check that ALL members of the chain appear in the generated JSX element list.
 * A chain is considered "matched" if every component in it is present.
 *
 * Score: (matched_chains / total_chains) × 100
 * Returns null if there are no chains to check (Tier 2 tasks).
 */
export function scoreRecipeConformance(
  code: string,
  requiredChains: string[][],
  referenceStoryPath?: string,
): number | null {
  if (!requiredChains || requiredChains.length === 0) return null;

  const ast = parseCode(code);
  if (!ast) return 0;

  const elements = new Set(collectJsxElements(ast));

  // Also add base names of member expressions, e.g. "Grid.Root" → also check "Grid"
  const normalised = new Set<string>();
  for (const el of elements) {
    normalised.add(el);
    normalised.add(el.split('.')[0]);
  }

  let matched = 0;
  for (const chain of requiredChains) {
    const allPresent = chain.every(
      component =>
        normalised.has(component) || normalised.has(component.split('.')[0]),
    );
    if (allPresent) matched++;
  }

  // Optionally log which components from the reference story are missing
  if (referenceStoryPath) {
    try {
      const repoRoot = join(new URL('../../..', import.meta.url).pathname);
      const referenceCode = readFileSync(
        join(repoRoot, referenceStoryPath),
        'utf-8',
      );
      const refAst = parseCode(referenceCode);
      if (refAst) {
        const refElements = new Set(collectJsxElements(refAst));
        const missing = [...refElements].filter(
          el => !normalised.has(el) && !normalised.has(el.split('.')[0]),
        );
        if (missing.length > 0) {
          // Available for debugging — not surfaced in score
          (scoreRecipeConformance as { lastMissing?: string[] }).lastMissing =
            missing;
        }
      }
    } catch {
      // Reference story not readable — continue without it
    }
  }

  return Math.round((matched / requiredChains.length) * 100);
}
