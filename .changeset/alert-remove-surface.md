---
'@backstage/ui': minor
---

**BREAKING**: Alert no longer accepts a `surface` prop

The Alert component's background is now driven entirely by its `status` prop. The `surface` prop has been removed.

```diff
- <Alert surface="1" status="info" />
+ <Alert status="info" />
```

**Affected components:** Alert
