import { parse } from '@typescript-eslint/parser';
import type { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';

export type Node = TSESTree.Node;
export type JSXOpeningElement = TSESTree.JSXOpeningElement;
export type ImportDeclaration = TSESTree.ImportDeclaration;
export type JSXAttribute = TSESTree.JSXAttribute;

/**
 * Parses a TSX string into an ESTree AST.
 * Returns null if parsing fails (e.g. the LLM produced invalid syntax).
 */
export function parseCode(code: string): TSESTree.Program | null {
  try {
    return parse(code, {
      jsx: true,
      range: false,
      loc: false,
    });
  } catch {
    return null;
  }
}

/** Walks an AST node depth-first, calling visitor for every node. */
export function walk(node: Node, visitor: (n: Node) => void): void {
  visitor(node);
  for (const key of Object.keys(node) as (keyof Node)[]) {
    const child = (node as Record<string, unknown>)[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item === 'object' && 'type' in item) {
          walk(item as Node, visitor);
        }
      }
    } else if (child && typeof child === 'object' && 'type' in child) {
      walk(child as Node, visitor);
    }
  }
}

/** Collects all JSX opening element names from an AST. */
export function collectJsxElements(ast: TSESTree.Program): string[] {
  const elements: string[] = [];
  walk(ast as Node, node => {
    if (node.type === ('JSXOpeningElement' as AST_NODE_TYPES)) {
      const el = node as JSXOpeningElement;
      const name = el.name;
      if (name.type === ('JSXIdentifier' as AST_NODE_TYPES)) {
        elements.push((name as TSESTree.JSXIdentifier).name);
      } else if (name.type === ('JSXMemberExpression' as AST_NODE_TYPES)) {
        // e.g. Grid.Root → "Grid.Root"
        const mem = name as TSESTree.JSXMemberExpression;
        if (
          mem.object.type === ('JSXIdentifier' as AST_NODE_TYPES) &&
          mem.property.type === ('JSXIdentifier' as AST_NODE_TYPES)
        ) {
          elements.push(
            `${(mem.object as TSESTree.JSXIdentifier).name}.${
              (mem.property as TSESTree.JSXIdentifier).name
            }`,
          );
        }
      }
    }
  });
  return elements;
}

/** Collects all import declarations as { source, specifiers[] } entries. */
export function collectImports(
  ast: TSESTree.Program,
): Array<{ source: string; specifiers: string[] }> {
  const imports: Array<{ source: string; specifiers: string[] }> = [];
  for (const node of ast.body) {
    if (node.type === ('ImportDeclaration' as AST_NODE_TYPES)) {
      const decl = node as ImportDeclaration;
      const specifiers = decl.specifiers
        .filter(
          s =>
            s.type === ('ImportSpecifier' as AST_NODE_TYPES) ||
            s.type === ('ImportDefaultSpecifier' as AST_NODE_TYPES),
        )
        .map(s => {
          if (s.type === ('ImportSpecifier' as AST_NODE_TYPES)) {
            const imported = (s as TSESTree.ImportSpecifier).imported;
            return imported.type === ('Identifier' as AST_NODE_TYPES)
              ? (imported as TSESTree.Identifier).name
              : '';
          }
          return (s as TSESTree.ImportDefaultSpecifier).local.name;
        })
        .filter(Boolean);
      imports.push({
        source: (decl.source as TSESTree.Literal).value as string,
        specifiers,
      });
    }
  }
  return imports;
}

/** Collects all JSX prop names for a given component name. */
export function collectPropsForComponent(
  ast: TSESTree.Program,
  componentName: string,
): string[] {
  const props: string[] = [];
  walk(ast as Node, node => {
    if (node.type === ('JSXOpeningElement' as AST_NODE_TYPES)) {
      const el = node as JSXOpeningElement;
      const nm = el.name;
      const elName =
        nm.type === ('JSXIdentifier' as AST_NODE_TYPES)
          ? (nm as TSESTree.JSXIdentifier).name
          : '';
      if (elName === componentName) {
        for (const attr of el.attributes) {
          if (attr.type === ('JSXAttribute' as AST_NODE_TYPES)) {
            const a = attr as JSXAttribute;
            if (a.name.type === ('JSXIdentifier' as AST_NODE_TYPES)) {
              props.push((a.name as TSESTree.JSXIdentifier).name);
            }
          }
        }
      }
    }
  });
  return props;
}
