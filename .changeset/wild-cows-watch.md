---
'@backstage/plugin-catalog': minor
---

Added the `DefaultEntityPresentationApi`, which is an implementation of the
`EntityPresentationApi` that `@backstage/plugin-catalog-react` exposes through
its `entityPresentationApiRef`. This implementation is also by default made
available automatically by the catalog plugin, unless you replace it with a
custom one. It batch fetches and caches data from the catalog as needed for
display, and is customizable by adopters to add their own rendering functions.
