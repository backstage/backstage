---
'@backstage/plugin-scaffolder': patch
---

Fixed 414 Request-URI Too Large error in EntityPicker and OwnedEntityPicker when users belong to many groups. The component now uses POST requests instead of GET to avoid URL length limits.
