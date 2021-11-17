---
'@backstage/core-app-api': patch
'@backstage/test-utils': patch
---

The `ApiRegistry` from `@backstage/core-app-api` class has been deprecated and will be removed in a future release. To replace it, we have introduced two new helpers that are exported from `@backstage/test-utils`, namely `TestApiProvider` and `TestApiRegistry`.

These two new helpers are more tailored for writing tests and development setups, as they allow for partial implementations of each of the APIs.

When migrating existing code it is typically best to prefer usage of `TestApiProvider` when possible, so for example the following code:

```tsx
render(
  <ApiProvider
    apis={ApiRegistry.from([
      [identityApiRef, mockIdentityApi as unknown as IdentityApi]
    ])}
  >
    {...}
  </ApiProvider>
)
```

Would be migrated to this:

```tsx
render(
  <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
    {...}
  </TestApiProvider>
)
```

In cases where the `ApiProvider` is used in a more standalone way, for example to reuse a set of APIs across multiple tests, the `TestApiRegistry` can be used instead. Note that the `TestApiRegistry` only has a single static factory method, `.with()`, and it is slightly different from the existing `.with()` method on `ApiRegistry`.

Usage that looks like this:

```ts
const apis = ApiRegistry.with(
  identityApiRef,
  mockIdentityApi as unknown as IdentityApi,
).with(configApiRef, new ConfigReader({}));
```

OR like this:

```ts
const apis = ApiRegistry.from([
  [identityApiRef, mockIdentityApi as unknown as IdentityApi],
  [configApiRef, new ConfigReader({})],
]);
```

Would be migrated to this:

```ts
const apis = TestApiRegistry.with(
  [identityApiRef, mockIdentityApi],
  [configApiRef, new ConfigReader({})],
);
```

If your app is still using the `ApiRegistry` to construct the `apis` for `createApp`, we recommend that you move over to use the new method of supplying API factories instead, using `createApiFactory`.
