---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: `renderInTestApp`, `renderTestApp` and `createExtensionTester` now throw for every error reported while creating the test app or extension tree, including the ones a real app only logs as warnings, such as `EXTENSION_IGNORED`. Previously `renderInTestApp` and `renderTestApp` ignored these errors, so a test could pass for an app that is broken. All three helpers accept a new `isExpectedError` option to allow specific errors.

**Migration:** fix the reported error in the test setup. The error message names the code to allow if the error is expected:

```ts
renderInTestApp(<MyComponent />, {
  isExpectedError: error =>
    error.code === 'EXTENSION_INPUT_DATA_IGNORED' &&
    error.context.node.spec.id === 'page:my-plugin',
});
```

A common one is `API_FACTORY_CONFLICT` from providing an API that another plugin owns, such as a `core.*` API passed in `extensions`. That override was always rejected, so remove it, or use the `apis` option to replace an API in a test.
