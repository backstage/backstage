---
'@backstage/frontend-plugin-api': minor
---

Added support for advanced parameter types in extension blueprints. The primary purpose of this is to allow extension authors to use type inference in the definition of the blueprint parameters. This often removes the need for extra imports and improves discoverability of blueprint parameters.

This feature is introduced through the new `defineParams` option of `createExtensionBlueprint`, along with accompanying `createExtensionBlueprintParams` function to help implement the new format.

The following is an example of how to create an extension blueprint that uses the new option:

```ts
const ExampleBlueprint = createExtensionBlueprint({
  kind: 'example',
  attachTo: { id: 'example', input: 'example' },
  output: [exampleComponentDataRef, exampleFetcherDataRef],
  defineParams<T>(params: {
    component(props: ExampleProps<T>): JSX.Element | null;
    fetcher(options: FetchOptions): Promise<FetchResult<T>>;
  }) {
    // The returned params must be wrapped with `createExtensionBlueprintParams`
    return createExtensionBlueprintParams(params);
  },
  *factory(params) {
    // These params are now inferred
    yield exampleComponentDataRef(params.component);
    yield exampleFetcherDataRef(params.fetcher);
  },
});
```

Usage of the above example looks as follows:

```ts
const example = ExampleBlueprint.make({
  params: defineParams => defineParams({
    component: ...,
    fetcher: ...,
  }),
});
```

This `defineParams => defineParams(<params>)` is also known as the "callback syntax" and is required if a blueprint is created with the new `defineParams` option. The callback syntax can also optionally be used for other blueprints too, which means that it is not a breaking change to remove the `defineParams` option, as long as the external parameter types remain compatible.
