---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
'@backstage/backend-app-api': patch
---

**BREAKING**: Removed options from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

```ts
const backend = createBackend({ services: [myCustomServiceFactory] });
```

To instead pass the service factory via `backend.add(...)`:

```ts
const backend = createBackend();
backend.add(customRootLoggerServiceFactory);
```
