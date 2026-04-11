/**
 * Extracts documented prop names from the raw text returned by the
 * Storybook MCP `get-documentation` tool.
 *
 * The MCP returns markdown-formatted documentation. We look for prop tables
 * (markdown tables with a "Name" or "Prop" header column) and extract the
 * prop names from them.
 */
export function extractDocumentedProps(mcpText: string): Set<string> {
  const props = new Set<string>();

  // Match markdown table rows. Prop names typically appear in the first column.
  // Pattern: | propName | type | ... |
  const tableRowPattern = /^\|\s*`?(\w+)`?\s*\|/gm;
  let match: RegExpExecArray | null;

  while ((match = tableRowPattern.exec(mcpText)) !== null) {
    const candidate = match[1];
    // Skip header rows (Type, Name, Default, Description, etc.)
    const headerWords = new Set([
      'Name',
      'name',
      'Prop',
      'prop',
      'Type',
      'type',
      'Default',
      'default',
      'Description',
      'description',
      'Required',
      'required',
      'Property',
      'property',
    ]);
    if (!headerWords.has(candidate)) {
      props.add(candidate);
    }
  }

  // Also look for JSDoc-style @param entries: `propName` - description
  const jsdocPattern = /[`'](\w+)[`']\s*[-–:]/g;
  while ((match = jsdocPattern.exec(mcpText)) !== null) {
    props.add(match[1]);
  }

  return props;
}
