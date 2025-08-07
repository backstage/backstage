# Blueprints with type parameters

## Why?

```ts
ApiBlueprint.make({
  name: 'storage',
  params: {
    factory: createApiFactory({
      api: storageApiRef,
      deps: { errorApi: errorApiRef },
      factory: ({ errorApi }) => WebStorage.create({ errorApi }),
    }),
  },
}),
```

vs

```ts
ApiBlueprint.make({
  name: 'storage',
  params: {
    factory: {
      api: storageApiRef,
      deps: { errorApi: errorApiRef },
      factory: ({ errorApi }) => WebStorage.create({ errorApi }),
    },
  },
}),
```

Spot the error

This is what TypeScript says:

```
      factory: ({ errorApi }) => WebStorage.create({ errorApi }),
                                                     ^
Type 'unknown' is not assignable to type 'ErrorApi'.ts(2322)
WebStorage.ts(41, 5): The expected type comes from property 'errorApi' which is declared here on type '{ errorApi: ErrorApi; namespace?: string | undefined; }'
```

Another example:

```ts
ApiBlueprint.make({
  name: 'alert',
  params: {
    factory: {
      api: alertApiRef,
      deps: {},
      factory: () => ({not: {really: {an: {alert: {api: {at: 'all'}}}}}}),
    },
  },
}),
```

This does not produce an error at all.

## Solutions?

### Force these creator functions under Blueprint params

This would mean that we make very little changes from today, it's just that you wouldn't be able to create blueprints without having also to use these creator functions like `createApiFactory` and `createFormField`.

A good solution of this kind will make sure that if you forget `createApiFactory`, you get a clear error message indicating that it needs to be used.

```ts
type AnyDerp = Expand<{
  $$type: '@backstage/Derp';
  $$instruction: 'Use createDerp to create instances of this type';
}>;

const DerpBlueprint = createExtensionBlueprint({
  kind: 'derp',
  attachTo: { id: 'root', input: 'apis' },
  output: [coreExtensionData.routePath],
  *factory(params: { /** Created with `createDerp` */ derp: AnyDerp }) {
    yield coreExtensionData.routePath('/derp');
  },
});

DerpBlueprint.make({
  params: {
    derp: {
      // Object literal may only specify known properties, and 'x' does not exist in type
      // '{ $$type: "@backstage/Derp"; $$instruction: "Use createDerp to create instances of this type"; }'.
      x: 1,
      y: 2,
    },
  },
});
```

#### Pros

- Not a breaking change
- Not changes needed to the Blueprints API

#### Cons

- Unfortuante that we can't solve this directly with blueprints as they're already really powerful, just missing this feature.
- More API surface to manage and maintain.
- Requires an extra import

### Add support for type parameters built into blueprints in some form

This aims to remove the need for the `createApiFactory`, and instead move type inference to the blueprint itself.

```ts
export const ApiBlueprint = createExtensionBlueprint({
  kind: 'api',
  attachTo: { id: 'root', input: 'apis' },
  output: [factoryDataRef],
  refineParams: <T>(params: { x: T }) => createBlueprintParams(params),
  *factory<T extends number>(params: { x: T }) {
    yield factoryDataRef(params.factory);
  },
});

ApiBlueprint.make({
  name: 'alert',
  params: ApiBlueprint.params({
    api: alertApiRef,
    deps: {},
    factory: () => ({
      not: { really: { an: { alert: { api: { at: 'all' } } } } },
    }),
  }),
});

ApiBlueprint.make({
  name: 'alert',
  params: define =>
    define({
      api: alertApiRef,
      deps: {},
      factory: () => ({
        not: { really: { an: { alert: { api: { at: 'all' } } } } },
      }),
    }),
});

createApiFactory({
  api: storageApiRef,
  deps: { errorApi: errorApiRef },
  factory: ({ errorApi }) => WebStorage.create({ errorApi }),
});

ApiBlueprint.makeWithOverrides({
  name: 'alert',
  factory(originalFactory) {
    return originalFactory(
      ApiBlueprint.params({
        api: alertApiRef,
        deps: {},
        factory: () => ({
          not: { really: { an: { alert: { api: { at: 'all' } } } } },
        }),
      }),
    );
  },
});

ApiBlueprint.make({
  name: 'alert',
  params: {
    api: alertApiRef,
    deps: {},
    factory: () => ({
      not: { really: { an: { alert: { api: { at: 'all' } } } } },
    }),
  },
  // Error: bla bla is not assignable to
});
```

#### Pros

- No need for extra imports
- No need for extra API surface to manage and maintain.
- Easy to discover when using the blueprint

#### Cons

- Breaking change
