---
'@backstage/backend-defaults': patch
---

Updated `AzureBlobStorageUrlReader` to use `AzureBlobStorageCredentialProvider` for authentication, simplifying the implementation by delegating credential and service URL handling to the credentials provider.
