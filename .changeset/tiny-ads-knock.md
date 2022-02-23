---
'@backstage/catalog-client': patch
---

Added `CatalogApi.getEntityFacets`. Marking this as a breaking change since it
is a non-optional addition to the API and depends on the backend being in place.
If you are mocking this interface in your tests, you will need to add an extra
`getEntityFacets: jest.fn()` or similar to that interface.
