---
'@backstage/create-app': minor
---

Updated the default create-app `EntityPage` to include orphan and processing error alerts for all entity types. Previously these were only shown for entities with the `Component` kind. The `EntityPage` in Backstage applications should be updated following [1d517af](https://github.com/backstage/backstage/commit/1d517af7ab1c84dc7d45f6a3a4747d1a44e3ab6c). This also adds the `EntityLinkCard` for API entities.
