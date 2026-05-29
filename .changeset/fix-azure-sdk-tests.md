---
'@backstage/backend-defaults': patch
'@backstage/integration': patch
---

Adapted Azure-related tests for the Azure SDK upgrade to ESM-style exports. The `AzureBlobStorageUrlReader` now accepts an optional `createContainerClient` dependency for testability without needing to mock the `@azure/storage-blob` module.
