---
'@backstage/plugin-catalog-react': patch
---

Fixed `EntityOwnerPicker` throwing when the owner filter query parameter value
lacks a kind (e.g. `?filters[owners]=team-a`). The initial selected-owner state
is now normalized to a full entity ref, so the presentation API never receives a
kindless ref and the filter is applied correctly.
