---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added support for event based updates in the `GithubOrgEntityProvider`!
Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
This includes adding new entities, refreshing existing ones, and removing obsolete ones.

Please find more information at
https://backstage.io/docs/integrations/github/org#installation-with-events-support
