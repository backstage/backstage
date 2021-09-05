---
'@backstage/plugin-catalog-import': minor
---

Switched to using the `ScmAuthApi` for authentication rather than GitHub auth. If you are instantiating your `CatalogImportClient` manually you now need to pass in an instance of `ScmAuthApi` instead. Also be sure to register the `scmAuthApiRef` from the `@backstage/integration-react` in your app.
