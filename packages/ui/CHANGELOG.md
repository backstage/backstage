# @backstage/ui

## 0.12.0-next.1

### Minor Changes

- 058ffd9: **BREAKING**: Removed `large` size variant from Button component as it was never implemented.

  **Migration:**

  ```diff
  - <Button size="large">Click me</Button>
  + <Button size="medium">Click me</Button>
  ```

  **Affected components:** Button

- 110fec0: **BREAKING**: Removed link and tint color tokens, added new status foreground tokens, and improved Link component styling

  The following color tokens have been removed:

  - `--bui-fg-link` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
  - `--bui-fg-tint` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
  - `--bui-bg-tint` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
  - `--bui-border-tint` (and all related tokens)

  **New Status Tokens:**

  Added dedicated tokens for status colors that distinguish between usage on status backgrounds vs. standalone usage:

  - `--bui-fg-danger-on-bg` / `--bui-fg-danger`
  - `--bui-fg-warning-on-bg` / `--bui-fg-warning`
  - `--bui-fg-success-on-bg` / `--bui-fg-success`
  - `--bui-fg-info-on-bg` / `--bui-fg-info`

  The `-on-bg` variants are designed for text on colored backgrounds, while the base variants are for standalone status indicators with improved visibility and contrast.

  **Migration:**

  For link colors, migrate to one of the following alternatives:

  ```diff
  .custom-link {
  - color: var(--bui-fg-link);
  + color: var(--bui-fg-info);  /* For informational links */
  + /* or */
  + color: var(--bui-fg-primary);  /* For standard text links */
  }
  ```

  For tint colors (backgrounds, foregrounds, borders), migrate to appropriate status or neutral colors:

  ```diff
  .info-section {
  - background: var(--bui-bg-tint);
  + background: var(--bui-bg-info);  /* For informational sections */
  + /* or */
  + background: var(--bui-bg-neutral-on-surface-0);  /* For neutral emphasis */
  }
  ```

  If you're using status foreground colors on colored backgrounds, update to the new `-on-bg` tokens:

  ```diff
  .error-badge {
  - color: var(--bui-fg-danger);
  + color: var(--bui-fg-danger-on-bg);
    background: var(--bui-bg-danger);
  }
  ```

  **Affected components:** Link

### Patch Changes

- 4d1b7f4: Fixed CSS Module syntax to comply with Next.js 16 Turbopack validation by flattening nested dark theme selectors.

  **Affected components:** Popover, Tooltip

- 2c219b9: Added `destructive` prop to Button for dangerous actions like delete or remove. Works with all variants (primary, secondary, tertiary).

  **Affected components:** Button

- 5af9e14: Fixed `useDefinition` hook adding literal "undefined" class name when no className prop was passed.
- 74c5a76: Fixed Switch component disabled state styling to show `not-allowed` cursor and disabled text color.

  **Affected components:** Switch

## 0.12.0-next.0

### Minor Changes

- b1f723b: **BREAKING**: Changed CSS selectors for `ButtonIcon` and `ButtonLink` components. Custom styles targeting `.bui-Button` to style these components must be updated to use `.bui-ButtonIcon` or `.bui-ButtonLink` respectively.

  ```diff
  -/* This no longer styles ButtonIcon or ButtonLink */
  -.bui-Button[data-variant="primary"] { ... }
  +/* Use component-specific selectors */
  +.bui-ButtonIcon[data-variant="primary"] { ... }
  +.bui-ButtonLink[data-variant="primary"] { ... }
  ```

  Affected components: ButtonIcon, ButtonLink

- caeb9ad: **BREAKING**: The `cell` and `header` properties in `ColumnConfig` now return `ReactElement` instead of `ReactNode`.

  This fixes an issue where React Aria's Collection component would inject an `id` prop into Fragment wrappers, causing "Invalid prop `id` supplied to `React.Fragment`" errors on render.

  Migration:

  ```diff
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
  ```

### Patch Changes

- 350c948: Fixed Box component to forward HTML attributes to the underlying div element.

  **Affected components:** Box

- 7455dae: Use node prefix on native imports
- 508bd1a: Added new `Alert` component with support for status variants (info, success, warning, danger), icons, loading states, and custom actions.

  Updated status color tokens for improved contrast and consistency across light and dark themes:

  - Added new `--bui-bg-info` and `--bui-fg-info` tokens for info status
  - Updated `--bui-bg-danger`, `--bui-fg-danger` tokens
  - Updated `--bui-bg-warning`, `--bui-fg-warning` tokens
  - Updated `--bui-bg-success`, `--bui-fg-success` tokens

  **Affected components**: Alert

- da30862: Fixed client-side navigation for container components by wrapping the container (not individual items) in RouterProvider. Components now conditionally provide routing context only when children have internal links, removing the Router context requirement when not needed. This also removes the need to wrap these components in MemoryRouter during tests when they are not using the `href` prop.

  Additionally, when multiple tabs match the current URL via prefix matching, the tab with the most specific path (highest segment count) is now selected. For example, with URL `/catalog/users/john`, a tab with path `/catalog/users` is now selected over a tab with path `/catalog`.

  Affected components: Tabs, Tab, TagGroup, Tag, Menu, MenuItem, MenuAutocomplete

- 092c453: Fixed an infinite render loop in Tabs when navigating to a URL that doesn't match any tab `href`.
- 5320aa8: Fixed components to not require a Router context when rendering without internal links.

  Affected components: Link, ButtonLink, Row

- cb090b4: Bump react-aria-components to v1.14.0
- c429101: Fixed React 17 compatibility by using `useId` from `react-aria` instead of the built-in React hook which is only available in React 18+.
- Updated dependencies
  - @backstage/version-bridge@1.0.11

## 0.11.0

### Minor Changes

