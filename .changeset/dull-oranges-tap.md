---
'@backstage/plugin-techdocs': minor
---

Add ability to configure filters when using EntityListDocsGrid

The following example will render two sections of cards grid:

- One section for documentations tagged as `recommended`
- One section for documentations tagged as `runbook`

```js
<EntityListDocsGrid groups={{[
  {
    title: "Recommended Documentation",
    filterPredicate: entity =>
      entity?.metadata?.tags?.includes('recommended') ?? false,
  },
  {
    title: "RunBooks Documentation",
    filterPredicate: entity =>
      entity?.metadata?.tags?.includes('runbook') ?? false,
  }
]}} />
```
