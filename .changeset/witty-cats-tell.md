---
'@backstage/plugin-scaffolder': patch
---

Add group filtering to the scaffolder page so that individuals can surface specific templates to end users ahead of others, or group templates together. This can be accomplished by passing in a `groups` prop to the `ScaffolderPage`

```
<ScaffolderPage
  groups={[
    {
      title: "Recommended",
      filter: entity =>
        entity?.metadata?.tags?.includes('recommended') ?? false,
    },
  ]}
/>
```
