---
'@backstage/ui': minor
---

**BREAKING**: The `cell` and `header` properties in `ColumnConfig` now return `ReactElement` instead of `ReactNode`.

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
