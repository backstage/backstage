---
'@backstage/plugin-auth-backend-module-aws-alb-provider': minor
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The AWS ALB `fullProfile` will no longer have the its username or email converted to lowercase. This is to ensure unique handling of the users. You may need to update and configure a custom sign-in resolver or profile transform as a result.