- 243e5e7: **BREAKING**: Redesigned Table component with new `useTable` hook API.

  - The `Table` component (React Aria wrapper) is renamed to `TableRoot`
  - New high-level `Table` component that handles data display, pagination, sorting, and selection
  - The `useTable` hook is completely redesigned with a new API supporting three pagination modes (complete, offset, cursor)
  - New types: `ColumnConfig`, `TableProps`, `TableItem`, `UseTableOptions`, `UseTableResult`

  New features include unified pagination modes, debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.

  **Migration:**

  1. Update imports and use the new `useTable` hook:

  ```diff
  -import { Table, useTable } from '@backstage/ui';
  -const { data, paginationProps } = useTable({ data: items, pagination: {...} });
  +import { Table, useTable, type ColumnConfig } from '@backstage/ui';
  +const { tableProps } = useTable({
  +  mode: 'complete',
  +  getData: () => items,
  +});
  ```

  2. Define columns and render with the new Table API:

  ```diff
  -<Table aria-label="My table">
  -  <TableHeader>...</TableHeader>
  -  <TableBody items={data}>...</TableBody>
  -</Table>
  -<TablePagination {...paginationProps} />
  +const columns: ColumnConfig<Item>[] = [
  +  { id: 'name', label: 'Name', isRowHeader: true, cell: item => <CellText title={item.name} /> },
  +  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
  +];
  +
  +<Table columnConfig={columns} {...tableProps} />
  ```

  **Affected components:** Table, TableRoot, TablePagination

- 95246eb: **BREAKING**: Updating color tokens to match the new neutral style on different surfaces.

  **Migration:**

  There's no direct replacement for the old tint tokens but you can use the new neutral set of color tokens on surface 0 or 1 as a replacement.

  - `--bui-bg-tint` can be replaced by `--bui-bg-neutral-on-surface-0`
  - `--bui-bg-tint-hover` can be replaced by `--bui-bg-neutral-on-surface-0-hover`
  - `--bui-bg-tint-pressed` can be replaced by `--bui-bg-neutral-on-surface-0-pressed`
  - `--bui-bg-tint-disabled` can be replaced by `--bui-bg-neutral-on-surface-0-disabled`

- ea0c6d8: **BREAKING**: Introduce new `ToggleButton` & `ToggleButtonGroup` components in Backstage UI

  **Affected components:** ToggleButton, ToggleButtonGroup

- 4ea1d15: **BREAKING**: Renamed CSS variable `--bui-bg` to `--bui-bg-surface-0` for consistency.

### Patch Changes

- 1880402: Fixes app background color on dark mode.

  **Affected components:** Box

- d2fdded: Added indeterminate state support to the Checkbox component for handling partial selection scenarios like table header checkboxes.

  **Affected components:** Checkbox

- 4fb15d2: Added missing `aria-label` attributes to `SearchField` components in `Select`, `MenuAutocomplete`, and `MenuAutocompleteListbox` to fix accessibility warnings.

  **Affected components:** Select, MenuAutocomplete, MenuAutocompleteListbox

- 21c87cc: Fixes disabled state in primary and secondary buttons in Backstage UI.

  **Affected components:** Button

- 9c76682: build(deps-dev): bump `storybook` from 10.1.9 to 10.1.10
- de80336: Fixed disabled tertiary buttons incorrectly showing hover effects on surfaces.

  **Affected components:** Button

- 133d5c6: Added new Popover component for Backstage UI with automatic overflow handling, and full placement support. Also introduced `--bui-shadow` token for consistent elevation styling across overlay components (Popover, Tooltip, Menu).

  **Affected components:** Popover

- 973c839: Fixed Table sorting indicator not being visible when a column is actively sorted.

  **Affected components:** Table, Column

- df40cfc: Fixed Menu component trigger button not toggling correctly. Removed custom click-outside handler that was interfering with React Aria's built-in state management, allowing the menu to properly open and close when clicking the trigger button.

  **Affected components:** Menu

- b01ab96: Added support for column width configuration in Table component. Columns now accept `width`, `defaultWidth`, `minWidth`, and `maxWidth` props for responsive layout control.

  **Affected components:** Table, Column

- b4a4911: Fixed SearchField `startCollapsed` prop not working correctly in Backstage UI. The field now properly starts in a collapsed state, expands when clicked and focused, and collapses back when unfocused with no input. Also fixed CSS logic to work correctly in all layout contexts (flex row, flex column, and regular containers).

  **Affected components:** SearchField

- b3253b6: Fixed `Link` component causing hard page refreshes for internal routes. The component now properly uses React Router's navigation instead of full page reloads.
- fe7fe69: Added support for custom pagination options in `useTable` hook and `Table` component. You can now configure `pageSizeOptions` to customize the page size dropdown, and hook into pagination events via `onPageSizeChange`, `onNextPage`, and `onPreviousPage` callbacks. When `pageSize` doesn't match any option, the first option is used and a warning is logged.

  **Affected components:** Table, TablePagination

- cfac8a4: Fixed missing border styles on table selection cells in multi-select mode.

  **Affected components:** Table

- 2532d2a: Added `className` and `style` props to the `Table` component.

  **Affected components:** Table

## 0.11.0-next.1

### Minor Changes

- 243e5e7: **BREAKING**: Redesigned Table component with new `useTable` hook API.

  - The `Table` component (React Aria wrapper) is renamed to `TableRoot`
  - New high-level `Table` component that handles data display, pagination, sorting, and selection
  - The `useTable` hook is completely redesigned with a new API supporting three pagination modes (complete, offset, cursor)
  - New types: `ColumnConfig`, `TableProps`, `TableItem`, `UseTableOptions`, `UseTableResult`

  New features include unified pagination modes, debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.

  **Migration:**

  1. Update imports and use the new `useTable` hook:

  ```diff
  -import { Table, useTable } from '@backstage/ui';
  -const { data, paginationProps } = useTable({ data: items, pagination: {...} });
  +import { Table, useTable, type ColumnConfig } from '@backstage/ui';
  +const { tableProps } = useTable({
  +  mode: 'complete',
  +  getData: () => items,
  +});
  ```

  2. Define columns and render with the new Table API:

  ```diff
  -<Table aria-label="My table">
  -  <TableHeader>...</TableHeader>
  -  <TableBody items={data}>...</TableBody>
  -</Table>
  -<TablePagination {...paginationProps} />
  +const columns: ColumnConfig<Item>[] = [
  +  { id: 'name', label: 'Name', isRowHeader: true, cell: item => <CellText title={item.name} /> },
  +  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
  +];
  +
  +<Table columnConfig={columns} {...tableProps} />
  ```

  **Affected components:** Table, TableRoot, TablePagination

