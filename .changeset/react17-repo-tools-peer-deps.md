---
'@backstage/repo-tools': patch
---

The peer dependency checks now expect React 18 for frontend packages, following the removal of React 17 support across the workspace. The old frontend system core packages continue to allow React 17.
