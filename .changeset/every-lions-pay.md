---
'@backstage/ui': minor
---

**BREAKING**: Redesigned Table component with new `useTable` hook API.

- The `Table` component (React Aria wrapper) is renamed to `TableRoot`
- New high-level `Table` component that handles data display, pagination, sorting, and selection
- The `useTable` hook is completely redesigned with a new API supporting three pagination modes (complete, offset, cursor)
- New types: `ColumnConfig`, `TableProps`, `TableItem`, `UseTableOptions`, `UseTableResult`

New features include unified pagination modes, debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.

**Migration guide:**

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

Affected components: Table, TableRoot, TablePagination