- 95246eb: **BREAKING**: Updating color tokens to match the new neutral style on different surfaces.

  **Migration:**

  There's no direct replacement for the old tint tokens but you can use the new neutral set of color tokens on surface 0 or 1 as a replacement.

  - `--bui-bg-tint` can be replaced by `--bui-bg-neutral-on-surface-0`
  - `--bui-bg-tint-hover` can be replaced by `--bui-bg-neutral-on-surface-0-hover`
  - `--bui-bg-tint-pressed` can be replaced by `--bui-bg-neutral-on-surface-0-pressed`
  - `--bui-bg-tint-disabled` can be replaced by `--bui-bg-neutral-on-surface-0-disabled`

- ea0c6d8: Introduce new `ToggleButton` & `ToggleButtonGroup` components in Backstage UI

### Patch Changes

- 21c87cc: Fixes disabled state in primary and secondary buttons in Backstage UI.
- b3253b6: Fixed `Link` component causing hard page refreshes for internal routes. The component now properly uses React Router's navigation instead of full page reloads.

## 0.11.0-next.0

### Minor Changes

- 4ea1d15: **BREAKING**: Renamed CSS variable `--bui-bg` to `--bui-bg-surface-0` for consistency.

### Patch Changes

- 1880402: Fixes app background color on dark mode.
- 9c76682: build(deps-dev): bump `storybook` from 10.1.9 to 10.1.10
- b4a4911: Fixed SearchField `startCollapsed` prop not working correctly in Backstage UI. The field now properly starts in a collapsed state, expands when clicked and focused, and collapses back when unfocused with no input. Also fixed CSS logic to work correctly in all layout contexts (flex row, flex column, and regular containers).

  **Affected components:** SearchField

## 0.10.0

### Minor Changes

- 16543fa: **BREAKING**: The `Cell` component has been refactored to be a generic wrapper component that accepts `children` for custom cell content. The text-specific functionality (previously part of `Cell`) has been moved to a new `CellText` component.

  **Migration:**

  If you were using `Cell` with text-specific props (`title`, `description`, `leadingIcon`, `href`), you need to update your code to use `CellText` instead:

  **Before:**

  ```tsx
  <Cell
    title="My Title"
    description="My description"
    leadingIcon={<Icon />}
    href="/path"
  />
  ```

  **After:**

  ```tsx
  <CellText
    title="My Title"
    description="My description"
    leadingIcon={<Icon />}
    href="/path"
  />
  ```

  For custom cell content, use the new generic `Cell` component:

  ```tsx
  <Cell>{/* Your custom content */}</Cell>
  ```

### Patch Changes

- 50b7927: Fixed Checkbox indicator showing checkmark color when unchecked.

  **Affected components:** Checkbox

- 5bacf55: Fixed `ButtonIcon` incorrectly applying `className` to inner elements instead of only the root element.

  **Affected components:** ButtonIcon

- b3ad928: Fixed Table Row component to correctly handle cases where no `href` is provided, preventing unnecessary router provider wrapping and fixing the cursor incorrectly showing as a pointer despite the element not being a link.

  **Affected components:** Row

- a20d317: Added row selection support with visual state styling for hover, selected, and pressed states. Fixed checkbox rendering to only show for multi-select toggle mode.

  **Affected components:** Table, TableHeader, Row, Column

- fe7c751: Fixed `useTable` hook to prioritize `providedRowCount` over data length for accurate row count in server-side pagination scenarios.
- c145031: Fixed Table column sorting indicator to show up arrow when no sort is active, correctly indicating that clicking will sort ascending.

  **Affected components:** Column

## 0.10.0-next.1

### Minor Changes

- 16543fa: **BREAKING**: The `Cell` component has been refactored to be a generic wrapper component that accepts `children` for custom cell content. The text-specific functionality (previously part of `Cell`) has been moved to a new `CellText` component.

  **Migration:**

  If you were using `Cell` with text-specific props (`title`, `description`, `leadingIcon`, `href`), you need to update your code to use `CellText` instead:

  **Before:**

  ```tsx
  <Cell
    title="My Title"
    description="My description"
    leadingIcon={<Icon />}
    href="/path"
  />
  ```

  **After:**

  ```tsx
  <CellText
    title="My Title"
    description="My description"
    leadingIcon={<Icon />}
    href="/path"
  />
  ```

  For custom cell content, use the new generic `Cell` component:

  ```tsx
  <Cell>{/* Your custom content */}</Cell>
  ```

### Patch Changes

- 50b7927: Fixed Checkbox indicator showing checkmark color when unchecked.

  **Affected components:** Checkbox

- 5bacf55: Fixed `ButtonIcon` incorrectly applying `className` to inner elements instead of only the root element.

  **Affected components:** ButtonIcon

- a20d317: Added row selection support with visual state styling for hover, selected, and pressed states. Fixed checkbox rendering to only show for multi-select toggle mode.

  **Affected components:** Table, TableHeader, Row, Column

## 0.9.1-next.0

### Patch Changes

- b3ad928: Fixed Table Row component to correctly handle cases where no `href` is provided, preventing unnecessary router provider wrapping and fixing the cursor incorrectly showing as a pointer despite the element not being a link.

  **Affected components:** Row

- fe7c751: Fixed `useTable` hook to prioritize `providedRowCount` over data length for accurate row count in server-side pagination scenarios.
- c145031: Fixed Table column sorting indicator to show up arrow when no sort is active, correctly indicating that clicking will sort ascending.

  **Affected components:** Column

## 0.9.0

### Minor Changes

- 539cf26: **BREAKING**: Migrated Avatar component from Base UI to custom implementation with size changes:

  - Base UI-specific props are no longer supported
  - Size values have been updated:
    - New `x-small` size added (1.25rem / 20px)
    - `small` size unchanged (1.5rem / 24px)
    - `medium` size unchanged (2rem / 32px, default)
    - `large` size **changed from 3rem to 2.5rem** (40px)
    - New `x-large` size added (3rem / 48px)

  **Migration:**

  ```diff
  # Remove Base UI-specific props
  - <Avatar src="..." name="..." render={...} />
  + <Avatar src="..." name="..." />

  # Update large size usage to x-large for same visual size
  - <Avatar src="..." name="..." size="large" />
  + <Avatar src="..." name="..." size="x-large" />
  ```

  Added `purpose` prop for accessibility control (`'informative'` or `'decoration'`).

  **Affected components:** Avatar

