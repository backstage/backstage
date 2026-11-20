---
'@backstage/plugin-scaffolder-react': patch
---

Fixed custom field validation for array fields with object items, where validators received the whole array instead of the individual item's field value.
