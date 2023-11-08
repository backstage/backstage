---
'@backstage/plugin-kubernetes-react': patch
---

Make sure types exported by other `kubernetes` plugins in the past are exported again after the creation
of the react package.

Some types have been moved to this new package but the export was missing, so they were not available anymore for developers.
