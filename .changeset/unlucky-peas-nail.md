---
'@backstage/plugin-scaffolder-backend': patch
---

Keep the empty string as empty string in `input` rather than replacing with `undefined` to make empty values ok for `cookiecutter`
