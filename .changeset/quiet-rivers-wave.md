---
'@backstage/plugin-auth-backend': patch
---

Supports callbackUrls when setting cookie configuration.
Cookie paths will no longer be scoped to include the handler of the provider:

```diff
cookie = {
-  path=`${pathname}/${provider}/handler`
+  path=`${pathname}/${provider}`
}
```
