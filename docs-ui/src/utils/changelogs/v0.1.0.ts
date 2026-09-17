import type { ChangelogProps } from '../types';

export const changelog_0_1_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.1.0',
    prs: ['28634'],
    description: `**BREAKING**: Merged the Stack and Inline component into a single component called Flex.`,
    breaking: true,
    commitSha: '72c9800',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28562'],
    description: `**BREAKING**: This is the first alpha release for Canon. As part of this release we are introducing 5 layout components and 7 components. All theming is done through CSS variables.`,
    breaking: true,
    commitSha: '65f4acc',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28630'],
    description: `**BREAKING**: Fixing css structure and making sure that props are applying the correct styles for all responsive values.`,
    breaking: true,
    commitSha: '1e4ccce',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28789'],
    description: `**BREAKING**: Updated core CSS tokens and fixing the Button component accordingly.`,
    breaking: true,
    commitSha: '8309bdb',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28626'],
    description: `Removed client directive as they are not needed in React 18.`,

    commitSha: '989af25',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28770'],
    description: `Fix spacing props not being applied for custom values.`,

    commitSha: 'f44e5cf',
  },
  {
    components: [],
    version: '0.1.0',
    prs: ['28579'],
    description: `Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.`,

    commitSha: '58ec9e7',
  },
];
