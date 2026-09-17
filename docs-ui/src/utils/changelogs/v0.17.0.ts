import type { ChangelogProps } from '../types';

export const changelog_0_17_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.17.0',
    prs: ['34540'],
    description: `Added re-exports from \`react-aria-components\`. The types \`Selection\`, \`SortDirection\`, and \`Key\` are available as type-only exports (use \`import type\`), while \`Focusable\` is a runtime export. Consumers can now import these directly from \`@backstage/ui\` instead of depending on \`react-aria-components\`, avoiding version mismatches.`,
    breaking: true,
    commitSha: '503ba32',
  },
  {
    components: ['plugin-header'],
    version: '0.17.0',
    prs: ['34682'],
    description: `Make PluginHeader > Breadcrumbs separator align with rest of text`,

    commitSha: '2341682',
  },
  {
    components: ['plugin-header'],
    version: '0.17.0',
    prs: ['34587'],
    description: `Add \`breadcrumbs\` prop & breadcrumbs to \`PluginHeader\`. When passed \`breadcrumbs\`, \`PluginHeader\` renders a \`nav\` with breadcrumbs & visually hides the plugin title.

  These breadcrumbs:

  - Collapses middle segments if 5 or more segments
  - Shows tooltip if text is truncated`,

    commitSha: '791703e',
  },
  {
    components: [],
    version: '0.17.0',
    prs: ['34611'],
    description: `Added a new \`TextAreaField\` component for multi-line text input, following the same conventions as \`TextField\` with support for a label, secondary label, and description.`,

    commitSha: '066c7ac',
  },
];
