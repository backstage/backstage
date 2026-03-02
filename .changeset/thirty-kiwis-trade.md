---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
'@backstage/plugin-org': patch
---

Added `EntityInfoCard` component to `@backstage/plugin-catalog-react` as a BUI-based card wrapper for entity page cards. Migrated `EntityAboutCard`, `EntityLinksCard`, `EntityLabelsCard`, `GroupProfileCard`, and `UserProfileCard` from MUI/InfoCard to use the new BUI card layout. Replaced MUI ImageList and Grid internals in LinksGridList and AboutContent with BUI Grid. Migrated EntityLabelsCard from core-components Table to BUI Table. Updated GroupProfileCard and UserProfileCard to use BUI Avatar in card titles.
