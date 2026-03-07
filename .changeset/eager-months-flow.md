---
'@backstage/backend-defaults': patch
---

Updated `AzureBlobStorageUrlReader` to use the `AzureCredentialsManager` for authentication, simplifying the implementation by delegating credential and service URL handling to the credentials manager.
