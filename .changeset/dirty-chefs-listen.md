---
'@backstage/config-loader': minor
---

Loading invalid TypeScript configuration schemas will now throw an error rather than silently being ignored.

In particular this includes defining any additional types other than `Config` in the schema file, or use of unsupported types such as `Record` or `Partial`.
