---
'@backstage/plugin-catalog-react': patch
---

Fixed a crash in `EntityOwnerPicker` (the default `mode="owners-only"`) when the `owners` query parameter contains a humanized or otherwise non-namespaced entity ref, for example `?filters[owners]=my-team` instead of `?filters[owners]=group:default/my-team`. This is a legitimate value for the `owners` filter -- `EntityOwnerFilter` itself defaults such refs to kind `Group` -- but on the initial render, before that normalization has run, the picker computed the selected-owner chip's label without supplying a default kind/namespace to the presentation API, which threw `Entity reference "..." had missing or empty kind` and crashed the whole page.
