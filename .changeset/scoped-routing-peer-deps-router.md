---
'@backstage/repo-tools': patch
---

The peer dependency check no longer enforces a shared `react-router-dom` version. Packages can declare their own supported major version without having it reported or rewritten.
