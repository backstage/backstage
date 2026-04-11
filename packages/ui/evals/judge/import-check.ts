import { parseCode, collectImports, collectJsxElements } from './ast';

/**
 * Checks that all @backstage/ui components used as JSX elements are imported
 * from "@backstage/ui" and not from some other path.
 *
 * Score: proportion of @backstage/ui components correctly imported (0–100).
 * Returns 100 if parsing fails (we penalise this elsewhere).
 */
export function scoreImportCorrectness(code: string): number {
  const ast = parseCode(code);
  if (!ast) return 0;

  const imports = collectImports(ast);
  const jsxElements = new Set(collectJsxElements(ast));

  // Collect what is imported from @backstage/ui
  const importedFromUi = new Set<string>();
  for (const imp of imports) {
    if (imp.source === '@backstage/ui') {
      for (const s of imp.specifiers) importedFromUi.add(s);
    }
  }

  // Collect everything imported from other packages (excluding React, react-router, etc.)
  const importedFromElsewhere = new Map<string, string>();
  const allowedExternal = new Set([
    'react',
    'react-dom',
    'react-router-dom',
    'react-router',
    '@remixicon/react',
  ]);
  for (const imp of imports) {
    if (imp.source !== '@backstage/ui' && !allowedExternal.has(imp.source)) {
      for (const s of imp.specifiers) {
        importedFromElsewhere.set(s, imp.source);
      }
    }
  }

  // Find @backstage/ui components used in JSX but imported from somewhere else
  const misrouted = [...importedFromUi].filter(
    name => jsxElements.has(name) && importedFromElsewhere.has(name),
  );

  const totalUiComponents = importedFromUi.size;
  if (totalUiComponents === 0) return 50; // No UI components used at all
  const correct = totalUiComponents - misrouted.length;
  return Math.round((correct / totalUiComponents) * 100);
}
