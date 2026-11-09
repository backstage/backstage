---
'@backstage/backend-test-utils': minor
---

The `mockServices` export is now a frozen plain object instead of a TypeScript namespace, and its type is described by the new `MockServices` interface. Usage is unchanged: you can still call each mock service directly, use its `factory` and `mock` helpers, and refer to types such as `mockServices.rootConfig.Options`.

Both `mockServices` and each of its services are frozen, so they can no longer be modified at runtime, for example with `jest.spyOn(mockServices.urlReader, 'mock')`. The mocks and factories they create are not affected.
