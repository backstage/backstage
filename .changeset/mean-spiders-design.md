---
'@backstage/plugin-search-backend': major
---

Be less restrictive with unknown keys on query endpoint by adding .passthrough() method to parse the `requestSchema`

```diff
-      const parseResult = requestSchema.safeParse(req.query);
+      const parseResult = requestSchema.passthrough().safeParse(req.query);
```
