---
'@backstage/frontend-test-utils': patch
---

Added support for API overrides in `createExtensionTester` and `renderInTestApp`. You can now pass an `apis` option to override specific APIs when testing extensions:

```typescript
// Override APIs in createExtensionTester
const tester = createExtensionTester(myExtension, {
  apis: [
    [errorApiRef, mockErrorApi],
    [analyticsApiRef, mockAnalyticsApi],
  ],
});

// Override APIs in renderInTestApp
renderInTestApp(<MyComponent />, {
  apis: [[errorApiRef, mockErrorApi]],
});
```

The package now also exports its own implementations of `TestApiProvider`, `TestApiRegistry`, and related types, rather than re-exporting them from `@backstage/test-utils`. This consolidates common types used internally by the test utilities.
