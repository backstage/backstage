---
'@backstage/backend-test-utils': patch
---

Updated the type definition of `mockErrorHandler` to ensure that it is used correctly.

```ts
// This is wrong and will now result in a type error
app.use(mockErrorHandler);

// This is the correct usage
app.use(mockErrorHandler());
```
