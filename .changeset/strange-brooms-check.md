---
'@backstage/plugin-catalog-react': patch
---

Fixed an issue where the `EntityOwnerPicker` component failed to load when the `mode` prop was set to `owners-only`. In this mode, the `EntityOwnerPicker` does not load details about the owners, such as `displayName` or `title`. To display these details, use `mode=all` instead.
