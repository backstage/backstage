---
'@backstage/cli-module-build': patch
---

Increase generated frontend static asset filename hashes to 12 characters to reduce the chance of collisions across long-lived cached builds.
