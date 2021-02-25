---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-backend': patch
---

Move logic for generating URLs for the view, edit and source links of catalog
entities from the catalog frontend into the backend. This is done using the
existing support for the `backstage.io/view-url`, `backstage.io/edit-url` and
`backstage.io/source-location` annotations that are now filled by the
`AnnotateLocationEntityProcessor`. If these annotations are missing or empty,
the UI disables the related controls.