- 5c614ff: **BREAKING**: Migrated Checkbox component from Base UI to React Aria Components.

  API changes required:

  - `checked` → `isSelected`
  - `defaultChecked` → `defaultSelected`
  - `disabled` → `isDisabled`
  - `required` → `isRequired`
  - `label` prop removed - use `children` instead
  - CSS: `bui-CheckboxLabel` class removed
  - Data attribute: `data-checked` → `data-selected`
  - Use without label is no longer supported

  **Migration:**

  Before:

  ```tsx
  <Checkbox label="Accept terms" checked={agreed} onChange={setAgreed} />
  ```

  After:

  ```tsx
  <Checkbox isSelected={agreed} onChange={setAgreed}>
    Accept terms
  </Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox label="Option" disabled />
  ```

  After:

  ```tsx
  <Checkbox isDisabled>Option</Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox />
  ```

  After:

  ```tsx
  <Checkbox>
    <VisuallyHidden>Accessible label</VisuallyHidden>
  </Checkbox>
  ```

- 134151f: **BREAKING**: Fixing styles on SearchField in Backstage UI after migration to CSS modules. `SearchField` has now its own set of class names. We previously used class names from `TextField` but this approach was creating some confusion so going forward in your theme you'll be able to theme `TextField` and `SearchField` separately.
- a67670d: **BREAKING**: Removed central `componentDefinitions` object and related type utilities (`ComponentDefinitionName`, `ComponentClassNames`).

  Component definitions are primarily intended for documenting the CSS class API for theming purposes, not for programmatic use in JavaScript/TypeScript.

  **Migration:**

  If you were using component definitions or class names to build custom components, we recommend migrating to either:

  - Use Backstage UI components directly as building blocks, or
  - Duplicate the component CSS in your own stylesheets instead of relying on internal class names

- b78fc45: **BREAKING**: Changed className prop behavior to augment default styles instead of being ignored or overriding them.

  If you were passing custom className values to any of these components that relied on the previous behavior, you may need to adjust your styles to account for the default classes now being applied alongside your custom classes.

  **Affected components:** Menu, MenuListBox, MenuAutocomplete, MenuAutocompleteListbox, MenuItem, MenuListBoxItem, MenuSection, MenuSeparator, Switch, Skeleton, FieldLabel, Header, HeaderToolbar, HeaderPage, Tabs, TabList, Tab, TabPanel

- 83c100e: **BREAKING**: Removed `Collapsible` component. Migrate to `Accordion` or use React Aria `Disclosure`.

  **Migration:**

  **Path 1: Accordion (Opinionated Styled Component)**

  Accordion provides preset styling with a similar component structure.

  ```diff
  - import { Collapsible } from '@backstage/ui';
  + import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

  - <Collapsible.Root>
  -   <Collapsible.Trigger render={(props) => <Button {...props}>Toggle</Button>} />
  -   <Collapsible.Panel>Content</Collapsible.Panel>
  - </Collapsible.Root>

  + <Accordion>
  +   <AccordionTrigger title="Toggle" />
  +   <AccordionPanel>Content</AccordionPanel>
  + </Accordion>
  ```

  CSS classes: `.bui-CollapsibleRoot` → `.bui-Accordion`, `.bui-CollapsibleTrigger` → `.bui-AccordionTrigger` (now on heading element), `.bui-CollapsiblePanel` → `.bui-AccordionPanel`

  **Path 2: React Aria Disclosure (Full Customization)**

  For custom styling without preset styles:

  ```tsx
  import { Disclosure, Button, DisclosurePanel } from 'react-aria-components';

  <Disclosure>
    <Button slot="trigger">Toggle</Button>
    <DisclosurePanel>Content</DisclosurePanel>
  </Disclosure>;
  ```

- 816af0f: **BREAKING**: The `SelectProps` interface now accepts a generic type parameter for selection mode.

  Added searchable and multiple selection support to Select component. The component now accepts `searchable`, `selectionMode`, and `searchPlaceholder` props to enable filtering and multi-selection modes.

  **Migration:**

  If you're using `SelectProps` type directly, update from `SelectProps` to `SelectProps<'single' | 'multiple'>`. Component usage remains backward compatible.

  **Affected components:** Select

### Patch Changes

- d01de00: Fix broken external links in Backstage UI Header component.

  **Affected components:** Header

- 35a3614: Fixed CSS issues in Select component including popover width constraints, focus outline behavior, and overflow handling.

  **Affected components:** Select

- 01476f0: Improved visual consistency of PasswordField, SearchField, and MenuAutocomplete components.

  **Affected components:** PasswordField, SearchField, MenuAutocomplete

- 26c6a78: Fix default text color in Backstage UI

  **Affected components:** Text

- deaa427: Fixed Text component to prevent `truncate` prop from being spread to the underlying DOM element.

  **Affected components:** Text

- 1059f95: Improved the Link component structure in Backstage UI.

  **Affected components:** Link

- 836b0c7: Fixed dialog backdrop appearance in dark mode.

  **Affected components:** Dialog

- 6874094: Migrated CellProfile component from Base UI Avatar to Backstage UI Avatar component.

  **Affected components:** Avatar

- 719d772: Avatar components in x-small and small sizes now display only one initial instead of two, improving readability at smaller dimensions.

  **Affected components:** Avatar

- 6d35a6b: Removed `@base-ui-components/react` dependency as all components now use React Aria Components.
- dac851f: Fix the default font size in Backstage UI.
- 3c0ea67: Fix CSS layer ordering in Backstage UI to make sure component styles are loaded after tokens and base declarations.
- 3b18d80: Fixed RadioGroup radio button ellipse distortion by preventing flex shrink and grow.

  **Affected components:** RadioGroup

- 4eb455c: Fix font smoothing as default in Backstage UI.
- ff9f0c3: Enable tree-shaking of imports other than `*.css`.
- 7839e7b: Added `loading` prop to Button and ButtonIcon components for displaying spinner during async operations.

  **Affected components:** Button, ButtonIcon

- a00fb88: Fixed Table Row component to properly support opening links in new tabs via right-click or Cmd+Click when using the `href` prop.

  **Affected components:** Table

- e16ece5: Set the color-scheme property depending on theme
- 1ef3ca4: Added new VisuallyHidden component for hiding content visually while keeping it accessible to screen readers.

  **Affected components:** VisuallyHidden

- 00bfb83: Fix default font weight and font family in Backstage UI.

## 0.9.0-next.3

### Minor Changes

