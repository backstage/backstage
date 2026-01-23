import type { ChangelogProps } from '../types';

export const changelog_0_11_0: ChangelogProps[] = [
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32050'],
    description: `**BREAKING**: Redesigned Table component with new \`useTable\` hook API.

  - The \`Table\` component (React Aria wrapper) is renamed to \`TableRoot\`
  - New high-level \`Table\` component that handles data display, pagination, sorting, and selection
  - The \`useTable\` hook is completely redesigned with a new API supporting three pagination modes (complete, offset, cursor)
  - New types: \`ColumnConfig\`, \`TableProps\`, \`TableItem\`, \`UseTableOptions\`, \`UseTableResult\`

  New features include unified pagination modes, debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.`,
    migration: `1. Update imports and use the new \`useTable\` hook:

\`\`\`diff
-import { Table, useTable } from '@backstage/ui';
-const { data, paginationProps } = useTable({ data: items, pagination: {...} });
+import { Table, useTable, type ColumnConfig } from '@backstage/ui';
+const { tableProps } = useTable({
+  mode: 'complete',
+  getData: () => items,
+});
\`\`\`

2. Define columns and render with the new Table API:

\`\`\`diff
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
\`\`\``,
    breaking: true,
    commitSha: '243e5e7',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32202'],
    description: `**BREAKING**: Updating color tokens to match the new neutral style on different surfaces.`,
    migration: `There's no direct replacement for the old tint tokens but you can use the new neutral set of color tokens on surface 0 or 1 as a replacement.

- \`--bui-bg-tint\` can be replaced by \`--bui-bg-neutral-on-surface-0\`
- \`--bui-bg-tint-hover\` can be replaced by \`--bui-bg-neutral-on-surface-0-hover\`
- \`--bui-bg-tint-pressed\` can be replaced by \`--bui-bg-neutral-on-surface-0-pressed\`
- \`--bui-bg-tint-disabled\` can be replaced by \`--bui-bg-neutral-on-surface-0-disabled\``,
    breaking: true,
    commitSha: '95246eb',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32232'],
    description: `**BREAKING**: Introduce new \`ToggleButton\` & \`ToggleButtonGroup\` components in Backstage UI`,
    breaking: true,
    commitSha: 'ea0c6d8',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32200'],
    description: `**BREAKING**: Renamed CSS variable \`--bui-bg\` to \`--bui-bg-surface-0\` for consistency.`,
    breaking: true,
    commitSha: '4ea1d15',
  },
  {
    components: ['box'],
    version: '0.11.0',
    prs: ['32203'],
    description: `Fixes app background color on dark mode.`,

    commitSha: '1880402',
  },
  {
    components: ['checkbox'],
    version: '0.11.0',
    prs: ['32371'],
    description: `Added indeterminate state support to the Checkbox component for handling partial selection scenarios like table header checkboxes.`,

    commitSha: 'd2fdded',
  },
  {
    components: ['select'],
    version: '0.11.0',
    prs: ['32337'],
    description: `Added missing \`aria-label\` attributes to \`SearchField\` components in \`Select\`, \`MenuAutocomplete\`, and \`MenuAutocompleteListbox\` to fix accessibility warnings.`,

    commitSha: '4fb15d2',
  },
  {
    components: ['button'],
    version: '0.11.0',
    prs: ['32297'],
    description: `Fixes disabled state in primary and secondary buttons in Backstage UI.`,

    commitSha: '21c87cc',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32185'],
    description: `build(deps-dev): bump \`storybook\` from 10.1.9 to 10.1.10`,

    commitSha: '9c76682',
  },
  {
    components: ['button'],
    version: '0.11.0',
    prs: ['32385'],
    description: `Fixed disabled tertiary buttons incorrectly showing hover effects on surfaces.`,

    commitSha: 'de80336',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32313'],
    description: `Added new Popover component for Backstage UI with automatic overflow handling, and full placement support. Also introduced \`--bui-shadow\` token for consistent elevation styling across overlay components (Popover, Tooltip, Menu).`,

    commitSha: '133d5c6',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32350'],
    description: `Fixed Table sorting indicator not being visible when a column is actively sorted.`,

    commitSha: '973c839',
  },
  {
    components: ['menu'],
    version: '0.11.0',
    prs: ['32347'],
    description: `Fixed Menu component trigger button not toggling correctly. Removed custom click-outside handler that was interfering with React Aria's built-in state management, allowing the menu to properly open and close when clicking the trigger button.`,

    commitSha: 'df40cfc',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32336'],
    description: `Added support for column width configuration in Table component. Columns now accept \`width\`, \`defaultWidth\`, \`minWidth\`, and \`maxWidth\` props for responsive layout control.`,

    commitSha: 'b01ab96',
  },
  {
    components: ['searchfield'],
    version: '0.11.0',
    prs: ['32123'],
    description: `Fixed SearchField \`startCollapsed\` prop not working correctly in Backstage UI. The field now properly starts in a collapsed state, expands when clicked and focused, and collapses back when unfocused with no input. Also fixed CSS logic to work correctly in all layout contexts (flex row, flex column, and regular containers).`,

    commitSha: 'b4a4911',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32265'],
    description: `Fixed \`Link\` component causing hard page refreshes for internal routes. The component now properly uses React Router's navigation instead of full page reloads.`,

    commitSha: 'b3253b6',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32321'],
    description: `Added support for custom pagination options in \`useTable\` hook and \`Table\` component. You can now configure \`pageSizeOptions\` to customize the page size dropdown, and hook into pagination events via \`onPageSizeChange\`, \`onNextPage\`, and \`onPreviousPage\` callbacks. When \`pageSize\` doesn't match any option, the first option is used and a warning is logged.`,

    commitSha: 'fe7fe69',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32369'],
    description: `Fixed missing border styles on table selection cells in multi-select mode.`,

    commitSha: 'cfac8a4',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32342'],
    description: `Added \`className\` and \`style\` props to the \`Table\` component.`,

    commitSha: '2532d2a',
  },
  {
    components: ['table'],
    version: '0.11.0',
    prs: ['32050'],
    description: `**BREAKING**: Redesigned Table component with new \`useTable\` hook API.

  - The \`Table\` component (React Aria wrapper) is renamed to \`TableRoot\`
  - New high-level \`Table\` component that handles data display, pagination, sorting, and selection
  - The \`useTable\` hook is completely redesigned with a new API supporting three pagination modes (complete, offset, cursor)
  - New types: \`ColumnConfig\`, \`TableProps\`, \`TableItem\`, \`UseTableOptions\`, \`UseTableResult\`

  New features include unified pagination modes, debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.`,
    migration: `1. Update imports and use the new \`useTable\` hook:

\`\`\`diff
-import { Table, useTable } from '@backstage/ui';
-const { data, paginationProps } = useTable({ data: items, pagination: {...} });
+import { Table, useTable, type ColumnConfig } from '@backstage/ui';
+const { tableProps } = useTable({
+  mode: 'complete',
+  getData: () => items,
+});
\`\`\`

2. Define columns and render with the new Table API:

\`\`\`diff
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
\`\`\``,
    breaking: true,
    commitSha: '243e5e7',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32202'],
    description: `**BREAKING**: Updating color tokens to match the new neutral style on different surfaces.`,
    migration: `There's no direct replacement for the old tint tokens but you can use the new neutral set of color tokens on surface 0 or 1 as a replacement.

- \`--bui-bg-tint\` can be replaced by \`--bui-bg-neutral-on-surface-0\`
- \`--bui-bg-tint-hover\` can be replaced by \`--bui-bg-neutral-on-surface-0-hover\`
- \`--bui-bg-tint-pressed\` can be replaced by \`--bui-bg-neutral-on-surface-0-pressed\`
- \`--bui-bg-tint-disabled\` can be replaced by \`--bui-bg-neutral-on-surface-0-disabled\``,
    breaking: true,
    commitSha: '95246eb',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32232'],
    description: `Introduce new \`ToggleButton\` & \`ToggleButtonGroup\` components in Backstage UI`,
    breaking: true,
    commitSha: 'ea0c6d8',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32297'],
    description: `Fixes disabled state in primary and secondary buttons in Backstage UI.`,

    commitSha: '21c87cc',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32265'],
    description: `Fixed \`Link\` component causing hard page refreshes for internal routes. The component now properly uses React Router's navigation instead of full page reloads.`,

    commitSha: 'b3253b6',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32200'],
    description: `**BREAKING**: Renamed CSS variable \`--bui-bg\` to \`--bui-bg-surface-0\` for consistency.`,
    breaking: true,
    commitSha: '4ea1d15',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32203'],
    description: `Fixes app background color on dark mode.`,

    commitSha: '1880402',
  },
  {
    components: [],
    version: '0.11.0',
    prs: ['32185'],
    description: `build(deps-dev): bump \`storybook\` from 10.1.9 to 10.1.10`,

    commitSha: '9c76682',
  },
  {
    components: ['searchfield'],
    version: '0.11.0',
    prs: ['32123'],
    description: `Fixed SearchField \`startCollapsed\` prop not working correctly in Backstage UI. The field now properly starts in a collapsed state, expands when clicked and focused, and collapses back when unfocused with no input. Also fixed CSS logic to work correctly in all layout contexts (flex row, flex column, and regular containers).`,

    commitSha: 'b4a4911',
  },
];
