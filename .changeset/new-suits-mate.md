---
'@backstage/plugin-catalog-import': patch
---

Use title form field value for the commit message on catalog import PRs. Also allow customization of the pull requests title or body only. For example:

```tsx
<Route
  path="/catalog-import"
  element={
    <CatalogImportPage
      pullRequest={{
        preparePullRequest: () => ({
          title: 'chore: add backstage catalog file [skip ci]',
        }),
      }}
    />
  }
/>
```
