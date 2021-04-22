---
'@backstage/plugin-techdocs': patch
---

Make `techdocsStorageApiRef` and `techdocsApiRef` use interfaces instead of the
actual implementation classes.

This renames the classes `TechDocsApi` to `TechDocsClient` and `TechDocsStorageApi`
to `TechDocsStorageClient` and renames the interfaces `TechDocs` to `TechDocsApi`
and `TechDocsStorage` to `TechDocsStorageApi` to comply the pattern elsewhere in
the project. This also fixes the types returned by some methods on those
interfaces.
