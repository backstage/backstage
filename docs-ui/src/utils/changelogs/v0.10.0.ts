import type { ChangelogProps } from '../types';

export const changelog_0_10_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.10.0',
    prs: ['31917'],
    description: `**BREAKING**: The \`Cell\` component has been refactored to be a generic wrapper component that accepts \`children\` for custom cell content. The text-specific functionality (previously part of \`Cell\`) has been moved to a new \`CellText\` component.`,
    migration: `If you were using \`Cell\` with text-specific props (\`title\`, \`description\`, \`leadingIcon\`, \`href\`), you need to update your code to use \`CellText\` instead:

**Before:**

\`\`\`tsx
<Cell
  title="My Title"
  description="My description"
  leadingIcon={<Icon />}
  href="/path"
/>
\`\`\`

**After:**

\`\`\`tsx
<CellText
  title="My Title"
  description="My description"
  leadingIcon={<Icon />}
  href="/path"
/>
\`\`\`

For custom cell content, use the new generic \`Cell\` component:

\`\`\`tsx
<Cell>{/* Your custom content */}</Cell>
\`\`\``,
    breaking: true,
    commitSha: '16543fa',
  },
  {
    components: ['checkbox'],
    version: '0.10.0',
    prs: ['31904'],
    description: `Fixed Checkbox indicator showing checkmark color when unchecked.`,

    commitSha: '50b7927',
  },
  {
    components: ['button-icon'],
    version: '0.10.0',
    prs: ['31900'],
    description: `Fixed \`ButtonIcon\` incorrectly applying \`className\` to inner elements instead of only the root element.`,

    commitSha: '5bacf55',
  },
  {
    components: [],
    version: '0.10.0',
    prs: ['31843'],
    description: `Fixed Table Row component to correctly handle cases where no \`href\` is provided, preventing unnecessary router provider wrapping and fixing the cursor incorrectly showing as a pointer despite the element not being a link.`,

    commitSha: 'b3ad928',
  },
  {
    components: ['table'],
    version: '0.10.0',
    prs: ['31907'],
    description: `Added row selection support with visual state styling for hover, selected, and pressed states. Fixed checkbox rendering to only show for multi-select toggle mode.`,

    commitSha: 'a20d317',
  },
  {
    components: [],
    version: '0.10.0',
    prs: ['31817'],
    description: `Fixed \`useTable\` hook to prioritize \`providedRowCount\` over data length for accurate row count in server-side pagination scenarios.`,

    commitSha: 'fe7c751',
  },
  {
    components: [],
    version: '0.10.0',
    prs: ['31844'],
    description: `Fixed Table column sorting indicator to show up arrow when no sort is active, correctly indicating that clicking will sort ascending.`,

    commitSha: 'c145031',
  },
];
