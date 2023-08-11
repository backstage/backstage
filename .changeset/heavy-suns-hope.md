---
'@backstage/backend-common': patch
---

To improve performance, `GerritUrlReader.readTree()` now uses Gitiles to fetch an archive instead of cloning the repository.
If `gitilesBaseUrl` is not configured, `readTree` still uses Git to clone the repository.

Added `stripFirstDirectory` option to `ReadTreeResponseFactory.fromTarArchive()`, allowing to disable stripping first directory
for `tar` archives.
