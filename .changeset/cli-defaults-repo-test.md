---
'@backstage/cli-defaults': minor
---

The default set of CLI modules now includes `@backstage/cli-module-test`, so `repo test` runs `package test` for each package instead of one combined Jest run. The previous behavior is available as `repo jest`.
