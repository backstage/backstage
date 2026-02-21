---
'@backstage/plugin-catalog-backend-module-azure': patch
---

Updated `AzureBlobStorageEntityProvider` to use the `AzureCredentialsManager` for authentication, simplifying the implementation by delegating credential and service URL handling to the credentials manager.
