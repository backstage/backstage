---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': minor
---

Use `HumanDuration` for all duration needs in the public API, instead of `luxon` types. These are generally compatible, with a few caveats:

- If you scheduled things to run quarterly (`quarter` or `quarters`), you can use `{ months: 3 }` instead.
- If you used the singular nouns such as `year: 1`, use plurals instead (e.g. `years: 1`).
