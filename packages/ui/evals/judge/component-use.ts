import { parseCode, collectJsxElements } from './ast';

/**
 * Checks that the generated code uses the expected components for the task.
 *
 * Score: proportion of required components found in JSX (0–100).
 */
export function scoreComponentSelection(
  code: string,
  requiredComponents: string[],
): number {
  if (requiredComponents.length === 0) return 100;

  const ast = parseCode(code);
  if (!ast) return 0;

  const elements = new Set(collectJsxElements(ast));

  // Normalise: Grid.Root matches both "Grid.Root" and "Grid" in the element list
  const matched = requiredComponents.filter(required => {
    if (elements.has(required)) return true;
    // Accept the base name if member expression isn't used
    const base = required.split('.')[0];
    return elements.has(base);
  });

  return Math.round((matched.length / requiredComponents.length) * 100);
}
