---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs': patch
---

Google Cloud authentication in TechDocs has been improved.

1. `techdocs.publisher.googleGcs.credentials` is now optional. If it is missing, `GOOGLE_APPLICATION_CREDENTIALS`
   environment variable (and some other methods) will be used to authenticate.
   Read more here https://cloud.google.com/docs/authentication/production

2. `techdocs.publisher.googleGcs.projectId` is no longer used. You can remove it from your `app-config.yaml`.
