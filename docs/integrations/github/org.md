---
id: org
title: GitHub Organizational Data
sidebar_label: Org Data
description: Importing users and groups from a GitHub organization into Backstage
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](https://github.com/backstage/backstage/blob/v1.37.0/docs/integrations/github/org--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Backstage catalog can be set up to ingest organizational data - users and
teams - directly from an organization in GitHub or GitHub Enterprise. The result
is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your org setup.

:::note Note

This adds `User` and `Group` entities to the catalog, but does not
provide authentication. See the
[GitHub auth provider](../../auth/github/provider.md) for that.

:::

## Permissions

Prior to installing the GitHub Org provider you should confirm you have the right permissions:

- Personal Access Token permissions are listed in the [GitHub Locations](./locations.md#token-scopes) documentation
- GitHub App(s) permissions are listed in the [GitHub Apps](./github-apps.md#app-permissions) documentation

## Installation

You will have to add the GitHub Org provider to your backend as it is not installed by default, therefore you have to add a
dependency on `@backstage/plugin-catalog-backend-module-github-org` to your backend
package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-github-org
```

Next add the basic configuration to `app-config.yaml`

```yaml title="app-config.yaml"
catalog:
  providers:
    githubOrg:
      id: production
      githubUrl: https://github.com
      orgs: ['organization-1', 'organization-2', 'organization-3']
      schedule:
        initialDelay: { seconds: 30 }
        frequency: { hours: 1 }
        timeout: { minutes: 50 }
```

Finally, update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
```

### Configuration Details

In the installation steps above we included an simple example of the needed configuration. The section goes into more details about the various configuration options.

```yaml title="app-config.yaml"
catalog:
  providers:
    githubOrg:
      - id: github
        githubUrl: https://github.com
        orgs: ['organization-1', 'organization-2', 'organization-3']
        schedule:
          initialDelay: { seconds: 30 }
          frequency: { hours: 1 }
          timeout: { minutes: 50 }
        pageSizes:
          teams: 25
          teamMembers: 50
          organizationMembers: 50
      - id: ghe
        githubUrl: https://ghe.mycompany.com
        orgs: ['internal-1', 'internal-2', 'internal-3']
        schedule:
          initialDelay: { seconds: 30 }
          frequency: { hours: 1 }
          timeout: { minutes: 50 }
        excludeSuspendedUsers: true
```

Directly under the `githubOrg` is a list of configurations, each entry is a structure with the following elements:

- `id`: A stable id for this provider. Entities from this provider will be associated with this ID, so you should take care not to change it over time since that may lead to orphaned entities and/or conflicts.
- `githubUrl`: The target that this provider should consume
- `orgs` (optional): The list of the GitHub orgs to consume. If you only list a single org the generated group entities will use the `default` namespace, otherwise they will use the org name as the namespace. By default the provider will consume all accessible orgs on the given GitHub instance (support for GitHub App integration only).
- `schedule`: The refresh schedule to use, matches the structure of [`SchedulerServiceTaskScheduleDefinitionConfig`](https://backstage.io/api/stable/interfaces/_backstage_backend-plugin-api.index.SchedulerServiceTaskScheduleDefinition.html)
- `pageSizes` (optional): Configure page sizes for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors. You can configure the following page sizes:

  - `teams`: Number of teams to fetch per page when querying organization teams (default: 25)
  - `teamMembers`: Number of team members to fetch per page when querying team members (default: 50)
  - `organizationMembers`: Number of organization members to fetch per page (default: 50)

  Reducing page sizes will result in more API calls and slightly longer sync times, but will prevent API resource limits for organizations with large number of teams and members.

- `excludeSuspendedUsers` (optional): Whether to exclude suspended users when querying organization users. Only for GitHub Enterprise instances. Will error if used against GitHub.com API.

### Events Support

The catalog module for GitHub Org comes with events support enabled.
This will make it subscribe to its relevant topics and expects these events to be published via the `EventsService`.

Topics:

- `github.installation`
- `github.membership`
- `github.organization`
- `github.team`

Additionally, you should install the
[event router by `events-backend-module-github`](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md)
which will route received events from the generic topic `github` to more specific ones
based on the event type (e.g., `github.membership`).

In order to receive Webhook events by GitHub, you have to decide how you want them
to be ingested into Backstage and published to its `EventsService`.
You can decide between the following options (extensible):

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)
- [via Google Pub/Sub](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-google-pubsub/README.md)
- [via a Kafka topic](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-kafka/README.md)

You can check the official docs to [configure your webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks) and to [secure your request](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks).
The webhook will need to be configured to forward `organization`,`team` and `membership` events.

## Custom Transformers

You can inject your own transformation logic to help map from GH API responses
into backstage entities. You can do this on the user and team requests to
enable you to do further processing or updates to the entities.

To enable this you pass a function into the `GitHubOrgEntityProvider`. You can
pass a `UserTransformer`, `TeamTransformer` or both. The function is invoked
for each item (user or team) that is returned from the API. You can either
return an Entity (User or Group) or `undefined` if you do not want to import
that item.

There is also a `defaultUserTransformer` and `defaultOrganizationTeamTransformer`.
You could use these and simply decorate the response from the default
transformation if you only need to change a few properties.

Here's an example of how to use the transformers:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';
import { myTeamTransformer, myUserTransformer } from './transformers';

const githubOrgModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-org-extensions',
  register(env) {
    env.registerInit({
      deps: {
        githubOrg: githubOrgEntityProviderTransformsExtensionPoint,
      },
      async init({ githubOrg }) {
        githubOrg.setTeamTransformer(myTeamTransformer);
        githubOrg.setUserTransformer(myUserTransformer);
      },
    });
  },
});

const backend = createBackend();

// Other items

backend.add(import('@backstage/plugin-catalog-backend'));

backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(githubOrgModule);

backend.start();
```

The `myTeamTransformer` and `myUserTransformer` transformer functions are from the examples in the section below.

### Transformer Examples

The following provides an example of each kind of transformer. We recommend creating a `transformers.ts` file in your `packages/backend/src` folder for these.

```ts title="packages/backend/src/transformers.ts"
import {
  TeamTransformer,
  UserTransformer,
  defaultUserTransformer,
} from '@backstage/plugin-catalog-backend-module-github';

// This team transformer completely replaces the built in logic with custom logic.
export const myTeamTransformer: TeamTransformer = async team => {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: team.slug,
      annotations: {},
    },
    spec: {
      type: 'GitHub Org Team',
      profile: {},
      children: [],
    },
  };
};