- 83c100e: **BREAKING**: Removed `Collapsible` component. Migrate to `Accordion` or use React Aria `Disclosure`.

  **Migration:**

  **Path 1: Accordion (Opinionated Styled Component)**

  Accordion provides preset styling with a similar component structure.

  ```diff
  - import { Collapsible } from '@backstage/ui';
  + import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

  - <Collapsible.Root>
  -   <Collapsible.Trigger render={(props) => <Button {...props}>Toggle</Button>} />
  -   <Collapsible.Panel>Content</Collapsible.Panel>
  - </Collapsible.Root>

  + <Accordion>
  +   <AccordionTrigger title="Toggle" />
  +   <AccordionPanel>Content</AccordionPanel>
  + </Accordion>
  ```

  CSS classes: `.bui-CollapsibleRoot` → `.bui-Accordion`, `.bui-CollapsibleTrigger` → `.bui-AccordionTrigger` (now on heading element), `.bui-CollapsiblePanel` → `.bui-AccordionPanel`

  **Path 2: React Aria Disclosure (Full Customization)**

  For custom styling without preset styles:

  ```tsx
  import { Disclosure, Button, DisclosurePanel } from 'react-aria-components';

  <Disclosure>
    <Button slot="trigger">Toggle</Button>
    <DisclosurePanel>Content</DisclosurePanel>
  </Disclosure>;
  ```

- 816af0f: **BREAKING**: The `SelectProps` interface now accepts a generic type parameter for selection mode.

  Added searchable and multiple selection support to Select component. The component now accepts `searchable`, `selectionMode`, and `searchPlaceholder` props to enable filtering and multi-selection modes.

  **Migration:**

  If you're using `SelectProps` type directly, update from `SelectProps` to `SelectProps<'single' | 'multiple'>`. Component usage remains backward compatible.

### Patch Changes

- 35a3614: Fixed CSS issues in Select component including popover width constraints, focus outline behavior, and overflow handling.
- 01476f0: Improved visual consistency of PasswordField, SearchField, and MenuAutocomplete components.
- 836b0c7: Fixed dialog backdrop appearance in dark mode.
- 6d35a6b: Removed `@base-ui-components/react` dependency as all components now use React Aria Components.
- 7839e7b: Added `loading` prop to Button and ButtonIcon components for displaying spinner during async operations.
- a00fb88: Fixed Table Row component to properly support opening links in new tabs via right-click or Cmd+Click when using the href prop.

## 0.9.0-next.2

### Minor Changes

- 539cf26: **BREAKING**: Migrated Avatar component from Base UI to custom implementation with size changes:

  - Base UI-specific props are no longer supported
  - Size values have been updated:
    - New `x-small` size added (1.25rem / 20px)
    - `small` size unchanged (1.5rem / 24px)
    - `medium` size unchanged (2rem / 32px, default)
    - `large` size **changed from 3rem to 2.5rem** (40px)
    - New `x-large` size added (3rem / 48px)

  **Migration:**

  ```diff
  # Remove Base UI-specific props
  - <Avatar src="..." name="..." render={...} />
  + <Avatar src="..." name="..." />

  # Update large size usage to x-large for same visual size
  - <Avatar src="..." name="..." size="large" />
  + <Avatar src="..." name="..." size="x-large" />
  ```

  Added `purpose` prop for accessibility control (`'informative'` or `'decoration'`).

- 134151f: **BREAKING**: Fixing styles on SearchField in Backstage UI after migration to CSS modules. `SearchField` has now its own set of class names. We previously used class names from `TextField` but this approach was creating some confusion so going forward in your theme you'll be able to theme `TextField` and `SearchField` separately.

### Patch Changes

- d01de00: Fix broken external links in Backstage UI Header component.
- deaa427: Fixed Text component to prevent `truncate` prop from being spread to the underlying DOM element.
- 1059f95: Improved the Link component structure in Backstage UI.
- 6874094: Migrated CellProfile component from Base UI Avatar to Backstage UI Avatar component.
- 719d772: Avatar components in x-small and small sizes now display only one initial instead of two, improving readability at smaller dimensions.
- 3b18d80: Fixed RadioGroup radio button ellipse distortion by preventing flex shrink and grow.
- e16ece5: Set the color-scheme property depending on theme

## 0.9.0-next.1

### Minor Changes

- 5c614ff: **BREAKING**: Migrated Checkbox component from Base UI to React Aria Components.

  API changes required:

  - `checked` → `isSelected`
  - `defaultChecked` → `defaultSelected`
  - `disabled` → `isDisabled`
  - `required` → `isRequired`
  - `label` prop removed - use `children` instead
  - CSS: `bui-CheckboxLabel` class removed
  - Data attribute: `data-checked` → `data-selected`
  - Use without label is no longer supported

  **Migration:**

  Before:

  ```tsx
  <Checkbox label="Accept terms" checked={agreed} onChange={setAgreed} />
  ```

  After:

  ```tsx
  <Checkbox isSelected={agreed} onChange={setAgreed}>
    Accept terms
  </Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox label="Option" disabled />
  ```

  After:

  ```tsx
  <Checkbox isDisabled>Option</Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox />
  ```

  After:

  ```tsx
  <Checkbox>
    <VisuallyHidden>Accessible label</VisuallyHidden>
  </Checkbox>
  ```

- b78fc45: **BREAKING**: Changed className prop behavior to augment default styles instead of being ignored or overriding them.

  If you were passing custom className values to any of these components that relied on the previous behavior, you may need to adjust your styles to account for the default classes now being applied alongside your custom classes.

  **Affected components:** Menu, MenuListBox, MenuAutocomplete, MenuAutocompleteListbox, MenuItem, MenuListBoxItem, MenuSection, MenuSeparator, Switch, Skeleton, FieldLabel, Header, HeaderToolbar, HeaderPage, Tabs, TabList, Tab, TabPanel

### Patch Changes

- ff9f0c3: Enable tree-shaking of imports other than `*.css`.
- 1ef3ca4: Added new VisuallyHidden component for hiding content visually while keeping it accessible to screen readers.

## 0.8.2-next.0

### Patch Changes

- 26c6a78: Fix default text color in Backstage UI
- dac851f: Fix the default font size in Backstage UI.
- 3c0ea67: Fix CSS layer ordering in Backstage UI to make sure component styles are loaded after tokens and base declarations.
- 4eb455c: Fix font smoothing as default in Backstage UI.
- 00bfb83: Fix default font weight and font family in Backstage UI.

