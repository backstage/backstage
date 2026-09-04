# @backstage/connections-node

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.1-next.0

## 0.2.2

### Patch Changes

- a4b6efa: Added a new `aws` connection type for AWS account credentials, looked up by AWS account number or ARN rather than by URL. A single `account` auth method covers all accounts: one entry per account with static keys, a profile, or IAM role assumption, and at most one entry marked `mainAccount: true` that acts as the fallback for the environment's own account. A connection-level `roleName` (with optional `partition`, `region`, `externalId`, and `webIdentityTokenFile`) describes a role to assume in any account that has no entry of its own. Configurations with duplicate account IDs or multiple main account entries are rejected at startup, and legacy top-level `aws` configuration is converted automatically, with explicit `connections` config taking precedence.

  Connection types can now declare a whole-connection validation step that runs after the configuration schemas have parsed, enabling rules that span multiple auth entries or combine connection settings with auth entries. Each auth entry includes its plugin `match`, allowing rules to take plugin scoping into account. Connection types also expose a type-level `auth` accessor describing the shape of their configured auth entries, mirroring the existing `query` accessor.

- Updated dependencies
  - @backstage/connections@0.3.0
  - @backstage/backend-plugin-api@1.10.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/connections@0.3.0-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
