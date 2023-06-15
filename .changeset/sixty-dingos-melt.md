---
'@backstage/plugin-scaffolder': minor
---

Fixed bug in OwnedEntityPicker where catalog filter was not correctly populated for EntityPicker to use in filtering the content, it was passed as a property on UI element and not as property of 'ui:options'
