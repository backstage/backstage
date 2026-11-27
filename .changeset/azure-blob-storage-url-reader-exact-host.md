---
'@backstage/backend-defaults': patch
---

Azure Blob Storage URLs are now matched against integrations by exact account host, so an integration no longer claims URLs of a storage account whose name merely ends with the configured account name.
