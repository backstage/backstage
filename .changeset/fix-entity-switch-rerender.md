---
'@backstage/plugin-catalog': patch
---

Fixed an issue in `<EntitySwitch>` where evaluating async condition functions on every render created new Promise instances, causing potential infinite re-renders.
