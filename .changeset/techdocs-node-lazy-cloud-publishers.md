---
'@backstage/plugin-techdocs-node': major
---

**BREAKING** Cloud storage SDKs (AWS S3, Google Cloud Storage, Azure Blob Storage, OpenStack Swift)
are no longer installed automatically with this package, to avoid installing unused dependencies.
If your `techdocs.publisher.type` is set to `googleGcs`, `awsS3`, `azureBlobStorage`, or
`openStackSwift`, you must now install the corresponding packages in your backend.

See [Using Cloud Storage for TechDocs generated files](https://backstage.io/docs/features/techdocs/using-cloud-storage)
for details.
