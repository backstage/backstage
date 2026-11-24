import type { ChangelogProps } from '../types';

export const changelog_0_18_0: ChangelogProps[] = [
  {
    components: [
      'button-link',
      'card',
      'combobox-item',
      'header',
      'link',
      'list-row',
      'menu-item',
      'menu-list-box-item',
      'row',
      'search-autocomplete-item',
      'select-item',
      'tab',
      'tag',
    ],
    version: '0.18.0',
    prs: ['35299'],
    description: `Updated BUI links to use the hosting application's client-side router, including relative destinations and the application's configured router base path, while preserving native browser navigation where required.

  **BREAKING**: Anchor-based components no longer accept the React Aria \`render\` prop. BUI now owns the underlying anchor so routing behavior remains consistent across application and plugin package versions.

  ListRow, Tag, and table Row now retain client-side navigation when application and plugin packages load separate React Aria copies. Their existing modifier-key, target, download, and link-metadata behavior is unchanged.`,
    migration: `Remove \`render\` props from ButtonLink, ComboboxItem, Link, MenuItem, MenuListBoxItem, SearchAutocompleteItem, SelectItem, and Tab. BUI now selects and renders the appropriate anchor or router link automatically.`,
    breaking: true,
    commitSha: 'd07e99e',
  },
  {
    components: ['avatar'],
    version: '0.18.0',
    prs: ['35283'],
    description: `Use locale-insensitive Unicode casing for consistent string handling across environments.`,

    commitSha: '736d84e',
  },
  {
    components: [],
    version: '0.18.0',
    prs: ['35247'],
    description: `Prevent BUI styles from overriding document and native control line heights while preserving BUI component typography.`,

    commitSha: 'f914343',
  },
  {
    components: ['table-pagination'],
    version: '0.18.0',
    prs: ['35377'],
    description: `Fixed \`TablePagination\` page-size controls to stay synchronized with controlled values and handle empty option lists without crashing.`,

    commitSha: '947c612',
  },
  {
    components: [],
    version: '0.18.0',
    prs: ['35183'],
    description: `Fixed an issue where using \`PluginHeader\` with \`FullPage\` caused the page to be unexpectedly scrollable. The \`--bui-header-height\` CSS variable now correctly accounts for the header's \`margin-bottom\`, preventing the layout from overflowing the viewport.`,

    commitSha: 'c435198',
  },
  {
    components: ['combobox'],
    version: '0.18.0',
    prs: ['35337'],
    description: `Open \`Combobox\` suggestions when the input receives focus by default.`,

    commitSha: 'c0b26db',
  },
  {
    components: ['use-table'],
    version: '0.18.0',
    prs: ['35375'],
    description: `Fixed pagination state handling in \`useTable\`, including initial offsets, shrinking complete datasets, controlled loading transitions, valid zero and empty cursors, cached error recovery, immediately resolving reloads, and unnecessary reloads when controlled callback identities change.`,

    commitSha: '0dd80f7',
  },
];
