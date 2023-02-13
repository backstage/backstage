---
'@backstage/core-components': minor
---

Updated Select core component to be more customizable and general so more re-use cases will appear

**BREAKING CHANGES**

- Property `placeholder` which was used as empty option label and placeholder for input
  will no longer used as empty option label. For this use-case `emptyItemLabel` is added.
- Wrapper `Box` with class `BackstageSelect-root` was removed,
  so now it's possible to have select input width dependent on content
- `native` option will change icon to default browser one
- empty value was changed from `[]` to `''`