## 0.8.0

### Minor Changes

- 9acc1d6: **BREAKING**: Added a new `PasswordField` component. As part of this change, the `password` and `search` types have been removed from `TextField`.
- b0d11b5: **BREAKING** Restructure Backstage UI component styling to use CSS Modules instead of pure CSS. We don't expect this to be an issue in practice but it is important to call out that all styles are now loaded through CSS modules with generated class names. We are still providing fixed class names for all components to allow anyone to style their Backstage instance.
- 0c53517: **BREAKING** The ScrollArea component has been removed from Backstage UI because it did not meet our accessibility standards.
- 7b319c5: **BREAKING** Remove Icon component in Backstage UI. This component was creating issue for tree-shaking. It is recommended to use icons from @remixicon/react until we found a better alternative in Backstage UI.

### Patch Changes

- 2591b42: Adding a new Dialog component to Backstage UI.
- 827340f: remove default selection of tab
- 5dc17cc: Fix margin utility classes in Backstage UI.
- 85faee0: Fix scroll jumping when opening menu in Backstage UI.
- 3c921c5: Making href mandatory in tabs that are part of a Header component
- df7d2cf: Update react-aria-components to version 1.13.0
- 507ee55: Fix table sorting icon position in Backstage UI.
- 8b7c3c9: Add new `virtualized`, `maxWidth` and `maxHeight` props to `Menu`, `MenuListBox`, `MenuAutocomplete` and `MenuAutocompleteListBox` to allow for virtalization of long lists inside menus.
- b940062: Added support for data attributes in `<Box />`, `<Container />`, `<Flex />`, and `<Grid />` components, ensuring they are correctly applied to the rendered elements.
- 206c801: Cleaning up Backstage UI props definitions as well as removing ScrollArea in Card to improve accessibility.
- 5c21e45: Add react router for internal routing for ButtonLinks
- 865bce8: Added a background color default on the body
- af4d9b4: We are restructuring our CSS to have a better layer structure.
- 9a47125: Improved SearchField component flex layout and animations. Fixed SearchField behavior in Header components by switching from width-based transitions to flex-basis transitions for better responsive behavior. Added new Storybook stories to test SearchField integration with Header component.
- 9781815: Remove auto selection of tabs for tabs that all have href defined
- 4adbb03: Avoid overriding onChange when spreading props
- f6dff5b: Using react router for internal links in the Menu component

## 0.7.2-next.2

### Patch Changes

- 3c921c5: Making href mandatory in tabs that are part of a Header component
- 5c21e45: Add react router for internal routing for ButtonLinks
- 9781815: Remove auto selection of tabs for tabs that all have href defined
- f6dff5b: Using react router for internal links in the Menu component

## 0.7.2-next.1

### Patch Changes

- a9b88be: Enable tooltips on disabled buttons with automatic wrapper
- 4adbb03: Avoid overriding onChange when spreading props

## 0.7.2-next.0

### Patch Changes

- 827340f: remove default selection of tab
- 9a47125: Improved SearchField component flex layout and animations. Fixed SearchField behavior in Header components by switching from width-based transitions to flex-basis transitions for better responsive behavior. Added new Storybook stories to test SearchField integration with Header component.

## 0.7.1

### Patch Changes

- 7307930: Add missing class for flex: baseline
- 89da341: Fix Select component to properly attach aria-label and aria-labelledby props to the rendered element for improved accessibility.
- 0ffa4c7: Removed the need to mock `window.matchMedia` in tests, falling back to default breakpoint values instead.

## 0.7.1-next.0

### Patch Changes

- 7307930: Add missing class for flex: baseline
- 89da341: Fix Select component to properly attach aria-label and aria-labelledby props to the rendered element for improved accessibility.

## 0.7.0

### Minor Changes

- 0615e54: **BREAKING**: We are moving our DataTable component to React Aria. We removed our DataTable to only use Table as a single and opinionated option for tables. This new structure is made possible by using React Aria under the hood.
- b245c9d: **BREAKING**: Backstage UI - HeaderPage - We are updating the breadcrumb to be more visible and accessible.
- 800f593: **BREAKING**: We are updating the Menu component to use React Aria under the hood. The structure and all props are changing to follow React Aria's guidance.
- b0e47f3: **BREAKING**: We are upgrading our `Text` component to support all font sizes making the `Heading` component redundant. The new `Text` component introduces 4 sizes for title and 4 sizes for body text. All of these work in multiple colors and font weights. We improved the `as` prop to include all possible values. The `Link` component has also been updated to match the new `Text` component.

### Patch Changes

- de89a3d: Fixes some styles on the Select component in BUI.
- a251b3e: Export CardHeader, CardBody and CardFooter from Card component index
- f761306: Add new TagGroup component to Backstage UI.
- 75fead9: Fixes a couple of small bugs in BUI including setting H1 and H2 correctly on the Header and HeaderPage.
- e7ff178: Update styling of Tooltip element
- 230b410: **BREAKING**: Move breadcrumb to fit in the `HeaderPage` instead of the `Header` in Backstage UI.
- 2f9a084: We are motion away from `motion` to use `gsap` instead to make Backstage UI backward compatible with React 17.
- d4e603e: Updated Menu component in Backstage UI to use useId() from React Aria instead of React to support React 17.
- 8bdc491: Remove stylesheet import from Select component.
- 404b426: Add `startCollapsed` prop on the `SearchField` component in BUI.
- e0e886f: Adds onTabSelectionChange to ui header component.

## 0.7.0-next.3

### Minor Changes

- 0615e54: **BREAKING**: We are moving our DataTable component to React Aria. We removed our DataTable to only use Table as a single and opinionated option for tables. This new structure is made possible by using React Aria under the hood.

### Patch Changes

- 230b410: **BREAKING**: Move breadcrumb to fit in the `HeaderPage` instead of the `Header` in Backstage UI.
- 8bdc491: Remove stylesheet import from Select component.
- 404b426: Add `startCollapsed` prop on the `SearchField` component in BUI.

## 0.7.0-next.2

### Patch Changes

- d4e603e: Updated Menu component in Backstage UI to use useId() from React Aria instead of React to support React 17.

## 0.7.0-next.1

### Patch Changes

