---
'@backstage/cli-module-build': patch
---

Fixed `backstage-cli package start` and `backstage-cli repo start` so the `--require` flag can be repeated again. `repo start` also forwards every `--require` from a backend package's `start` script, instead of only the last one.
