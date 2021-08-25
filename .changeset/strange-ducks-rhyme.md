---
'@backstage/create-app': minor
---

Updated the default create-app `EntityPage` to include orphan and processing error alerts for all entity types. Previously these were only shown for entities with the `Component` kind. The `EntityPage` in Backstage applications should be updated following [d027681](https://github.com/backstage/backstage/pull/6899/commits/d0276817123ba131c9211de30d229839f13d7775). This also adds the `EntityLinkCard` for API entities.
