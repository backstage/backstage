---
'@backstage/plugin-catalog': minor
---

The entity page now follows renamed entities. When an entity page URL points at a name that no longer exists and exactly one entity lists that ref in its `backstage.io/former-names` annotation, the page redirects to the current entity, keeping the selected tab, query and anchor, and shows a dismissible notice that the entity was renamed. This works in both the old and the new frontend system, and needs a catalog backend that supports former names.