// This user transformer makes use of the built in logic, but also sets the description field
export const myUserTransformer: UserTransformer = async (user, ctx) => {
  const backstageUser = await defaultUserTransformer(user, ctx);
  if (backstageUser) {
    backstageUser.metadata.description = 'Loaded from GitHub Org Data';
  }
  return backstageUser;
};
```

### Resolving GitHub users via organization email

When you authenticate users you should resolve them to an entity within the
catalog. Often the authentication you use could be a corporate SSO system that
provides you with email as a key. To enable you to find and resolve GitHub users
it's useful to also import the private domain verified emails into the User
entity in backstage.

The integration attempts to return `organizationVerifiedDomainEmails` from the
GitHub API and makes this available as part of the object passed to
`UserTransformer`. The GitHub API will only return emails that use a domain
that's a verified domain for your GitHub Org. It also relies on the user having
configured such an email in their own account. The API will only return these
values when using GitHub App authentication and with the correct app permission
allowing access to emails.

You can decorate the default `userTransformer` to replace the org email in the
returned identity.

```ts title="packages/backend/src/transformers.ts"
export const myVerifiedUserTransformer: UserTransformer = async (user, ctx) => {
  const backstageUser = await defaultUserTransformer(user, ctx);
  if (backstageUser && user.organizationVerifiedDomainEmails?.length) {
    backstageUser.spec.profile!.email =
      user.organizationVerifiedDomainEmails[0];
  }
  return backstageUser;
};
```

This example assumes you have implemented the custom transformer following the [Custom Transformers](#custom-transformers) and [Transformer Examples](#transformer-examples) documentation in the sections above.

Once you have imported the emails you can resolve users by building a [Custom Resolver](../../auth/identity-resolver.md#building-custom-resolvers). In this custom resolver you can then use this example to properly match the user:

```ts
ctx.signInWithCatalogUser({
  filter: {
    kind: ['User'],
    'spec.profile.email': email as string,
  },
});
```
