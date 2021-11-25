---
'@backstage/plugin-scaffolder-backend': patch
---

Switched to executing scaffolder templating in a secure context for any template based on nunjucks, as it is [not secure by default](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
