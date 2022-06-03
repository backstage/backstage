---
'@techdocs/cli': patch
'@backstage/plugin-techdocs-node': patch
---

Fix the flag parsing for `legacyCopyReadmeMdToIndexMd` in `techdocs-cli generate` command, and decouple it's logic from the `techdocs-ref` flag.
