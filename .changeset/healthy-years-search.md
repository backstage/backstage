---
'@backstage/plugin-catalog-react': minor
---

Add catalog service mocks under the `/testUtils` subpath export.

You can now use e.g. `const catalog = catalogApiMock.mock()` in your test and then do assertions on `catalog.getEntities` without awkward type casting.
