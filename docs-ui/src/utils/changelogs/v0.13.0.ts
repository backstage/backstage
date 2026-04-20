import type { ChangelogProps } from '../types';

export const changelog_0_13_0: ChangelogProps[] = [
  {
    components: [
      'box',
      'flex',
      'grid',
      'card',
      'accordion',
      'popover',
      'tooltip',
      'dialog',
      'menu',
    ],
    version: '0.13.0',
    prs: ['33002'],
    description: `**BREAKING**: Simplified the neutral background prop API for container components. The explicit \`neutral-1\`, \`neutral-2\`, \`neutral-3\`, and \`neutral-auto\` values have been removed from \`ProviderBg\`. They are replaced by a single \`'neutral'\` value that always auto-increments from the parent context, making it impossible to skip or pin to an explicit neutral level.`,
    migration: `Replace any explicit \`bg="neutral-1"\`, \`bg="neutral-2"\`, \`bg="neutral-3"\`, or \`bg="neutral-auto"\` props with \`bg="neutral"\`. To achieve a specific neutral level in stories or tests, use nested containers — each additional \`bg="neutral"\` wrapper increments by one level.

\`\`\`tsx
// Before
<Box bg="neutral-2">...</Box>

// After
<Box bg="neutral">
  <Box bg="neutral">...</Box>
</Box>
\`\`\``,
    breaking: true,
    commitSha: '768f09d',
  },
  {
    components: ['popover', 'tooltip', 'menu', 'dialog'],
    version: '0.13.0',
    prs: ['32979'],
    description: `**BREAKING**: Removed \`--bui-bg-popover\` CSS token. Popover, Tooltip, Menu, and Dialog now use \`--bui-bg-app\` for their outer shell and \`Box bg="neutral-1"\` for content areas, providing better theme consistency and eliminating a redundant token.`,
    migration: `Replace any usage of \`--bui-bg-popover\` with \`--bui-bg-neutral-1\` (for content surfaces) or \`--bui-bg-app\` (for outer shells):

\`\`\`diff
- background: var(--bui-bg-popover);
+ background: var(--bui-bg-neutral-1);
\`\`\``,
    breaking: true,
    commitSha: 'b42fcdc',
  },
  {
    components: ['searchfield'],
    version: '0.13.0',
    prs: ['33050'],
    description: `**BREAKING**: Data attributes rendered by components are now always lowercase. This affects CSS selectors targeting camelCase data attributes.`,
    migration: `Update any custom CSS selectors that target camelCase data attributes to use lowercase instead:

\`\`\`diff
- [data-startCollapsed='true'] { ... }
+ [data-startcollapsed='true'] { ... }
\`\`\``,
    breaking: true,
    commitSha: 'bd3a76e',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33050'],
    description: `**BREAKING**: Removed deprecated types \`ComponentDefinition\`, \`ClassNamesMap\`, \`DataAttributeValues\`, and \`DataAttributesMap\` from the public API. These were internal styling infrastructure types that have been replaced by the \`defineComponent\` system.`,
    migration: `Remove any direct usage of these types. Component definitions now use \`defineComponent()\` and their shapes are not part of the public API contract.

\`\`\`diff
- import type { ComponentDefinition, ClassNamesMap } from '@backstage/ui';
\`\`\`

If you were reading \`definition.dataAttributes\`, use \`definition.propDefs\` instead — props with \`dataAttribute: true\` in \`propDefs\` are the equivalent.`,
    breaking: true,
    commitSha: '95702ab',
  },
  {
    components: ['link', 'button-link', 'tabs', 'menu', 'tag-group', 'table'],
    version: '0.13.0',
    prs: ['33267'],
    description: `**BREAKING**: Centralized client-side routing in \`BUIProvider\`. Components like Link, ButtonLink, Tabs, Menu, TagGroup, and Table now require a \`BUIProvider\` rendered inside a React Router context for client-side navigation to work.`,
    migration: `This change requires updating \`@backstage/plugin-app\` and \`@backstage/core-app-api\` alongside \`@backstage/ui\`. If you only upgrade \`@backstage/ui\`, BUI components will fall back to full-page navigation.

If you cannot upgrade all packages together, or if you have a custom app shell, add a \`BUIProvider\` inside your Router:

\`\`\`diff
+ import { BUIProvider } from '@backstage/ui';

  <BrowserRouter>
+   <BUIProvider>
      <AppContent />
+   </BUIProvider>
  </BrowserRouter>
\`\`\``,
    breaking: true,
    commitSha: '42f8c9b',
  },
  {
    components: ['header'],
    version: '0.13.0',
    prs: ['33354'],
    description: `**BREAKING**: Renamed internal CSS classes to match the \`Header\` component name.

  **Migration:** If you are targeting these classes directly in your styles, update the following:

  - \`bui-HeaderPage\` → \`bui-Header\`
  - \`bui-HeaderPageContent\` → \`bui-HeaderContent\`
  - \`bui-HeaderPageBreadcrumbs\` → \`bui-HeaderBreadcrumbs\`
  - \`bui-HeaderPageTabsWrapper\` → \`bui-HeaderTabsWrapper\`
  - \`bui-HeaderPageControls\` → \`bui-HeaderControls\``,
    breaking: true,
    commitSha: '17d6398',
  },
  {
    components: ['checkbox'],
    version: '0.13.0',
    prs: ['33323'],
    description: `Removed redundant \`selected\` and \`indeterminate\` props from the \`Checkbox\` component. Use the \`isSelected\` and \`isIndeterminate\` props instead, which are the standard React Aria props and already handle both the checkbox behaviour and the corresponding CSS data attributes.`,
    migration: `Replace any usage of the \`selected\` and \`indeterminate\` props on \`Checkbox\` with the \`isSelected\` and \`isIndeterminate\` props. Note that the checked state and related CSS data attributes (such as \`data-selected\` and \`data-indeterminate\`) are now driven by React Aria, so any custom logic that previously inspected or set these via the old props should instead rely on the React Aria-managed state and attributes exposed through the new props.`,
    breaking: true,
    commitSha: '9d5f3ba',
  },
  {
    components: ['list', 'list-row'],
    version: '0.13.0',
    prs: ['33358'],
    description: `Added \`List\` and \`ListRow\` components. These provide a standalone, accessible list of interactive rows built on top of React Aria's \`GridList\` and \`GridListItem\` primitives. Rows support icons, descriptions, actions, menus, and single or multiple selection modes.`,

    commitSha: '04d9d8d',
  },
  {
    components: ['accordion'],
    version: '0.13.0',
    prs: ['32935'],
    description: `Made Accordion a \`bg\` provider so nested components like Button auto-increment their background level. Updated \`useDefinition\` to resolve \`bg\` \`propDef\` defaults for provider components.`,

    commitSha: 'a1f4bee',
  },
  {
    components: ['card'],
    version: '0.13.0',
    prs: ['33116'],
    description: `Added interactive support to the \`Card\` component. Pass \`onPress\` to make the entire card surface pressable, or \`href\` to make it navigate to a URL. A transparent overlay handles the interaction while nested buttons and links remain independently clickable.`,

    commitSha: 'db92751',
  },
  {
    components: ['link', 'button-link', 'tab', 'menu-item', 'tag', 'row'],
    version: '0.13.0',
    prs: ['33150'],
    description: `Added analytics capabilities to the component library. Components with navigation behavior (Link, ButtonLink, Tab, MenuItem, Tag, Row) now fire analytics events on click when a \`BUIProvider\` is present.

  New exports: \`BUIProvider\`, \`useAnalytics\`, \`getNodeText\`, and associated types (\`AnalyticsTracker\`, \`UseAnalyticsFn\`, \`BUIProviderProps\`, \`AnalyticsEventAttributes\`).

  Components with analytics support now accept a \`noTrack\` prop to suppress event firing.`,

    commitSha: '12d8afe',
  },
  {
    components: ['table-root'],
    version: '0.13.0',
    prs: ['33322'],
    description: `Added a \`loading\` prop and \`data-loading\` data attribute to \`TableRoot\`, allowing consumers to distinguish between stale data and initial loading states. Both \`stale\` and \`loading\` set \`aria-busy\` on the table.`,

    commitSha: 'b838cc9',
  },
  {
    components: ['table'],
    version: '0.13.0',
    prs: ['33322'],
    description: `Improved the \`Table\` component loading state to show a skeleton UI with visible headers instead of plain "Loading..." text. The table now renders its full structure during loading, with animated skeleton rows in place of data. The loading state includes proper accessibility support with \`aria-busy\` on the table and screen reader announcements.`,

    commitSha: '690786f',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33078'],
    description: `Fixed neutral-1 hover & pressed state in light mode.`,

    commitSha: '58224d3',
  },
  {
    components: [
      'avatar',
      'checkbox',
      'container',
      'dialog',
      'field-error',
      'field-label',
      'flex',
      'full-page',
      'grid',
      'header-page',
      'link',
      'menu',
      'password-field',
      'plugin-header',
      'popover',
      'radio-group',
      'searchfield',
      'select',
      'skeleton',
      'switch',
      'table',
      'table-pagination',
      'tabs',
      'tag-group',
      'text',
      'textfield',
      'toggle-button',
      'toggle-button-group',
      'tooltip',
      'visually-hidden',
    ],
    version: '0.13.0',
    prs: ['33050'],
    description: `Migrated all components from \`useStyles\` to \`useDefinition\` hook. Exported \`OwnProps\` types for each component, enabling better type composition for consumers.`,

    commitSha: '95702ab',
  },
  {
    components: ['card'],
    version: '0.13.0',
    prs: ['33151'],
    description: `Fixed interactive cards so that CardBody can scroll when the card has a constrained height. Previously, the overlay element blocked scroll events.`,

    commitSha: '430d5ed',
  },
  {
    components: ['container'],
    version: '0.13.0',
    prs: ['32984'],
    description: `Removed the \`transition\` on \`Container\` padding to prevent an unwanted animation when the viewport is resized.`,

    commitSha: '4c2c350',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['32542'],
    description: `Fixed --bui-fg-success token in light mode to be more accessible.`,

    commitSha: 'e0b7eb0',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33188'],
    description: `Deprecated the \`HeaderPage\` component name in favor of \`Header\`. The old \`HeaderPage\`, \`HeaderPageProps\`, \`HeaderPageOwnProps\`, \`HeaderPageBreadcrumb\`, and \`HeaderPageDefinition\` exports are still available as deprecated aliases.`,

    commitSha: 'ad7c883',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33379'],
    description: `Added documentation for the table cell wrapper requirement to TSDoc comments for \`Cell\`, \`CellText\`, \`CellProfile\`, \`ColumnConfig\`, and \`RowRenderFn\`.`,

    commitSha: '0ebde15',
  },
  {
    components: ['search-autocomplete', 'search-autocomplete-item'],
    version: '0.13.0',
    prs: ['33340'],
    description: `Added \`SearchAutocomplete\` and \`SearchAutocompleteItem\` components for building accessible search-with-results patterns. Built on React Aria's Autocomplete with keyboard navigation and screen reader support. Designed for async/external search results with a configurable popover width.`,

    commitSha: 'd9d2dd6',
  },
  {
    components: ['checkbox'],
    version: '0.13.0',
    prs: ['33394'],
    description: `Made Checkbox \`children\` optional and added a dev warning when neither a visible label, \`aria-label\`, nor \`aria-labelledby\` is provided. The label wrapper div is no longer rendered when there are no children, removing the unnecessary gap.`,

    commitSha: 'a6b84e1',
  },
  {
    components: ['dialog'],
    version: '0.13.0',
    prs: ['33352'],
    description: `Fixed \`Dialog\` content overflowing when no \`height\` prop is set. The dialog now grows with its content and scrolls when content exceeds the viewport height.`,

    commitSha: 'b99f6d5',
  },
  {
    components: [
      'accordion',
      'button',
      'button-icon',
      'button-link',
      'card',
      'list',
      'menu',
      'select',
      'toggle-button-group',
    ],
    version: '0.13.0',
    prs: ['33358'],
    description: `Fixed focus ring styles to use React Aria's \`[data-focus-visible]\` data attribute instead of the native CSS \`:focus-visible\` pseudo-class. This ensures keyboard focus rings render reliably when focus is managed programmatically by React Aria (e.g. inside a GridList, Menu, or Select).`,

    commitSha: '2f581de',
  },
  {
    components: ['container', 'header'],
    version: '0.13.0',
    prs: ['33354'],
    description: `Fixed incorrect bottom spacing caused by \`Container\` using \`padding-bottom\` for its default bottom spacing. Changed to \`margin-bottom\` and prevented it from applying when \`Container\` is used as the \`Header\` root element.`,

    commitSha: '17d6398',
  },
  {
    components: ['plugin-header'],
    version: '0.13.0',
    prs: ['33368'],
    description: `Fixed \`PluginHeader\` to avoid triggering \`ResizeObserver loop completed with undelivered notifications\` warnings when used in layouts that react to the header height, such as pages that use \`FullPage\`.`,

    commitSha: '2e5c651',
  },
  {
    components: ['tabs', 'plugin-header'],
    version: '0.13.0',
    prs: ['33047'],
    description: `Fixed tab \`matchStrategy\` matching to ignore query parameters and hash fragments in tab \`href\` values. Previously, tabs with query params in their \`href\` (e.g., \`/page?group=foo\`) would never show as active since matching compared the full \`href\` string against \`location.pathname\` which never includes query params.`,

    commitSha: 'd4fa5b4',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33363'],
    description: `Fixed Table component to use current \`--bui-bg-neutral-1\` tokens instead of the removed \`--bui-bg-tint\` tokens, restoring row hover, selected, pressed, and disabled background colors.`,

    commitSha: 'bc42b60',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33378'],
    description: `Fixed a bug in the \`useTable\` hook where the loading skeleton was never shown for \`complete\` mode when using \`getData\`. The initial data state was an empty array instead of \`undefined\`, causing the \`Table\` component to skip the loading state.`,

    commitSha: '9314ff5',
  },
  {
    components: ['table'],
    version: '0.13.0',
    prs: ['33256'],
    description: `Fixed Table column headers overflowing and wrapping when there is not enough space. Headers now truncate with ellipsis instead.`,

    commitSha: 'f42f4cc',
  },
  {
    components: ['row'],
    version: '0.13.0',
    prs: ['33394'],
    description: `Fixed Table row hover, selected, pressed, and disabled background states to use the correct neutral token level based on the container background.`,

    commitSha: '1f9682b',
  },
  {
    components: ['row'],
    version: '0.13.0',
    prs: ['33256'],
    description: `Fixed Table rows showing a pointer cursor when not interactive. Rows now only show \`cursor: pointer\` when they have an \`href\`, are selectable, or are pressable.`,

    commitSha: 'fbd5c5a',
  },
  {
    components: ['row'],
    version: '0.13.0',
    prs: ['33353'],
    description: `Fixed \`Table\` rows with external \`href\` values to open in a new tab by automatically applying \`target="_blank"\` and \`rel="noopener noreferrer"\`.`,

    commitSha: '612c217',
  },
  {
    components: ['table'],
    version: '0.13.0',
    prs: ['33394'],
    description: `Updated Table selection checkboxes to use \`aria-label\` instead of empty fragment children, improving accessibility and removing the unnecessary label gap in the selection cells.`,

    commitSha: '545129a',
  },
  {
    components: ['button', 'button-icon', 'button-link'],
    version: '0.13.0',
    prs: ['33095'],
    description: `Fixed handling of the \`style\` prop on \`Button\`, \`ButtonIcon\`, and \`ButtonLink\` so that it is now correctly forwarded to the underlying element instead of being silently dropped.`,

    commitSha: '36987db',
  },
  {
    components: ['link'],
    version: '0.13.0',
    prs: ['33050'],
    description: `Fixed Link variant default from \`'body'\` to \`'body-medium'\` to match actual CSS selectors. The previous default did not correspond to a valid variant value.`,

    commitSha: '95702ab',
  },
  {
    components: ['menu', 'select'],
    version: '0.13.0',
    prs: ['33049'],
    description: `Fixed scroll overflow in Menu and Select popover content when constrained by viewport height.`,

    commitSha: '9027b10',
  },
  {
    components: ['flex', 'grid', 'grid-item'],
    version: '0.13.0',
    prs: ['33136'],
    description: `Added support for native HTML div attributes on the \`Flex\`, \`Grid\`, and \`Grid.Item\` components.`,

    commitSha: '7960d54',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33246'],
    description: `Added \`virtualized\` prop to \`Table\` component for virtualized rendering of large datasets. Accepts \`true\` for default row height, \`{ rowHeight: number }\` for fixed height, or \`{ estimatedRowHeight: number }\` for variable height rows.`,

    commitSha: '0559408',
  },
  {
    components: ['menu', 'select'],
    version: '0.13.0',
    prs: ['32983'],
    description: `Fixed focus-visible outline styles for Menu and Select components.`,

    commitSha: '8909359',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33150'],
    description: `Fixed MenuItem \`onAction\` prop ordering so user-provided \`onAction\` handlers are chained rather than silently overwritten.`,

    commitSha: '12d8afe',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33389'],
    description: `Pages created with \`PageBlueprint\` now render the plugin header by default in the new frontend system.`,

    commitSha: 'aa29b50',
  },
  {
    components: ['select'],
    version: '0.13.0',
    prs: ['33102'],
    description: `The \`Select\` trigger now automatically adapts its background colour based on the parent background context.`,

    commitSha: 'bb66b86',
  },
  {
    components: ['plugin-header'],
    version: '0.13.0',
    prs: ['33085'],
    description: `Merged the internal \`PluginHeaderToolbar\` component into \`PluginHeader\`, removing the separate component and its associated types (\`PluginHeaderToolbarOwnProps\`, \`PluginHeaderToolbarProps\`) and definition (\`PluginHeaderToolbarDefinition\`). This is an internal refactor with no changes to the public API of \`PluginHeader\`.`,

    commitSha: '4105a78',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33251'],
    description: `Updated dependency \`globals\` to \`^17.0.0\`.`,

    commitSha: '9599697',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['32971'],
    description: `Improved type safety in \`useDefinition\` by centralizing prop resolution and strengthening the \`BgPropsConstraint\` to require that \`bg\` provider components declare \`children\` as a required prop in their OwnProps type.`,

    commitSha: '0f462f8',
  },
  {
    components: ['radio-group'],
    version: '0.13.0',
    prs: ['32983'],
    description: `Added proper cursor styles for RadioGroup items.`,

    commitSha: '8909359',
  },
  {
    components: ['card'],
    version: '0.13.0',
    prs: ['33343'],
    description: `Fixed \`Card\` interactive cards not firing the \`onPress\` handler when clicking the card surface.`,

    commitSha: 'fcaac3b',
  },
  {
    components: ['textfield', 'searchfield', 'password-field'],
    version: '0.13.0',
    prs: ['33050'],
    description: `Fixed \`isRequired\` prop not being passed to the underlying React Aria field components in TextField, SearchField, and PasswordField. Previously, \`isRequired\` was consumed locally for the secondary label text but never forwarded, which meant the input elements lacked \`aria-required="true"\` and React Aria's built-in required validation was not activated.`,

    commitSha: 'b303857',
  },
  {
    components: ['searchfield', 'textfield'],
    version: '0.13.0',
    prs: ['33081'],
    description: `\`SearchField\` and \`TextField\` now automatically adapt their background color based on the parent bg context, stepping up one neutral level (e.g. neutral-1 → neutral-2) when placed on a neutral background. \`TextField\` also gains a focus ring using the \`--bui-ring\` token.`,

    commitSha: '934ac03',
  },
  {
    components: [],
    version: '0.13.0',
    prs: ['33045'],
    description: `Improved \`useBreakpoint\` performance by sharing a single set of \`matchMedia\` listeners across all component instances instead of creating independent listeners per hook call.`,

    commitSha: 'cd3cb0f',
  },
  {
    components: ['alert', 'container', 'dialog-body', 'field-label'],
    version: '0.13.0',
    prs: ['33095'],
    description: `Extended \`AlertProps\`, \`ContainerProps\`, \`DialogBodyProps\`, and \`FieldLabelProps\` with native div element props to allow passing attributes like \`aria-*\` and \`data-*\`.`,

    commitSha: '36987db',
  },
];
