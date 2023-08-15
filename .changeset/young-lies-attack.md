---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': minor
'@backstage/backend-defaults': minor
'@backstage/backend-app-api': minor
---

**BREAKING**: Removed the `services` option from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

```ts
const backend = createBackend({ services: [myCustomServiceFactory] });
```

To instead pass the service factory via `backend.add(...)`:

```ts
const backend = createBackend();
backend.add(customRootLoggerServiceFactory);
```
