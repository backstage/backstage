---
'@backstage/create-app': patch
---

Add `PATCH` and `HEAD` to the `Access-Control-Allow-Methods`.

To apply this change to your Backstage installation make the following change to your `app-config.yaml`

```diff
   cors:
     origin: http://localhost:3000
-    methods: [GET, POST, PUT, DELETE]
+    methods: [GET, POST, PUT, DELETE, PATCH, HEAD]
```
