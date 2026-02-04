---
'@backstage/ui': patch
---

Add option to automatically determine the columns widths based on the content, and CSS styling of the inner TableRoot component.

Example: A Table can now be in a container and grow wider for horizontal scrolling, and adapt column widths automatically:

```tsx
<Table
  style={{ width: '100%', overflowX: 'auto' }}
  columnConfig={tableColumns}
  tableLayout="auto"
  styles={{
    tableRoot: { width: 'auto', minWidth: '100%' },
  }}
  {...tableProps}
/>
```

Affected components: Table
