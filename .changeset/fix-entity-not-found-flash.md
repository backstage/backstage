---
'@backstage/plugin-catalog': patch
---

Fixed a brief flash of the "Entity not found" warning when navigating between entity pages. When the URL changes to a different entity, there is a short window where the new route params have taken effect but the old entity data is still loaded. The entity page now reports a loading state during this window instead of an empty not-found state.
