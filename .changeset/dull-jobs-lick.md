---
'@backstage/create-app': patch
---

Supply a `scmIntegrationsApiRef` from the new `@backstage/integration-react`.

This is a new facility that plugins will start to use. You will have to add it to your local `packages/app` as described below. If this is not done, runtime errors will be seen in the frontend, on the form `No API factory available for dependency apiRef{integration.scmintegrations}`.

In `packages/app/package.json`:

```diff
   "dependencies": {
+    "@backstage/integration-react": "^0.1.1",
```

In `packages/app/src/apis.ts`:

```diff
+import {
+  scmIntegrationsApiRef,
+  ScmIntegrationsApi,
+} from '@backstage/integration-react';

 export const apis: AnyApiFactory[] = [
+  createApiFactory({
+    api: scmIntegrationsApiRef,
+    deps: { configApi: configApiRef },
+    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
+  }),
```
