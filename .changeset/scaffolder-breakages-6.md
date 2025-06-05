---
'@backstage/plugin-scaffolder-backend': major
---

**BREAKING CHANGES**

- The `createBuiltinActions` method has been removed, as this should no longer be needed with the new backend system route, and was only useful when passing the default list of actions again in the old backend system. You should be able to rely on the default behaviour of the new backend system which is to merge the actions.

- The `createCatalogRegisterAction` and `createFetchCatalogEntityAction` actions no longer require an `AuthService`, and now accepts a `CatalogService` instead of `CatalogClient`.

Unless you're providing your own override action to the default, this should be a non-breaking change.

You can migrate using the following if you're getting typescript errors:

```ts
export const myModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'test',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        catalogService: catalogServiceRef,
      },
      async init({ scaffolder, catalogService }) {
        scaffolder.addActions(
          createCatalogRegisterAction({
            catalogService,
          }),
          createFetchCatalogEntityAction({
            catalogService,
            integrations,
          }),
        );
      },
    });
  },
});
```
