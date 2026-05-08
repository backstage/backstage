---
'@backstage/plugin-catalog-backend-module-github': minor
'@backstage/plugin-catalog-backend-module-github-org': minor
---

**BREAKING**: Suspended users are now excluded during ingestion by default. User suspended state is now checked using the REST API, which avoids the need for the `site_admin` scope. Both account-level suspension and org-membership suspension are detected. This replaces the previous `excludeSuspendedUsers` option (which defaulted to off) with `dangerouslySkipSuspendedUserCheck` (which defaults to off, meaning the check runs by default). Set `dangerouslySkipSuspendedUserCheck: true` to disable the check if needed.
