---
'@backstage/plugin-scaffolder-backend': patch
---

Added support for conditional `if` filtering on output `links` and `text` items. Items with a falsy `if` condition are now excluded from the task output.
