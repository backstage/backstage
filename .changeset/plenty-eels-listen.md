---
'@backstage/plugin-catalog-react': minor
---

Attempt to load entity owner names in the EntityOwnerPicker through the `by-refs` endpoint. If `spec.profile.displayName` or `metadata.title` are populated, we now attempt to show those before showing the `humanizeEntityRef`'d version.
