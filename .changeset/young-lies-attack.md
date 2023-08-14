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

In order to pass custom service factories use the `add` method:

```ts
const backend = createBackend();
backend.add(customRootLoggerServiceFactory);
```
