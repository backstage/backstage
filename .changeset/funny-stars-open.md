---
'@backstage/cli': patch
---

Fix inconsistent behavior in the `new` command for the `@internal` scope: it now consistently defaults to the `backstage-plugin-` infix whether the `--scope` option is not set or it's set to `internal`.
