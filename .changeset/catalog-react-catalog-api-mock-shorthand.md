---
'@backstage/plugin-catalog-react': patch
---

The `catalogApiMock` test utility now returns a `MockWithApiFactory`, allowing it to be passed directly to test utilities like `renderTestApp` and `TestApiProvider` without needing the `[catalogApiRef, catalogApiMock()]` tuple.
