---
'@backstage/plugin-scaffolder-backend': patch
---

Restore native boolean values for complete `if/else` templates with literal `true` and `false` branches. This prevents a rendered `false` from incorrectly running conditional steps, including when the value is passed through an action output. Interpolated strings and mixed templates keep their existing rendering behavior.
