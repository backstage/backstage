import type { ChangelogProps } from '../types';

export const changelog_0_12_0: ChangelogProps[] = [
  {
    components: ['alert'],
    version: '0.12.0',
    prs: ['32711'],
    description: `**BREAKING**: Alert no longer accepts a \`surface\` prop

  The Alert component's background is now driven entirely by its \`status\` prop. The \`surface\` prop has been removed.

  \`\`\`diff
  - <Alert surface="1" status="info" />
  + <Alert status="info" />
  \`\`\``,
    breaking: true,
    commitSha: '46a9adc',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32723'],
    description: `**BREAKING**: Removed gray scale tokens and renamed background surface tokens to neutral tokens

  The \`--bui-gray-1\` through \`--bui-gray-8\` tokens have been removed. The \`--bui-bg-surface-*\` and \`--bui-bg-neutral-on-surface-*\` tokens have been replaced by a unified \`--bui-bg-neutral-*\` scale.`,
    migration: `Replace surface tokens directly:

\`\`\`diff
- background: var(--bui-bg-surface-0);
+ background: var(--bui-bg-neutral-0);
\`\`\`

Replace on-surface tokens shifted by +1:

\`\`\`diff
- background: var(--bui-bg-neutral-on-surface-0);
+ background: var(--bui-bg-neutral-1);
\`\`\`

Replace gray tokens 1-4 with neutral equivalents (\`--bui-gray-5\` through \`--bui-gray-8\` have no direct replacement):

\`\`\`diff
- background: var(--bui-gray-1);
+ background: var(--bui-bg-neutral-1);
\`\`\``,
    breaking: true,
    commitSha: 'b63c25b',
  },
  {
    components: [
      'box',
      'button',
      'button-icon',
      'button-link',
      'toggle-button',
      'card',
      'flex',
      'grid',
    ],
    version: '0.12.0',
    prs: ['32711'],
    description: `**BREAKING**: Replaced \`Surface\` / \`onSurface\` system with new provider/consumer background system

  The old \`Surface\` type (\`'0'\`–\`'3'\`, \`'auto'\`) and its associated props (\`surface\`, \`onSurface\`) have been replaced by a provider/consumer \`bg\` architecture.

  **Types:**

  - \`ContainerBg\` — \`'neutral-1'\` | \`'neutral-2'\` | \`'neutral-3'\` | \`'danger'\` | \`'warning'\` | \`'success'\`
  - \`ProviderBg\` — \`ContainerBg | 'neutral-auto'\`

  Consumer components (e.g. Button) inherit the parent's \`bg\` via \`data-on-bg\`, and CSS handles the visual step-up. See "Neutral level capping" below for details on how levels are bounded.

  **Hooks:**

  - \`useBgProvider(bg?)\` — for provider components. Returns \`{ bg: undefined }\` when no \`bg\` is given (transparent). Supports \`'neutral-auto'\` to auto-increment from the parent context.
  - \`useBgConsumer()\` — for consumer components. Returns the parent container's \`bg\` unchanged.

  **Component roles:**

  - **Provider-only** (Box, Flex, Grid): set \`data-bg\`, wrap children in \`BgProvider\`. **Transparent by default** — they do _not_ auto-increment; pass \`bg="neutral-auto"\` explicitly if you want automatic neutral stepping.
  - **Consumer-only** (Button, ButtonIcon, ButtonLink): set \`data-on-bg\`, inherit the parent container's \`bg\` unchanged.
  - **Provider + Consumer** (Card): sets both \`data-bg\` and \`data-on-bg\`, wraps children. Card passes \`bg="neutral-auto"\` to its inner Box, so it auto-increments from the parent context.

  **Neutral level capping:**

  Provider components cap at \`neutral-3\`. There is no \`neutral-4\` prop value. The \`neutral-4\` level exists only in consumer component CSS — for example, a Button sitting on a \`neutral-3\` surface uses \`neutral-4\` tokens internally via \`data-on-bg\`.`,
    migration: `Rename the \`surface\` prop to \`bg\` on provider components and update values:

\`\`\`diff
- <Box surface="1">
+ <Box bg="neutral-1">

- <Card surface="2">
+ <Card bg="neutral-2">

- <Flex surface="0">
+ <Flex bg="neutral-1">

- <Grid.Root surface="1">
+ <Grid.Root bg="neutral-1">
\`\`\`

Remove \`onSurface\` from consumer components — they now always inherit from the parent container:

\`\`\`diff
- <Button onSurface="1" variant="secondary">
+ <Button variant="secondary">

- <ButtonIcon onSurface="2" variant="secondary" />
+ <ButtonIcon variant="secondary" />

- <ToggleButton onSurface="1">
+ <ToggleButton>
\`\`\`

Update type imports:

\`\`\`diff
- import type { Surface, LeafSurfaceProps, ContainerSurfaceProps } from '@backstage/ui';
+ import type { ContainerBg, ProviderBg } from '@backstage/ui';
\`\`\`

Replace hook usage in custom components:

\`\`\`diff
- import { useSurface, SurfaceProvider } from '@backstage/ui';
+ import { useBgProvider, useBgConsumer, BgProvider } from '@backstage/ui';

- const { surface } = useSurface({ surface: props.surface });
+ const { bg } = useBgProvider(props.bg);

- const { surface } = useSurface({ onSurface: props.onSurface });
+ const { bg } = useBgConsumer();
\`\`\`

Update CSS selectors targeting surface data attributes:

\`\`\`diff
- [data-surface='1'] { ... }
+ [data-bg='neutral-1'] { ... }

- [data-on-surface='1'] { ... }
+ [data-on-bg='neutral-1'] { ... }
\`\`\`

Note: Provider components use \`data-bg\` (values: \`neutral-1\` through \`neutral-3\`, plus intent values). Consumer components use \`data-on-bg\`, which reflects the parent container's \`bg\` directly. The \`neutral-4\` level never appears as a prop or \`data-bg\` value — it is used only in consumer CSS.`,
    breaking: true,
    commitSha: '7898df0',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32837'],
    description: `**BREAKING:** Renamed, added, and removed CSS tokens.

  - Renamed \`--bui-bg-neutral-0\` to \`--bui-bg-app\`.
  - Renamed \`--bui-border\` to \`--bui-border-2\`.
  - Added \`--bui-border-1\` for subtle, low-contrast borders.
  - Added \`--bui-bg-popover\` for the background color of popovers, tooltips, menus, and dialogs.
  - Removed \`--bui-border-hover\`, \`--bui-border-pressed\`, and \`--bui-border-disabled\`.`,
    migration: `\`\`\`diff
- var(--bui-bg-neutral-0)
+ var(--bui-bg-app)

- var(--bui-border)
+ var(--bui-border-2)
\`\`\`

Remove any references to \`--bui-border-hover\`, \`--bui-border-pressed\`, and \`--bui-border-disabled\` as these tokens no longer exist.`,
    breaking: true,
    commitSha: '4137a43',
  },
  {
    components: ['button-icon', 'button-link'],
    version: '0.12.0',
    prs: ['32308'],
    description: `**BREAKING**: Changed CSS selectors for \`ButtonIcon\` and \`ButtonLink\` components. Custom styles targeting \`.bui-Button\` to style these components must be updated to use \`.bui-ButtonIcon\` or \`.bui-ButtonLink\` respectively.

  \`\`\`diff
  -/* This no longer styles ButtonIcon or ButtonLink */
  -.bui-Button[data-variant="primary"] { ... }
  +/* Use component-specific selectors */
  +.bui-ButtonIcon[data-variant="primary"] { ... }
  +.bui-ButtonLink[data-variant="primary"] { ... }
  \`\`\``,
    breaking: true,
    commitSha: 'b1f723b',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32472'],
    description: `**BREAKING**: The \`cell\` and \`header\` properties in \`ColumnConfig\` now return \`ReactElement\` instead of \`ReactNode\`.

  This fixes an issue where React Aria's Collection component would inject an \`id\` prop into Fragment wrappers, causing "Invalid prop \`id\` supplied to \`React.Fragment\`" errors on render.

  Migration:

  \`\`\`diff
  const columns: ColumnConfig<MyItem>[] = [
    {
      id: 'name',
      label: 'Name',
  -   cell: (item) => item.name,
  +   cell: (item) => <CellText title={item.name} />,
  -   header: () => 'Name',
  +   header: () => <Column>Name</Column>,
    },
  ];
  \`\`\``,
    breaking: true,
    commitSha: 'caeb9ad',
  },
  {
    components: ['plugin-header'],
    version: '0.12.0',
    prs: ['32875'],
    description: `**BREAKING**: Renamed the \`Header\` component to \`PluginHeader\` for clarity.

  The following exports have been renamed:

  - \`Header\` → \`PluginHeader\`
  - \`HeaderProps\` → \`PluginHeaderProps\`
  - \`HeaderDefinition\` → \`PluginHeaderDefinition\`

  The \`HeaderTab\` type is unchanged as it is shared with \`HeaderPage\`.

  CSS class names have been updated from \`bui-Header*\` to \`bui-PluginHeader*\`.`,
    migration: `\`\`\`diff
-import { Header, HeaderDefinition } from '@backstage/ui';
+import { PluginHeader, PluginHeaderDefinition } from '@backstage/ui';

-<Header title="My plugin" />
+<PluginHeader title="My plugin" />
\`\`\``,
    breaking: true,
    commitSha: '0ec3c0e',
  },
  {
    components: ['button'],
    version: '0.12.0',
    prs: ['32541'],
    description: `**BREAKING**: Removed \`large\` size variant from Button component as it was never implemented.`,
    migration: `\`\`\`diff
- <Button size="large">Click me</Button>
+ <Button size="medium">Click me</Button>
\`\`\``,
    breaking: true,
    commitSha: '058ffd9',
  },
  {
    components: ['link'],
    version: '0.12.0',
    prs: ['32608'],
    description: `**BREAKING**: Removed link and tint color tokens, added new status foreground tokens, and improved Link component styling

  The following color tokens have been removed:

  - \`--bui-fg-link\` (and all related tokens: \`-hover\`, \`-pressed\`, \`-disabled\`)
  - \`--bui-fg-tint\` (and all related tokens: \`-hover\`, \`-pressed\`, \`-disabled\`)
  - \`--bui-bg-tint\` (and all related tokens: \`-hover\`, \`-pressed\`, \`-disabled\`)
  - \`--bui-border-tint\` (and all related tokens)

  **New Status Tokens:**

  Added dedicated tokens for status colors that distinguish between usage on status backgrounds vs. standalone usage:

  - \`--bui-fg-danger-on-bg\` / \`--bui-fg-danger\`
  - \`--bui-fg-warning-on-bg\` / \`--bui-fg-warning\`
  - \`--bui-fg-success-on-bg\` / \`--bui-fg-success\`
  - \`--bui-fg-info-on-bg\` / \`--bui-fg-info\`

  The \`-on-bg\` variants are designed for text on colored backgrounds, while the base variants are for standalone status indicators with improved visibility and contrast.`,
    migration: `For link colors, migrate to one of the following alternatives:

\`\`\`diff
.custom-link {
- color: var(--bui-fg-link);
+ color: var(--bui-fg-info);  /* For informational links */
+ /* or */
+ color: var(--bui-fg-primary);  /* For standard text links */
}
\`\`\`

For tint colors (backgrounds, foregrounds, borders), migrate to appropriate status or neutral colors:

\`\`\`diff
.info-section {
- background: var(--bui-bg-tint);
+ background: var(--bui-bg-info);  /* For informational sections */
+ /* or */
+ background: var(--bui-bg-neutral-1);  /* For neutral emphasis */
}
\`\`\`

If you're using status foreground colors on colored backgrounds, update to the new \`-on-bg\` tokens:

\`\`\`diff
.error-badge {
- color: var(--bui-fg-danger);
+ color: var(--bui-fg-danger-on-bg);
  background: var(--bui-bg-danger);
}
\`\`\``,
    breaking: true,
    commitSha: '110fec0',
  },
  {
    components: ['full-page'],
    version: '0.12.0',
    prs: ['32822'],
    description: `Added a new \`FullPage\` component that fills the remaining viewport height below the \`PluginHeader\`.

  \`\`\`tsx
  <PluginHeader title="My Plugin" tabs={tabs} />
  <FullPage>
    {/* content fills remaining height */}
  </FullPage>
  \`\`\``,

    commitSha: '644e303',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32825'],
    description: `Fixed dark theme \`--bui-fg-secondary\` and \`--bui-fg-disabled\` tokens using black-based \`oklch(0% ...)\` instead of white-based \`oklch(100% ...)\`, making secondary and disabled text visible on dark backgrounds.`,

    commitSha: '44877e4',
  },
  {
    components: ['box'],
    version: '0.12.0',
    prs: ['32536'],
    description: `Fixed Box component to forward HTML attributes to the underlying div element.`,

    commitSha: '350c948',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32516'],
    description: `Use node prefix on native imports`,

    commitSha: '7455dae',
  },
  {
    components: ['accordion'],
    version: '0.12.0',
    prs: ['32488'],
    description: `Fixed nested Accordion icon state issue where the inner accordion's arrow icon would incorrectly show as expanded when only the outer accordion was expanded. The CSS selector now uses a direct parent selector to ensure the icon only responds to its own accordion's expanded state.`,

    commitSha: 'c8ae765',
  },
  {
    components: ['popover', 'tooltip'],
    version: '0.12.0',
    prs: ['32575'],
    description: `Fixed CSS Module syntax to comply with Next.js 16 Turbopack validation by flattening nested dark theme selectors.`,

    commitSha: '4d1b7f4',
  },
  {
    components: ['button'],
    version: '0.12.0',
    prs: ['32554'],
    description: `Added \`destructive\` prop to Button for dangerous actions like delete or remove. Works with all variants (primary, secondary, tertiary).`,

    commitSha: '2c219b9',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32553'],
    description: `Fixed \`useDefinition\` hook adding literal "undefined" class name when no className prop was passed.`,

    commitSha: '5af9e14',
  },
  {
    components: ['tag'],
    version: '0.12.0',
    prs: ['32742'],
    description: `Allow \`ref\` as a prop on the \`Tag\` component`,

    commitSha: '5c76d13',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32799'],
    description: `Cleaned up \`useDefinition\` \`ownProps\` types to remove never-typed ghost properties from autocomplete.`,

    commitSha: 'ab25658',
  },
  {
    components: ['table'],
    version: '0.12.0',
    prs: ['32685'],
    description: `Allow data to be passed directly to the \`useTable\` hook using the property \`data\` instead of \`getData()\` for mode \`"complete"\`.

  This simplifies usage as data changes, rather than having to perform a \`useEffect\` when data changes, and then reloading the data. It also happens immediately, so stale data won't remain until a rerender (with an internal async state change), so less flickering.`,

    commitSha: '741a98d',
  },
  {
    components: ['table'],
    version: '0.12.0',
    prs: ['32684'],
    description: `Fixed changing columns after first render from crashing. It now renders the table with the new column layout as columns change.`,

    commitSha: 'a0fe1b2',
  },
  {
    components: ['alert'],
    version: '0.12.0',
    prs: ['32520'],
    description: `Added new \`Alert\` component with support for status variants (info, success, warning, danger), icons, loading states, and custom actions.

  Updated status color tokens for improved contrast and consistency across light and dark themes:

  - Added new \`--bui-bg-info\` and \`--bui-fg-info\` tokens for info status
  - Updated \`--bui-bg-danger\`, \`--bui-fg-danger\` tokens
  - Updated \`--bui-bg-warning\`, \`--bui-fg-warning\` tokens
  - Updated \`--bui-bg-success\`, \`--bui-fg-success\` tokens`,

    commitSha: '508bd1a',
  },
  {
    components: [
      'tabs',
      'tab',
      'tag-group',
      'tag',
      'menu',
      'menu-item',
      'menu-autocomplete',
    ],
    version: '0.12.0',
    prs: ['32373'],
    description: `Fixed client-side navigation for container components by wrapping the container (not individual items) in RouterProvider. Components now conditionally provide routing context only when children have internal links, removing the Router context requirement when not needed. This also removes the need to wrap these components in MemoryRouter during tests when they are not using the \`href\` prop.

  Additionally, when multiple tabs match the current URL via prefix matching, the tab with the most specific path (highest segment count) is now selected. For example, with URL \`/catalog/users/john\`, a tab with path \`/catalog/users\` is now selected over a tab with path \`/catalog\`.`,

    commitSha: 'da30862',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32540'],
    description: `Fixed an infinite render loop in Tabs when navigating to a URL that doesn't match any tab \`href\`.`,

    commitSha: '092c453',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32643'],
    description: `export PasswordField component`,

    commitSha: 'becf851',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32843'],
    description: `Migrated Accordion components to use \`useDefinition\` instead of \`useStyles\`, and added automatic background adaptation based on parent container context.`,

    commitSha: 'becee36',
  },
  {
    components: ['link', 'button-link', 'row'],
    version: '0.12.0',
    prs: ['32373'],
    description: `Fixed components to not require a Router context when rendering without internal links.`,

    commitSha: '5320aa8',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['31818'],
    description: `Updated \`react-router-dom\` peer dependency to \`^6.30.2\` and explicitly disabled v7 future flags to suppress deprecation warnings.`,

    commitSha: 'a7e0d50',
  },
  {
    components: ['table'],
    version: '0.12.0',
    prs: ['32686'],
    description: `The Table component now wraps the react-aria-components \`Table\` with a \`ResizableTableContainer\` only if any column has a width property set. This means that column widths can adapt to the content otherwise (if no width is explicitly set).`,

    commitSha: '8c39412',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32537'],
    description: `Bump react-aria-components to v1.14.0`,

    commitSha: 'cb090b4',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32428'],
    description: `Fixed React 17 compatibility by using \`useId\` from \`react-aria\` instead of the built-in React hook which is only available in React 18+.`,

    commitSha: 'c429101',
  },
  {
    components: ['switch'],
    version: '0.12.0',
    prs: ['32551'],
    description: `Fixed Switch component disabled state styling to show \`not-allowed\` cursor and disabled text color.`,

    commitSha: '74c5a76',
  },
  {
    components: [],
    version: '0.12.0',
    prs: ['32761'],
    description: `Migrated to use the standard \`backstage-cli package build\` for CSS bundling instead of a custom build script.`,

    commitSha: '20131c5',
  },
];
