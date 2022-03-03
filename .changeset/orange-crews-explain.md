---
'@backstage/cli': minor
---

**BREAKING**: Removed the deprecated `app.<key>` template variables from the `index.html` templating. These should be replaced by using `config.getString("app.<key>")` instead.
