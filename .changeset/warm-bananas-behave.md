---
'@backstage/cli': patch
---

The `--since` flag of repo commands now silently falls back to using the provided `ref` directly if no merge base is available.
