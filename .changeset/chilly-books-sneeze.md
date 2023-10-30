---
'@backstage/cli-node': minor
'@backstage/cli': minor
---

Removed support for the `publishConfig.alphaTypes` and `.betaTypes` fields that were used together with `--experimental-type-build` to generate `/alpha` and `/beta` entry points. Use the `exports` field to achieve this instead.
