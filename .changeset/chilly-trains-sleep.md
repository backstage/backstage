---
'@backstage/plugin-events-backend-module-aws-sqs': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/backend-common': patch
---

Setup user agent header for AWS sdk clients, this enables users to better track API calls made from Backstage to AWS APIs through things like CloudTrail.
