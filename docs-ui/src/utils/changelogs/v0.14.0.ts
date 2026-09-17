import type { ChangelogProps } from '../types';

export const changelog_0_14_0: ChangelogProps[] = [
  {
    components: ['header'],
    version: '0.14.0',
    prs: ['33527'],
    description: `**BREAKING**: The \`Header\` component's \`tabs\` prop now uses \`HeaderNavTabItem[]\` instead of \`HeaderTab[]\`. Tabs render as a \`<nav>\` element with links and optional dropdown menus instead of \`role="tablist"\`. A new \`activeTabId\` prop controls which tab is highlighted.`,
    migration: `\`\`\`diff
- import { Header, type HeaderTab } from '@backstage/ui';
+ import { Header, type HeaderNavTabItem } from '@backstage/ui';

  // Tabs no longer support matchStrategy — active state is controlled via activeTabId
- const tabs: HeaderTab[] = [
-   { id: 'overview', label: 'Overview', href: '/overview', matchStrategy: 'prefix' },
+ const tabs: HeaderNavTabItem[] = [
+   { id: 'overview', label: 'Overview', href: '/overview' },
  ];

- <Header title="My Page" tabs={tabs} />
+ <Header title="My Page" tabs={tabs} activeTabId="overview" />
\`\`\``,
    breaking: true,
    commitSha: '8659f33',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33422'],
    description: `**BREAKING**: Dropped support for React 17. The minimum supported React version is now 18.`,
    breaking: true,
    commitSha: 'bed3307',
  },
  {
    components: ['header'],
    version: '0.14.0',
    prs: ['33783'],
    description: `**BREAKING**: Tab \`href\` values in the Header component are now resolved through the router context instead of being passed raw to the \`<a>\` tag. This means relative \`href\` values (e.g. \`sub3\`, \`./sub4\`, \`../catalog\`) are now resolved against the current route, and absolute \`href\` values may be affected by the router's \`basename\` configuration.`,
    migration: `Tab navigation should work the same for absolute \`href\` values in most setups. If you use relative \`href\` values in tabs, verify they resolve as expected. If your app configures a router \`basename\`, check that absolute tab \`href\` values still navigate correctly.`,
    breaking: true,
    commitSha: 'b4a1875',
  },
  {
    components: ['plugin-header'],
    version: '0.14.0',
    prs: ['33504'],
    description: `**BREAKING**: Removed the \`toolbarWrapper\` element from \`PluginHeader\` and dropped \`toolbarWrapper\` from \`PluginHeaderDefinition.classNames\`. Toolbar layout styles now live on \`toolbar\` (\`.bui-PluginHeaderToolbar\`).

  **Migration:** Update custom CSS that targeted \`.bui-PluginHeaderToolbarWrapper\` to use \`.bui-PluginHeaderToolbar\` instead.`,
    breaking: true,
    commitSha: '49ffe8a',
  },
  {
    components: ['badge'],
    version: '0.14.0',
    prs: ['33744'],
    description: `Added new \`Badge\` component for non-interactive labeling and categorization of content. It shares the visual appearance of \`Tag\` but renders as a plain DOM element with no interactive states.`,

    commitSha: '4032ad7',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33687'],
    description: `Bumped \`glob\` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped \`rollup\` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).`,

    commitSha: '2e5c5f8',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33804'],
    description: `Resolved route-relative \`href\` props to absolute paths by default in all components, removing the need for the \`resolveHref\` option in component definitions.`,

    commitSha: '2840476',
  },
  {
    components: ['header'],
    version: '0.14.0',
    prs: ['33783'],
    description: `Added automatic active tab detection to the Header component. When \`activeTabId\` is omitted, the active tab is now auto-detected from the current route using \`matchRoutes\`. Pass an explicit \`activeTabId\` to override, or \`null\` for no active tab.`,

    commitSha: 'b4a1875',
  },
  {
    components: ['slider'],
    version: '0.14.0',
    prs: ['33112'],
    description: `Added RangeSlider component for selecting numeric ranges.`,

    commitSha: '8d79835',
  },
  {
    components: ['search-autocomplete'],
    version: '0.14.0',
    prs: ['33437'],
    description: `Made \`SearchAutocomplete\` background-aware. The input now adapts its background color based on its parent container's background level.`,

    commitSha: 'bcbb6eb',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33731'],
    description: `Exported the \`TableBodySkeleton\` component as a public API for use outside of the built-in \`Table\` component. The component now accepts any column array whose items have an \`id\` property, making it compatible with custom column types.`,

    commitSha: 'f73876a',
  },
  {
    components: ['avatar'],
    version: '0.14.0',
    prs: ['33574'],
    description: `Fixed \`Avatar\` becoming elliptical in flex layouts by preventing it from shrinking.`,

    commitSha: '5081bcc',
  },
  {
    components: [
      'button-link',
      'card',
      'cell-profile',
      'cell-text',
      'link',
      'list-row',
      'menu-item',
      'menu-list-box-item',
      'row',
      'search-autocomplete-item',
      'tab',
      'tag',
    ],
    version: '0.14.0',
    prs: ['33597'],
    description: `Fixed relative \`href\` resolution for BUI link components. Relative paths like \`../other\` are now correctly turned into absolute paths before reaching the React Aria layer, ensuring client-side navigation goes to the right place.`,

    commitSha: 'd840ba9',
  },
  {
    components: ['plugin-header'],
    version: '0.14.0',
    prs: ['33437'],
    description: `Added \`aria-hidden\` to the \`PluginHeader\` icon to prevent screen readers from announcing decorative plugin icons.`,

    commitSha: '8c2e24e',
  },
  {
    components: ['use-table'],
    version: '0.14.0',
    prs: ['33614'],
    description: `Added support for disabling pagination in \`useTable\` complete mode by setting \`paginationOptions: { type: 'none' }\`. This skips data slicing and produces \`pagination: { type: 'none' }\` in \`tableProps\`, removing the need for consumers to manually override the pagination prop on \`Table\`. Also fixed complete mode not reacting to dynamic changes in \`paginationOptions.pageSize\`.`,

    commitSha: '3bc23a5',
  },
  {
    components: ['dialog'],
    version: '0.14.0',
    prs: ['33785'],
    description: `Added \`ModalOverlay\` to \`Dialog\` so overlay styles are applied to the actual overlay rather than the modal content, and fixed dismissing via outside click in the process.`,

    commitSha: '67b8881',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33051'],
    description: `Add an initial CheckboxGroup component implementation and docs coverage.`,

    commitSha: 'aa47a37',
  },
  {
    components: ['tabs'],
    version: '0.14.0',
    prs: ['33527'],
    description: `Added \`prefers-reduced-motion\` support to Tab indicator animations. Users with reduced motion preferences will no longer see sliding transitions on the active and hover indicators.`,

    commitSha: '3d67aeb',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33250'],
    description: `Updated dependency \`@types/use-sync-external-store\` to \`^1.0.0\`.`,

    commitSha: 'c368cf3',
  },
  {
    components: ['table-pagination', 'use-table'],
    version: '0.14.0',
    prs: ['33552'],
    description: `Added \`showPaginationLabel\` prop to \`TablePagination\` and \`useTable\` pagination options. When set to \`false\`, the pagination label (e.g., "1 - 20 of 150") is hidden while navigation controls remain visible. Defaults to \`true\`.`,

    commitSha: 'd0f055f',
  },
  {
    components: [
      'field-label',
      'textfield',
      'password-field',
      'searchfield',
      'select',
      'radio-group',
      'checkbox-group',
    ],
    version: '0.14.0',
    prs: ['33817'],
    description: `Fixed form field descriptions not being connected to inputs via \`aria-describedby\`, making them accessible to screen readers. Added a \`descriptionSlot\` prop to \`FieldLabel\` that uses React Aria's slot mechanism to automatically wire up the connection.`,

    commitSha: '17eb8e0',
  },
  {
    components: ['button-icon'],
    version: '0.14.0',
    prs: ['33425'],
    description: `Fixed the ButtonIcon's loading spinner animation`,

    commitSha: 'cc4a682',
  },
  {
    components: ['tabs'],
    version: '0.14.0',
    prs: ['33784'],
    description: `Fixed the Tabs active indicator not hiding when no tab matches the current route.`,

    commitSha: '386972f',
  },
  {
    components: ['menu'],
    version: '0.14.0',
    prs: ['33524'],
    description: `Simplified the \`Menu\` component's item structure by removing the inner wrapper element and applying styles directly to the menu item, improving DOM clarity.`,

    commitSha: 'adcdd2f',
  },
  {
    components: [],
    version: '0.14.0',
    prs: ['33424'],
    description: `Added \`react-aria\`, \`react-stately\`, \`@react-aria/interactions\`, \`@react-stately/layout\`, and \`@react-stately/overlays\` as dependencies.`,

    commitSha: '0257ada',
  },
  {
    components: ['header'],
    version: '0.14.0',
    prs: ['33696'],
    description: `Fixed HeaderNav hover indicator covering tab text when theme uses opaque background colors. Also fixed an incorrect CSS variable reference (\`--bui-font-family\` → \`--bui-font-regular\`).`,

    commitSha: 'feaf3d1',
  },
];
