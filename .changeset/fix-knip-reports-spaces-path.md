---
'@backstage/repo-tools': patch
---

Fixed knip-reports command failing when workspace path contains spaces and process termination issues by replacing `execFile` with `spawn` and removing `shell` option.
