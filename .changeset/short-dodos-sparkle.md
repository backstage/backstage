---
'@backstage/plugin-catalog-backend-module-aws': patch
---

Fix S3 object URL creation at AwsS3EntityProvider by

- handle absence of region config,
- handle regions with region-less URIs (us-east-1),
- apply URI encoding,
- and simplify the logic overall.
