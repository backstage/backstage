---
'@backstage/integration': patch
---

A new Gerrit helper function (`buildGerritGitilesArchiveUrlFromLocation`) has been added. This
constructs a Gitiles URL to download an archive. It is similar to the existing
`buildGerritGitilesArchiveUrl` but also support content referenced by a full commit `SHA`.

**DEPRECATIONS**: The function `buildGerritGitilesArchiveUrl` is deprecated, use the
`buildGerritGitilesArchiveUrlFromLocation` function instead.

**DEPRECATIONS**: The function `parseGerritGitilesUrl` is deprecated, use the
`parseGitilesUrlRef` function instead.
