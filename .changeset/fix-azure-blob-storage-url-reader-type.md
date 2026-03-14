---
'@backstage/backend-defaults': minor
---

**BREAKING**: `AzureBlobStorageUrlReader` now uses the correctly-named `AzureBlobStorageIntegration` type (previously `AzureBlobStorageIntergation`) following the rename in `@backstage/integration`. Update any direct usage of `AzureBlobStorageUrlReader` to pass an `AzureBlobStorageIntegration` instance.
