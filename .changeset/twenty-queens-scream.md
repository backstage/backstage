---
'@backstage/plugin-scaffolder-backend': patch
---

Added support for templating secrets into actions input, and also added an extra `token` input argument to all publishers to provide a token that would override the `integrations.config`.
You can find more information over at [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#using-the-users-oauth-token)
