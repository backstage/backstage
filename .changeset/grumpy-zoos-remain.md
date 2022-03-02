---
'@backstage/cli': minor
---

**BREAKING**: Removed support for the `app.` template prefix in `index.html`.

The general pattern for migrating existing usage is to replace `<%= app.<key> %>` with `<%= config.getString('app.<key>') %>`, although in some cases you may need to use for example `config.has('app.<key>')` or `config.getOptionalString('app.<key>')` instead.