- de89a3d: Fixes some styles on the Select component in BUI.
- 75fead9: Fixes a couple of small bugs in BUI including setting H1 and H2 correctly on the Header and HeaderPage.
- 2f9a084: We are motion away from `motion` to use `gsap` instead to make Backstage UI backward compatible with React 17.

## 0.7.0-next.0

### Minor Changes

- b0e47f3: **BREAKING**: We are upgrading our `Text` component to support all font sizes making the `Heading` component redundant. The new `Text` component introduces 4 sizes for title and 4 sizes for body text. All of these work in multiple colors and font weights. We improved the `as` prop to include all possible values. The `Link` component has also been updated to match the new `Text` component.

### Patch Changes

- e7ff178: Update styling of Tooltip element
- e0e886f: Adds onTabSelectionChange to ui header component.

## 0.6.0

### Minor Changes

- e92bb9b: **BREAKING**: Canon has been renamed to Backstage UI. This means that `@backstage/canon` has been deprecated and replaced by `@backstage/ui`.

## 0.6.0-next.1

### Minor Changes

- 2e30459: **BREAKING**: We are moving our Tooltip component to use React Aria under the hood. In doing so, the structure of the component and its prop are changing to follow the new underlying structure.

### Patch Changes

- 76255b8: Add new Card component to Canon.
- b0a6c8e: Add new Header component to Canon.
- be76576: Improve Button, ButtonIcon and ButtonLink styling in Canon.
- 17beb9b: Update return types for Heading & Text components for React 19.
- eac4a4c: Add new tertiary variant to Button, ButtonIcon and ButtonLink in Canon.
- 8f2e82d: Add new Skeleton component in Canon

## 0.6.0-next.0

### Minor Changes

- 4c6d891: **BREAKING**:

  We’re updating our Button component to provide better support for button links.

  - We’re introducing a new `ButtonLink` component, which replaces the previous render prop pattern.
  - To maintain naming consistency across components, `IconButton` is being renamed to `ButtonIcon`.
  - Additionally, the render prop will be removed from all button-related components.

  These changes aim to simplify usage and improve clarity in our component API.

### Patch Changes

- 140f652: We are consolidating all css files into a single styles.css in Canon.
- 8154fb9: Add new SearchField component in Canon
- 6910892: Add new `RadioGroup` + `Radio` component to Canon
- a8a8514: We are transforming how we structure our class names and data attributes definitions for all components. They are now all set in the same place.
- 667b951: Added placeholder prop to TextField component.
- e71333a: adding export for ButtonLink so it's importable

## 0.5.0

### Minor Changes

- 621fac9: **BREAKING**: We are updating the default size of the Button component in Canon to be small instead of medium.
- a842554: **BREAKING**: We set the default size for IconButton in Canon to be small instead of medium.
- 35fd51d: **BREAKING**: Move TextField component to use react Aria under the hood. Introducing a new FieldLabel component to help build custom fields.
- 78204a2: **BREAKING**: We are adding a new as prop on the Heading and Text component to make it easier to change the component tag. We are removing the render prop in favour of the as prop.
- c49e335: **BREAKING**: TextField in Canon now has multiple label sizes as well as the capacity to hide label and description but still make them available for screen readers.
- 24b45ef: **BREAKING**: Fixes spacing props on layout components and aligned on naming for the Grid component. You should now call the Grid root component using `<Grid.Root />` instead of just `<Grid />`.

### Patch Changes

- 44df879: Add min-width: 0; by default on every Flex components in Canon to help support truncated texts inside flex elements.
- ee6ffe6: Fix styling for the title4 prop on the Heading component in Canon.
- f2f814a: Added a render prop to the Button component in Canon to use it as a link.
- 98f02a6: Add new Switch component in Canon.
- c94f8e0: The filter input in menu comboboxes should now always use the full width of the menu it's in.
- 269316d: Remove leftover console.log from Container component.

## 0.5.0-next.2

### Patch Changes

- 44df879: Add min-width: 0; by default on every Flex components in Canon to help support truncated texts inside flex elements.
- ee6ffe6: Fix styling for the title4 prop on the Heading component in Canon.
- f2f814a: Added a render prop to the Button component in Canon to use it as a link.

## 0.5.0-next.1

### Minor Changes

- 621fac9: We are updating the default size of the Button component in Canon to be small instead of medium.
- a842554: We set the default size for IconButton in Canon to be small instead of medium.

## 0.5.0-next.0

### Minor Changes

- 24b45ef: Fixes spacing props on layout components and aligned on naming for the Grid component. You should now call the Grid root component using `<Grid.Root />` instead of just `<Grid />`.

### Patch Changes

- 269316d: Remove leftover console.log from Container component.

## 0.4.0

### Minor Changes

- ea36f74: **BREAKING**: Icons on Button and IconButton now need to be imported and placed like this: `<Button iconStart={<ChevronDownIcon />} />`
- ccb1fc6: **BREAKING**: We are modifying the way we treat custom render using 'useRender()' under the hood from BaseUI.
- 04a65c6: **BREAKING**: The icon prop in TextField now accept a ReactNode instead of an icon name. We also updated the icon sizes for each input sizes.

### Patch Changes

- c8f32db: Use correct colour token for TextField clear button icon, prevent layout shift whenever it is hidden or shown and properly size focus area around it. Also stop leading icon shrinking when used together with clear button.
- e996368: Fix Canon missing dependencies
- 720033c: For improved a11y, clicking a Select component label now focuses the Select trigger element, and the TextField component's label is now styled to indicate it's interactive.
- 6189bfd: Added new icon and onClear props to the TextField to make it easier to accessorize inputs.
- 9510105: Add new Tabs component to Canon
- 97b25a1: Pin version of @base-ui-components/react.
- 206ffbe: Fixed an issue with Canon's DataTable.Pagination component showing the wrong number for the "to" count.
- 72d019d: Removed various typos
- 4551fb7: Update Menu component in Canon to make the UI more condensed. We are also adding a new Combobox option for nested navigation.
- 185d3a8: Use the Field component from Base UI within the TextField.
- 1ea1db0: Add new truncate prop to Text and Heading components in Canon.

## 0.4.0-next.3

### Patch Changes

- c8f32db: Use correct colour token for TextField clear button icon, prevent layout shift whenever it is hidden or shown and properly size focus area around it. Also stop leading icon shrinking when used together with clear button.

## 0.4.0-next.2

### Patch Changes

