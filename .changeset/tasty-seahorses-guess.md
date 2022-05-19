---
'@backstage/plugin-techdocs': patch
---

Extend the DocsTable component to accept custom user-defined options while still providing default values in case of empty.

```tsx

...

const options = {
  paging: false,
  search: false,
  showTitle: false,
  toolbar: false,
};

...

<DocsTable
  entities={entities}
  columns={columns}
  options={options}
  loading={loading}
  actions={actions}
/>
```
