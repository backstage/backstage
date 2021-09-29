---
'@backstage/cli': patch
---

Only serve static assets if there is a public folder during `app:serve` and `plugin:serve`. This fixes a common bug that would break `plugin:serve` with an `EBUSY` error.