- 6189bfd: Added new icon and onClear props to the TextField to make it easier to accessorize inputs.
- 97b25a1: Pin version of @base-ui-components/react.
- 185d3a8: Use the Field component from Base UI within the TextField.

## 0.4.0-next.1

### Minor Changes

- ea36f74: **BREAKING**: Icons on Button and IconButton now need to be imported and placed like this: `<Button iconStart={<ChevronDownIcon />} />`

### Patch Changes

- 720033c: For improved a11y, clicking a Select component label now focuses the Select trigger element, and the TextField component's label is now styled to indicate it's interactive.
- 206ffbe: Fixed an issue with Canon's DataTable.Pagination component showing the wrong number for the "to" count.
- 72d019d: Removed various typos

## 0.3.2-next.0

### Patch Changes

- e996368: Fix Canon missing dependencies

## 0.3.0

### Minor Changes

- df4e292: **BREAKING**: Improve class name structure using data attributes instead of class names.
- f038613: **BREAKING**: Updated TextField and Select component to work with React Hook Form.
- 1b0cf40: **BREAKING**: Add new Select component for Canon
- 5074d61: **BREAKING**: Added a new TextField component to replace the Field and Input component. After feedback, it became clear that we needed to build a more opinionated version to avoid any problem in the future.

### Patch Changes

- 6af7b16: Updated styles for the Menu component in Canon.
- bcbc593: Fix Checkbox styles on dark theme in Canon.
- e7efb7d: Add new breakpoint helpers up(), down() and current breakpoint to help you use our breakpoints in your React components.
- f7cb538: Internal refactor and fixes to the prop extraction logic for layout components.
- 35b36ec: Add new Collapsible component for Canon.
- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html

- 513477f: Add global CSS reset for anchor tags.
- 24f0e08: Improved Container styles, changing our max-width to 120rem and improving padding on smaller screens.
- 851779d: Add new Avatar component to Canon.
- ec5ebd1: Add new TableCellProfile component for Table and DataTable in Canon.
- 5e80f0b: Fix types on the Icon component.
- 0e654bf: Add new DataTable component and update Table component styles.
- 7ae28ba: Move styles to the root of the TextField component.
- 4fe5b08: We added a render prop to the Link component to make sure it can work with React Router.
- 74d463c: Fix Select styles on small sizes + with long option names in Canon.
- f25a5be: Added a new gray scale for Canon for both light and dark theme.
- 5ee4fc2: Add support for column sizing in DataTable.
- 05a5003: Fix the Icon component when the name is not found to return null instead of an empty SVG.

## 0.3.0-next.2

### Minor Changes

- f038613: Updated TextField and Select component to work with React Hook Form.
- 1b0cf40: Add new Select component for Canon
- 5074d61: **BREAKING**: Added a new TextField component to replace the Field and Input component. After feedback, it became clear that we needed to build a more opinionated version to avoid any problem in the future.

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html

- 24f0e08: Improved Container styles, changing our max-width to 120rem and improving padding on smaller screens.
- 7ae28ba: Move styles to the root of the TextField component.
- 4fe5b08: We added a render prop to the Link component to make sure it can work with React Router.

## 0.2.1-next.1

### Patch Changes

- f7cb538: Internal refactor and fixes to the prop extraction logic for layout components.
- 5e80f0b: Fix types on the Icon component.

## 0.2.1-next.0

### Patch Changes

- 6af7b16: Updated styles for the Menu component in Canon.
- 513477f: Add global CSS reset for anchor tags.
- 05a5003: Fix the Icon component when the name is not found to return null instead of an empty SVG.

## 0.2.0

### Minor Changes

- 5a5db29: **BREAKING**: Fix CSS imports and move CSS outputs out of the dist folder.
- 4557beb: **BREAKING**: Added a new Tooltip component to Canon.
- 1e4dfdb: **BREAKING**: We added a new IconButton component with fixed sizes showcasing a single icon.
- e8d12f9: **BREAKING**: Added about 40 new icons to Canon.
- 8689010: **BREAKING**: We are renaming CanonProvider to IconProvider to improve clarity on how to override icons.
- bf319b7: **BREAKING**: Added a new Menu component to Canon.
- cb7e99d: **BREAKING**: Updating styles for Text and Link components as well as global surface tokens.
- bd8520d: **BREAKING**: Added a new ScrollArea component for Canon.

### Patch Changes

- 56850ca: Fix Button types that was preventing the use of native attributes like onClick.
- 89e8686: To avoid conflicts with Backstage, we removed global styles and set font-family and font-weight for each components.
- 05e9d41: Introducing Canon to Backstage. Canon styling system is based on pure CSS. We are adding our styles.css at the top of your Backstage instance.

## 0.2.0-next.1

### Minor Changes

- 8689010: We are renaming CanonProvider to IconProvider to improve clarity on how to override icons.

### Patch Changes

- 89e8686: To avoid conflicts with Backstage, we removed global styles and set font-family and font-weight for each components.

## 0.2.0-next.0

### Minor Changes

- 5a5db29: Fix CSS imports and move CSS outputs out of the dist folder.

## 0.1.0

### Minor Changes

- 72c9800: **BREAKING**: Merged the Stack and Inline component into a single component called Flex.
- 65f4acc: **BREAKING**: This is the first alpha release for Canon. As part of this release we are introducing 5 layout components and 7 components. All theming is done through CSS variables.
- 1e4ccce: **BREAKING**: Fixing css structure and making sure that props are applying the correct styles for all responsive values.
- 8309bdb: **BREAKING**: Updated core CSS tokens and fixing the Button component accordingly.

### Patch Changes

- 989af25: Removed client directive as they are not needed in React 18.
- f44e5cf: Fix spacing props not being applied for custom values.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.0-next.2

### Minor Changes

- 8309bdb: Updated core CSS tokens and fixing the Button component accordingly.

### Patch Changes

- f44e5cf: Fix spacing props not being applied for custom values.

## 0.1.0-next.1

### Minor Changes

- 72c9800: **BREAKING**: Merged the Stack and Inline component into a single component called Flex.
- 1e4ccce: **BREAKING**: Fixing css structure and making sure that props are applying the correct styles for all responsive values.

### Patch Changes

- 989af25: Removed client directive as they are not needed in React 18.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.0-next.0

### Minor Changes

- 65f4acc: This is the first alpha release for Canon. As part of this release we are introducing 5 layout components and 7 components. All theming is done through CSS variables.
