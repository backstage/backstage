---
'@backstage/plugin-techdocs-node': patch
---

There was an issue in the uploading of large size files to the AWS S3. We have modified the logic by adding retry along with multipart uploading functionality.
