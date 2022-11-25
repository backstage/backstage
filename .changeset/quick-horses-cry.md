---
'@backstage/plugin-org': patch
---

Update `UserProfileCard` and `GroupProfileCard` to not render links unless the `showLinks` prop is set. The primary component for rendering links are the `EntityLinksCard` from plugin-catalog.
