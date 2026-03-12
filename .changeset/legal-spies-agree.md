---
'@backstage/plugin-catalog-backend-module-azure': patch
---

Updated `AzureBlobStorageEntityProvider` to use `AzureBlobStorageCredentialProvider` for authentication, simplifying the implementation by delegating credential and service URL handling to the credentials provider.
