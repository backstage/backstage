---
'@backstage/plugin-stack-overflow-backend': patch
---

Deprecate package in favor of the new `@backstage/plugin-search-backend-module-stack-overflow-collator` module.

The search collator `requestParams` option is optional now, so its default value is `{ order: 'desc', sort: 'activity', site: 'stackoverflow' }` as defined in the `Try It` section on the [official Stack Overflow API documentation](https://api.stackexchange.com/docs/questions).
