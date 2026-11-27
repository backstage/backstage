---
'@backstage/plugin-techdocs-node': patch
---

The local publisher now removes files left over from a previous build when publishing a site, matching the behavior of the cloud storage publishers. Pages that were removed from the documentation are no longer served.
