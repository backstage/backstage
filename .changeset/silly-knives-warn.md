---
'@backstage/plugin-techdocs-node': patch
---

Add support for specifying an S3 bucket's account ID and retrieving the credentials from the `aws` app config section. This is now the preferred way to configure AWS credentials for Techdocs.
