---
'@backstage/backend-defaults': patch
---

Updated `AzureBlobStorageUrlReader` to reference the correctly-named `AzureBlobStorageIntegration` type from `@backstage/integration`. The previously-used `AzureBlobStorageIntergation` is now an alias for the new type and remains a valid argument to the constructor.
