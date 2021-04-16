---
'@backstage/create-app': patch
---

Fix system diagram card to be on the system page

To apply the same fix to an existing application, in `EntityPage.tsx` simply move the `<EntityLayout.route>` for the `/diagram` path from the `groupPage` down into the `systemPage` element.
