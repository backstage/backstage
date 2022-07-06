---
'@backstage/plugin-catalog-backend': minor
---

Added an option to be able to trigger refreshes on entities based on a prestored arbitrary key.

The UrlReaderProcessor, FileReaderProcessor got updated to store the absolute url of the catalog file as a refresh key. In the format of `<type>:<target>`
The PlaceholderProcessor got updated to store the resolverValues as refreshKeys for the entities.
