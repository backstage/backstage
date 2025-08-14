---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The `ApiBlueprint` has been updated to use the new advanced type parameters through the new `defineParams` blueprint option. This is an immediate breaking change that requires all existing usages of `ApiBlueprint` to switch to the new callback format. Existing extensions created with the old format are still compatible with the latest version of the plugin API however, meaning that this does not break existing plugins.

To update existing usages of `ApiBlueprint`, you remove the outer level of the `params` object and replace `createApiFactory(...)` with `defineParams => defineParams(...)`.

For example, the following old usage:

```ts
ApiBlueprint.make({
  name: 'error',
  params: {
    factory: createApiFactory({
      api: errorApiRef,
      deps: { alertApi: alertApiRef },
      factory: ({ alertApi }) => {
        return ...;
      },
    })
  },
})
```

is migrated to the following:

```ts
ApiBlueprint.make({
  name: 'error',
  params: defineParams =>
    defineParams({
      api: errorApiRef,
      deps: { alertApi: alertApiRef },
      factory: ({ alertApi }) => {
        return ...;
      },
    }),
})
```
