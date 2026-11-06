---
'@backstage/plugin-api-docs': patch
---

The Definition and APIs entity tabs in the new frontend system now stack their cards with Backstage UI instead of Material UI. The API explorer page in the new frontend system now wraps its content in the Backstage UI `Container`, so it lines up with the page header, and theme overrides targeting `BackstageContent` no longer apply to it.
