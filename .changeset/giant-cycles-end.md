---
'@backstage/plugin-stack-overflow-backend': patch
---

Migrate package to the new Frontend system, the new module is distributed with a `/alpha` subpath.

The search collator `requestParams` option is optional now, so its defaults to `{ order: 'desc', sort: 'activity', site: 'stackoverflow' }` as done in the `Try It` section on the [official Stack Overflow API documentation](https://api.stackexchange.com/docs/questions).
