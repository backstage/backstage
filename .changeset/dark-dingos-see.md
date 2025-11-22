---
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': minor
'@backstage/plugin-bitbucket-cloud-common': patch
'@backstage/integration': minor
'@backstage/backend-defaults': patch
---

Added support for Bitbucket Cloud OAuth. This introduces an alternative authentication method using a workspace OAuth consumer, alongside App Passwords (deprecated) and API tokens. OAuth does not require a bot or service account and avoids token expiry issues.

**BREAKING CHANGES**

- **@backstage/integration** (`src/bitbucketCloud/core.ts`)

  - `getBitbucketCloudRequestOptions` now returns a `Promise` and **must** be awaited.

- **@backstage/plugin-scaffolder-backend-module-bitbucket-cloud** (`src/actions/helpers.ts`)
  - `getBitbucketClient` now returns a `Promise` and **must** be awaited.
  - `getAuthorizationHeader` now returns a `Promise` and **must** be awaited.

**OAuth usage example**

```yaml
integrations:
  bitbucketCloud:
    - clientId: client-id
      clientSecret: client-secret
```
