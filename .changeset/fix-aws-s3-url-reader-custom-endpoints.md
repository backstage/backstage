---
'@backstage/backend-defaults': patch
---

Fixed `AwsS3UrlReader` failing to read files from S3 buckets configured with custom endpoint hosts. When an integration was configured with a specific endpoint like `https://bucket-1.s3.eu-central-1.amazonaws.com`, the URL parser incorrectly fell through to the non-AWS code path, always defaulting the region to `us-east-1` instead of extracting it from the hostname.
