import type { ChangelogProps } from '../types';

export const changelog_0_15_0: ChangelogProps[] = [
  {
    components: ['box', 'card', 'grid', 'flex'],
    version: '0.15.0',
    prs: ['33948'],
    description: `Add support for flex item props (\`grow\`, \`shrink\`, and \`basis\`) to \`Box\`, \`Card\`, \`Grid\`, and \`Flex\` itself.`,
    breaking: true,
    commitSha: 'a281469',
  },
  {
    components: ['header'],
    version: '0.15.0',
    prs: ['34067'],
    description: `Added a \`sticky\` prop to the \`Header\` component. When \`true\`, the title-and-actions bar stays fixed to the top of its scroll container while the rest of the header (tags, description, metadata) scrolls away. The sticky bar background color automatically matches the container surface using the bg-consumer system.

  **BREAKING**: Removed the main header class from the \`Header\` component. Custom styles that target this class should be updated to target the component sections that remain.`,
    breaking: true,
    commitSha: '5351d8a',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['33945'],
    description: `Added missing dependencies that were previously only available transitively.`,

    commitSha: '3846774',
  },
  {
    components: ['alert', 'button', 'button-icon', 'table', 'table-root'],
    version: '0.15.0',
    prs: ['33986'],
    description: `Added \`isPending\` prop to Alert, Button, ButtonIcon, Table, and TableRoot as a replacement for the \`loading\` prop, aligning with React Aria naming conventions. The \`loading\` prop is now deprecated but still supported as an alias. CSS selectors now use \`data-ispending\` instead of \`data-loading\` for styling pending states; \`data-loading\` is still emitted for backward compatibility but will be removed alongside the \`loading\` prop.`,

    commitSha: 'e8a1a35',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['34124'],
    description: `Added a public \`--bui-bg-inherit\` CSS variable that resolves to the background
  color of the nearest enclosing bg provider (\`Box\`, \`Flex\`, \`Grid\`, \`Card\`,
  \`Accordion\`, or any element with a \`data-bg\` attribute), falling back to
  \`--bui-bg-app\`. Use it from CSS for sticky or fixed elements that need to match
  their surrounding surface without hardcoding a specific level.

  \`\`\`css
  .searchBarContainer {
    position: sticky;
    top: 0;
    background-color: var(--bui-bg-inherit);
  }
  \`\`\`

  As part of this change, the \`data-bg\` painting rules previously duplicated in
  \`Box\`, \`Flex\`, \`Grid\`, \`Accordion\`, and \`Card\` have been centralized into a
  single source in \`core.css\`. Painting and component behavior are unchanged for
  all existing usages, with one minor expansion: any element with a \`data-bg\`
  attribute (including provider elements and any element that sets it directly)
  is now painted, not only \`Box\`/\`Flex\`/\`Grid\`/\`Card\`/\`Accordion\` elements.`,

    commitSha: '37535b2',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['33975'],
    description: `Tightened React Aria dependency version ranges from \`^\` to \`~\` to prevent unintended minor version upgrades.`,

    commitSha: 'e2d9831',
  },
  {
    components: ['select'],
    version: '0.15.0',
    prs: ['34012'],
    description: `Added support for grouping options into sections in the Select component. You can now pass section objects with a \`title\` and a nested \`options\` array alongside (or instead of) regular options to render grouped dropdowns with section headers.`,

    commitSha: 'e7fc79f',
  },
  {
    components: ['card'],
    version: '0.15.0',
    prs: ['34025'],
    description: `Disabled \`Card\` scroll shadow in browsers that don't support \`animation-timeline: scroll()\`. Prevents the shadow from being always visible over the \`CardBody\` when there's nothing to scroll or the body is not scrolled.`,

    commitSha: '76635ae',
  },
  {
    components: ['card'],
    version: '0.15.0',
    prs: ['34069'],
    description: `Fixed \`CardBody\` showing an unwanted scrollbar when constrained below the scroll shadow height.`,

    commitSha: 'de75f7c',
  },
  {
    components: ['dialog'],
    version: '0.15.0',
    prs: ['33898'],
    description: `Fixed dark mode background for Dialog component by correcting the theme attribute selector from \`data-theme\` to \`data-theme-mode\`.`,

    commitSha: 'a42766e',
  },
  {
    components: ['tabs'],
    version: '0.15.0',
    prs: ['33984'],
    description: `Fixed an issue where the active tab indicator would disappear shortly after page load for uncontrolled Tabs.`,

    commitSha: 'c6fc76f',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['34256'],
    description: `Updated field components to grow within flex layouts instead of forcing their width to remain fixed.`,

    commitSha: '5520e07',
  },
  {
    components: ['password-field'],
    version: '0.15.0',
    prs: ['34151'],
    description: `Updated \`PasswordField\` to visually match \`TextField\`, including consistent focus rings, error states, disabled appearance, and background colour behaviour.`,

    commitSha: '11699ac',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['33918'],
    description: `Updated React Aria dependencies to v1.17.0 and migrated imports from individual \`@react-aria/*\` and \`@react-stately/*\` packages to the monopackages (\`react-aria\`, \`react-stately\`). This fixes a type resolution error for \`@react-types/table\` that occurred in new app installations.`,

    commitSha: 'd1be10c',
  },
  {
    components: ['header'],
    version: '0.15.0',
    prs: ['33997'],
    description: `Added \`description\`, \`tags\`, and \`metadata\` props to the \`Header\` component. The \`description\` prop accepts a markdown string with support for inline links. The \`tags\` prop renders a row of text or link items above the title. The \`metadata\` prop renders key-value pairs below the description. The \`breadcrumbs\` prop has been deprecated and will be removed in a future release.`,

    commitSha: 'c96e2b3',
  },
  {
    components: ['table', 'table-root'],
    version: '0.15.0',
    prs: ['34153'],
    description: `Fixed Table with row selection creating phantom scroll height on ancestor elements by establishing a containing block for visually-hidden checkbox inputs.`,

    commitSha: '4bb649d',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['34045'],
    description: `Limited \`@remixicon/react\` dependency to versions below 4.9.0 due to a license change in that release.`,

    commitSha: 'f635139',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['34119'],
    description: `Fix \`Card href=...\` not showing a focus indicator on keyboard navigation. \`Link\` now composes \`useFocusRing\`, emits \`data-focus-visible\`, and renders a \`--bui-ring\` outline when keyboard-focused. The Card's existing focus-ring CSS matches when the trigger is focused.

  _Affected components_: Card, Link`,

    commitSha: '5b85902',
  },
  {
    components: ['checkbox', 'checkbox-group'],
    version: '0.15.0',
    prs: ['33800'],
    description: `Added invalid-state styling for Checkbox and corresponding Storybook variants for verification.`,

    commitSha: '23ee789',
  },
  {
    components: ['plugin-header', 'header'],
    version: '0.15.0',
    prs: ['34103'],
    description: `Adjusted PluginHeader spacing and borders so headers with and without tabs align more consistently with surrounding page content, including when paired with page headers.`,

    commitSha: '38bb056',
  },
  {
    components: ['button-link', 'card', 'link', 'menu', 'tab', 'table', 'tag'],
    version: '0.15.0',
    prs: ['34004'],
    description: `Fixed external URLs in BUI link components being rewritten as in-app paths when the app is served under a non-root base path. Absolute URLs (\`http://\`, \`https://\`, \`//\`, \`mailto:\`, \`tel:\`) are now passed through unchanged. Internal \`href\` values are resolved against the current \`basename\` exactly once, which also fixes a latent issue where internal link clicks under a non-root base path could navigate to a URL with the \`basename\` prefix doubled.`,

    commitSha: 'df705bb',
  },
  {
    components: ['header'],
    version: '0.15.0',
    prs: ['34232'],
    description: `Added container alignment to \`Header\` sections so tags, title actions, descriptions, metadata, and tabs use the same width as surrounding page content.`,

    commitSha: '3e0ff6c',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['34262'],
    description: `Updated Storybook development tooling for \`@backstage/ui\` to version 10.4.`,

    commitSha: 'b67a862',
  },
  {
    components: ['date-picker'],
    version: '0.15.0',
    prs: ['34184'],
    description: `Added new \`DatePicker\` component — combines a date field and a calendar popover for selecting a date, built on React Aria with full keyboard and screen reader accessibility. Uses BUI design tokens throughout, including auto-incremented backgrounds via the bg consumer pattern.`,

    commitSha: 'd726bcd',
  },
  {
    components: [],
    version: '0.15.0',
    prs: ['33909'],
    description: `Added new \`DateRangePicker\` component — combines two date fields and a calendar popover for selecting a date range, built on React Aria with full keyboard and screen reader accessibility. Uses BUI design tokens throughout, including auto-incremented backgrounds via the bg consumer pattern.`,

    commitSha: '401916d',
  },
  {
    components: ['table'],
    version: '0.15.0',
    prs: ['34127'],
    description: `Added \`searchDebounceMs\` and \`filterDebounceMs\` options to \`useTable\` in \`complete\` mode. Both default to \`0\` (no debounce, no observable change for existing consumers); set them to defer the client-side filter/search/sort pipeline on large datasets without reimplementing input-layer debouncing. The controlled \`search\` / \`onSearchChange\` and \`filter\` / \`onFilterChange\` callbacks continue to fire on every change.`,

    commitSha: '25909ba',
  },
  {
    components: ['combobox'],
    version: '0.15.0',
    prs: ['34118'],
    description: `Added a new \`Combobox\` component. It pairs a text input with a filterable dropdown of options and supports single selection, sectioned options, icons, sizes, and custom typed values via \`allowsCustomValue\`.`,

    commitSha: 'ddca41f',
  },
];
