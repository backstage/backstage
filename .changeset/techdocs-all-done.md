---
'@backstage/plugin-techdocs': patch
---

This is the third and final step of migrating cloud storage entities to lowercase ([see](https://github.com/backstage/backstage/issues/4367#issuecomment-876461002)).

Updates GCS, AWS S3 and Azure Blob Storage Provider to lowercase entity triplet paths before reading and writing to it cloud storage.
