---
'@backstage/core': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-explore': patch
---

Introduce `TabbedLayout` for creating tabs that are routed.

```typescript
<TabbedLayout>
  <TabbedLayout.Route path="/example" title="Example tab">
    <div>This is rendered under /example/anything-here route</div>
  </TabbedLayout.Route>
</TabbedLayout>
```
