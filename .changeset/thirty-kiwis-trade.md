---
'@backstage/plugin-catalog': major
'@backstage/plugin-org': major
---

Migrated `EntityAboutCard`, `EntityLinksCard`, `EntityLabelsCard`, `GroupProfileCard`, and `UserProfileCard` from MUI/InfoCard to use the new BUI card layout and BUI components where possible.

**BREAKING**: Removed `variant` prop from EntityAboutCard, EntityUserProfileCard, EntityGroupProfileCard, EntityLabelsCard, EntityLinksCard

**Migration:**

Simply delete the obsolete `variant` prop, e.g:

```diff
-      <EntityAboutCard variant="gridItem" />
+      <EntityAboutCard />
```
