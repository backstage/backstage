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
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gitlab
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

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams # Required for gitlab.com when `orgEnabled: true`. Optional for self managed. Must not end with slash. Accepts only groups under the provided path (which will be stripped)
        groupPattern: '[\s\S]*' # Optional. Filters found groups based on provided pattern. Defaults to `[\s\S]*`, which means to not filter anything
        groupListApiParameters: # Optional. Pass parameters to the listGroups api call used to get the list of available groups
          all_available: true # Optional. Show all the groups you have access to (defaults to false for authenticated users, true for administrators)
          search: '' # Optional. Return the list of authorized groups matching the search criteria
          owned: true # Optional. Limit to groups explicitly owned by the current user.
          min_access_level: 10 # Optional. Limit to groups where current user has at least this role.
          top_level_only: false # Optional. Limit to top level groups, excluding all subgroups
```

### Groups

When the `group` parameter is provided, the corresponding path prefix will be
stripped out from each matching group when computing the unique entity name.
e.g. If `group` is `org/teams`, the name for `org/teams/avengers/gotg` will be
`avengers-gotg`.

For gitlab.com, when `orgEnabled: true`, the `group` parameter is required in
order to limit the ingestion to a group within your organisation. `Group`
entities will only be ingested for the configured group, or its descendant groups,
but not any ancestor groups higher than the configured group path. Only groups
which contain members will be ingested.

By default, the GitLab API only displays the groups that you are a member of. However, this behavior can be changed through the use of the `all_available` query option. By default, `all_available` is set to false for authenticated users and true for administrators. Additionally, the groupListApiOptions can be utilized to configure the API's behavior to show more groups. By setting the `all_available` option to true, the API will return all groups that you have access to, including public and internal groups, regardless of whether or not you are a member of them.

### Users

For self hosted, all `User` entities are ingested from the entire instance.

For gitlab.com `User` entities for users who have [direct or inherited membership](https://docs.gitlab.com/ee/user/project/members/index.html#membership-types)
of the top-level group for the configured group path will be ingested.

### Limiting `User` and `Group` entity ingestion in the provider

Optionally, you can limit the entity types ingested by the provider when using
`orgEnabled: true` with the following `rules` configuration to limit it to only
`User` and `Group` entities.

```yaml
catalog:
  providers:
    gitlab:
      yourOrgDataProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams
        rules:
          - allow: [Group, User]
```

## Troubleshooting

**NOTE**: If any groups that are being ingested are empty groups (i.e. do not
contain any projects) and the user which provisioned the token is shared with a
higher level group via [group sharing](https://docs.gitlab.com/ee/user/group/manage.html#share-a-group-with-another-group)
and you don't see the expected number of `Group` entities in the catalog you may
be hitting this [Gitlab issue](https://gitlab.com/gitlab-org/gitlab/-/issues/267996).
