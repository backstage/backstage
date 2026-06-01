---
'@backstage/integration': patch
---

Added the correctly-spelled `AzureBlobStorageIntegration` class export and deprecated the previous typoed `AzureBlobStorageIntergation` export. Existing usage of `AzureBlobStorageIntergation` continues to work; switch to `AzureBlobStorageIntegration` to avoid future removal.
