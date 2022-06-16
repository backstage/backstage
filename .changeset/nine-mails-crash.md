---
'@backstage/backend-common': patch
---

The `ZipArchiveResponse` now correctly handles corrupt ZIP archives.

Before this change, certain corrupt ZIP archives either cause the inflater to throw (as expected), or will hang the parser indefinitely.

This change introduces a default timeout of 3000ms before throwing an error message when trying to unzip an archive.
