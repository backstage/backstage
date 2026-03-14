---
'@backstage/plugin-scaffolder-backend': patch
---

Added support for conditional `if` filtering on output `links` and `text` items. Items where the `if` condition evaluates to false are now excluded from the task output.
