---
'@backstage/plugin-scaffolder-backend': patch
---

Software template inline conditionals without an `else` branch now render an empty string when their condition is false, matching Nunjucks behavior.
