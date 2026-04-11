import { parseCode, collectJsxElements, collectPropsForComponent } from './ast';

// Props that are always valid on any JSX element (HTML/ARIA/React internals)
const ALWAYS_VALID_PROPS = new Set([
  'key',
  'ref',
  'children',
  'className',
  'style',
  'id',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-hidden',
  'aria-expanded',
  'aria-controls',
  'aria-haspopup',
  'aria-live',
  'aria-atomic',
  'aria-selected',
  'aria-checked',
  'aria-disabled',
  'aria-readonly',
  'aria-required',
  'aria-invalid',
  'aria-busy',
  'aria-multiselectable',
  'role',
  'tabIndex',
  'data-testid',
  'onClick',
  'onChange',
  'onSubmit',
  'onBlur',
  'onFocus',
  'onKeyDown',
  'onKeyUp',
  'onMouseEnter',
  'onMouseLeave',
  'type',
  'name',
  'value',
  'defaultValue',
  'placeholder',
  'disabled',
  'required',
  'readOnly',
  'autoFocus',
  'form',
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'width',
  'height',
  'htmlFor',
  // React spread / event forwarding
  '...props',
]);

/**
 * Scores prop accuracy for @backstage/ui components in the generated code.
 *
 * documentedProps: a map of componentName → Set of documented prop names,
 * built by the runner from MCP-fetched docs.
 *
 * Score: 1 - (hallucinated_props / total_ui_props_used), expressed as 0–100.
 * Returns null if no @backstage/ui components with known docs were found.
 */
export function scorePropAccuracy(
  code: string,
  documentedProps: Map<string, Set<string>>,
): number | null {
  const ast = parseCode(code);
  if (!ast) return 0;

  const elements = collectJsxElements(ast);

  let totalProps = 0;
  let hallucinated = 0;

  for (const element of elements) {
    const knownProps = documentedProps.get(element);
    if (!knownProps) continue; // Not a tracked @backstage/ui component

    const usedProps = collectPropsForComponent(ast, element);
    for (const prop of usedProps) {
      if (ALWAYS_VALID_PROPS.has(prop)) continue;
      totalProps++;
      if (!knownProps.has(prop)) {
        hallucinated++;
      }
    }
  }

  if (totalProps === 0) return null;
  return Math.round(((totalProps - hallucinated) / totalProps) * 100);
}
