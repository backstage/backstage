---
'@backstage/plugin-techdocs': minor
---

Make `TechDocsClient` and `TechDocsStorageClient` use the `FetchApi`. You now
need to pass in an instance of that API when constructing the client, if you
create a custom instance in your app.

If you are replacing the factory:

```diff
+import { fetchApiRef } from '@backstage/core-plugin-api';

 createApiFactory({
   api: techdocsStorageApiRef,
   deps: {
     configApi: configApiRef,
     discoveryApi: discoveryApiRef,
     identityApi: identityApiRef,
+    fetchApi: fetchApiRef,
   },
   factory: ({
     configApi,
     discoveryApi,
     identityApi,
+    fetchApi,
   }) =>
     new TechDocsStorageClient({
       configApi,
       discoveryApi,
       identityApi,
+      fetchApi,
     }),
 }),
 createApiFactory({
   api: techdocsApiRef,
   deps: {
     configApi: configApiRef,
     discoveryApi: discoveryApiRef,
-    identityApi: identityApiRef,
+    fetchApi: fetchApiRef,
   },
   factory: ({
     configApi,
     discoveryApi,
-    identityApi,
+    fetchApi,
   }) =>
     new TechDocsClient({
       configApi,
       discoveryApi,
-      identityApi,
+      fetchApi,
     }),
 }),
```

If instantiating directly:

```diff
+import { fetchApiRef } from '@backstage/core-plugin-api';

+const fetchApi = useApi(fetchApiRef);
 const storageClient = new TechDocsStorageClient({
   configApi,
   discoveryApi,
   identityApi,
+  fetchApi,
 });
 const techdocsClient = new TechDocsClient({
   configApi,
   discoveryApi,
-  identityApi,
+  fetchApi,
 }),
```
