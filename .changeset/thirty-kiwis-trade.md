---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
'@backstage/plugin-org': patch
---

Added `EntityInfoCard` component to `@backstage/plugin-catalog-react` as a BUI-based card wrapper for entity page cards. Migrated `EntityAboutCard`, `EntityLinksCard`, `EntityLabelsCard`, `GroupProfileCard`, and `UserProfileCard` from MUI/InfoCard to use the new BUI card layout.

**Affected components:** EntityInfoCard, EntityAboutCard, EntityLinksCard, EntityLabelsCard, GroupProfileCard, UserProfileCard
