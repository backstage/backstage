---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
'@backstage/backend-app-api': patch
---

Removed options from `createBackend`.

The `createBackend` method doesn't accept any options anymore as in the following:

```ts
const backend = createBackend({ services: [myCustomServiceFactory] });
```

In order to pass custom service factories use the `add` method:

```ts
const backend = createBackend();
backend.add(customRootLoggerServiceFactory);
```
