---
'@backstage/plugin-catalog': major
'@backstage/plugin-org': minor
---

Migrated `EntityAboutCard`, `EntityLinksCard`, `EntityLabelsCard`, `GroupProfileCard`, and `UserProfileCard` from MUI/InfoCard to use the new BUI card layout and BUI components where possible.

**BREAKING**: Removed `variant` prop from EntityAboutCard, EntityUserProfileCard, EntityGroupProfileCard, EntityLabelsCard, EntityLinksCard. Removed `gridSizes` prop from `AboutField`.

**Migration:**

Simply delete the obsolete `variant` and `gridSizes` props, e.g:

```diff
-      <EntityAboutCard variant="gridItem" />
+      <EntityAboutCard />
```

```diff
-      <AboutField label="Owner" gridSizes={{ xs: 12, sm: 6, lg: 4 }} />
+      <AboutField label="Owner" />
```
