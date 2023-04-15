---
'@backstage/plugin-catalog-react': minor
---

Added an `EntityPresentationApi` and associated `entityPresentationApiRef`. This
API lets you control how references to entities (e.g. in links, headings,
iconography etc) are represented in the user interface.

Usage of this API is initially added to the `EntityRefLink` and `EntityRefLinks`
components, so that they can render richer, more correct representation of
entity refs. There's also a new `EntityName` component, which works just like
the `EntityRefLink` but without the link.

Along with that change, the `fetchEntities` and `getTitle` props of
`EntityRefLinksProps` are deprecated and no longer used, since the same need
instead is fulfilled (and by default always enabled) by the
`entityPresentationApiRef`.
