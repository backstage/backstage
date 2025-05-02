---
'@backstage/plugin-bitbucket-cloud-common': minor
---

Update Bitbucket Cloud schema and models.

The latest schema was fetched from Bitbucket Cloud and stored locally.
Based on the updated schema, the models got regenerated.

**BREAKING:**

Due to the schema changes, the model update includes one breaking change:

- `Account.username` was removed.

Additionally, there were a couple of compatible changes including the addition of
`BaseCommit.committer` and others.
