---
'@backstage/plugin-scaffolder-backend': minor
---

Split `publish:bitbucket` into `publish:bitbucketCloud` and `publish:bitbucketServer`.

In order to migrate from the deprecated action, you need to replace the use of action
`publish:bitbucket` in your templates with the use of either `publish:bitbucketCloud`
or `publish:bitbucketServer` - depending on which destination SCM provider you use.

Additionally, these actions will not utilize `integrations.bitbucket` anymore,
but `integrations.bitbucketCloud` or `integrations.bitbucketServer` respectively.
You may or may not have migrated to these already.

As described in a previous changeset, using these two replacement integrations configs
will not compromise use cases which still rely on `integrations.bitbucket` as this was
set up in a backwards compatible way.

Additionally, please mind that the option `enableLFS` is only available (and always was)
for Bitbucket Server use cases and therefore, is not even part of the schema for
`publish:bitbucketCloud` anymore.
