---
'@backstage/plugin-scaffolder': minor
---

Make `ScaffolderClient` use the `FetchApi`. You now need to pass in an instance
of that API when constructing the client, if you create a custom instance in
your app.

If you are replacing the factory:

```diff
+import { fetchApiRef } from '@backstage/core-plugin-api';

 createApiFactory({
   api: scaffolderApiRef,
   deps: {
     discoveryApi: discoveryApiRef,
     scmIntegrationsApi: scmIntegrationsApiRef,
-    identityApi: identityApiRef,
+    fetchApi: fetchApiRef,
   },
   factory: ({
     discoveryApi,
     scmIntegrationsApi,
-    identityApi,
+    fetchApi,
   }) =>
     new ScaffolderClient({
       discoveryApi,
       scmIntegrationsApi,
-      identityApi,
+      fetchApi,
     }),
 }),
```

If instantiating directly:

```diff
+import { fetchApiRef } from '@backstage/core-plugin-api';

+const fetchApi = useApi(fetchApiRef);
 const client = new ScaffolderClient({
   discoveryApi,
   scmIntegrationsApi,
-  identityApi,
+  fetchApi,
 }),
```
