---
'@backstage/ui': minor
---

**BREAKING**: Data attributes rendered by components are now always lowercase. This affects CSS selectors targeting camelCase data attributes.

**Migration:**

Update any custom CSS selectors that target camelCase data attributes to use lowercase instead:

```diff
- [data-startCollapsed='true'] { ... }
+ [data-startcollapsed='true'] { ... }
```

**Affected components:** SearchField
