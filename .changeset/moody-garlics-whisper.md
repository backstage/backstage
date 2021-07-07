---
'@backstage/plugin-scaffolder-backend': patch
---

Adding `config: Config` as a required argument to `createBuiltinActions` and downstream methods in order to support configuration of the default git author used for Scaffolder commits.

The affected methods are:

- `createBuiltinActions`
- `createPublishGithubAction`
- `createPublishGitlabAction`
- `createPublishBitbucketAction`
- `createPublishAzureAction`

Call sites to these methods will need to be migrated to include the new `config` argument. See `createRouter` in `plugins/scaffolder-backend/src/service/router.ts` for an example of adding this new argument.

To configure the default git author, use the `defaultAuthor` key under `scaffolder` in `app-config.yaml`:

```yaml
scaffolder:
  defaultAuthor:
    name: Example
    email: example@example.com
```
