---
id: org
title: GitLab Organizational Data
sidebar_label: Org Data
description: Importing users and groups from GitLab into Backstage
---

The Backstage catalog can be set up to ingest organizational data -- users and
groups -- directly from GitLab. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group)
entities that mirrors your org setup.

As this provider is not one of the default providers, you will first need to install the Gitlab provider plugin:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-gitlab
```

Then add the plugin to the plugin catalog `packages/backend/src/plugins/catalog.ts`:

```ts
/* packages/backend/src/plugins/catalog.ts */
/* highlight-add-next-line */
import { GitlabOrgDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
/* highlight-add-start */
builder.addEntityProvider(
  ...GitlabOrgDiscoveryEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
/* highlight-add-end */
```

## Configuration

To use the entity provider, you'll need a [Gitlab integration set up](https://backstage.io/docs/integrations/gitlab/locations).

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

This will query all users and groups from your GitLab instance. Depending on the
amount of data, this can take significant time and resources.

The token used must have the `read_api` scope, and the Users and Groups fetched
will be those visible to the account which provisioned the token.

**NOTE**: If any groups that are being ingested are empty groups and the user which provisioned the token is shared with a higher level group via [group sharing](https://docs.gitlab.com/ee/user/group/manage.html#share-a-group-with-another-group) and you don't see the expected number of `Group` entities in the catalog you may be hitting this [Gitlab issue](https://gitlab.com/gitlab-org/gitlab/-/issues/267996).

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams # Required for gitlab.com. Optional for self managed. Must not end with slash. Accepts only groups under the provided path (which will be stripped)
        groupPattern: '[\s\S]*' # Optional. Filters found groups based on provided pattern. Defaults to `[\s\S]*`, which means to not filter anything
```

When the `group` parameter is provided, the corresponding path prefix will be
stripped out from each matching group when computing the unique entity name.
e.g. If `group` is `org/teams`, the name for `org/teams/avengers/gotg` will be
`avengers-gotg`.
