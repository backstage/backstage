---
'@backstage/plugin-permission-backend': minor
---

Improved validation for the `/authorize` endpoint when a `resourceRef` is provided alongside a basic permission. Additionally, introduced a clearer error message for cases where users attempt to directly evaluate conditional permissions.
