---
'@backstage/cli': patch
---

Fixes an issue where using the `backstage-cli new --scope` command with a scope that already includes the `@` symbol (e.g., `@backstage-community`) would result in a double `@@` prefix in the generated package name, causing invalid `package.json` files.
