import type { ChangelogProps } from '../types';

export const changelog_0_9_1: ChangelogProps[] = [
  {
    components: [],
    version: '0.9.1',
    prs: ['31843'],
    description: `Fixed Table Row component to correctly handle cases where no \`href\` is provided, preventing unnecessary router provider wrapping and fixing the cursor incorrectly showing as a pointer despite the element not being a link.`,

    commitSha: 'b3ad928',
  },
  {
    components: [],
    version: '0.9.1',
    prs: ['31817'],
    description: `Fixed \`useTable\` hook to prioritize \`providedRowCount\` over data length for accurate row count in server-side pagination scenarios.`,

    commitSha: 'fe7c751',
  },
  {
    components: [],
    version: '0.9.1',
    prs: ['31844'],
    description: `Fixed Table column sorting indicator to show up arrow when no sort is active, correctly indicating that clicking will sort ascending.`,

    commitSha: 'c145031',
  },
];
