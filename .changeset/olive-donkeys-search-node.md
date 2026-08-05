---
'@backstage/connections-node': patch
---

Added support for the new `aws` connection type. A single `aws` connection can be configured with one `account` auth entry per AWS account plus an optional `mainAccount: true` fallback entry, and lookups select the matching auth entry based on the requested AWS account number or ARN. Configurations with duplicate account IDs or multiple main account entries are rejected at startup.
