---
'@backstage/repo-tools': patch
---

The peer dependency check no longer enforces a shared `react-router-dom` version, so packages can declare their own supported major version. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for background on the routing changes this supports.
