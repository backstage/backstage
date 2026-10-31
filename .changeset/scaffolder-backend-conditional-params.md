---
'@backstage/plugin-scaffolder-backend': minor
---

Added support for `when` conditions on parameter steps. Steps whose condition evaluates to false are skipped during validation, and their values are removed before the task runs. Also updated Nunjitsu to 0.7.0, with no change to existing templating behavior.
