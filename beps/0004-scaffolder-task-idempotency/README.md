---
title: Scaffolder Retryable Tasks
status: provisional
authors:
  - 'bnechyporenko@bol.com'
  - 'benjaminl@spotify.com'
owners:
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2024-01-31
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->
<!-- Your short, descriptive title -->

# BEP: Scaffolder Retries and Idempotency

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/22590)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Scaffolder retryable task idempotency provides the means to make each action of the task idempotent. By default, an action is not considered to be idempotent.
It has to be crafted to a solution when action can be re-run multiple times and giving the same effect as it had been run only once.

## Motivation

The aim is to make the task engine more reliable in terms of system crash or redeployment. If the task engine is in process of executing
tasks and system stops, after restart task engine will restore all such tasks and continue their execution.  
Another purpose is to make it possible to manually retry the task from the last failed step.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

- we will provide extended task API in scaffolder with a necessary tools to let tasks implement retries
- make built-in actions retryable
- enable the user to retry the failed task
- should be possible to retry the task on a different scaffolder instance
- we would like to retry from any state and not tearing down or overwriting what was created before.
- we would like to be resilient to upstream failures, i.e. a request to create a remote repository failed and repository was created, it should be handled gracefully.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

We will not aim to magically provide idempotency for actions, it has to be explicitly implemented.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

### Idempotency

We believe that idempotency is the best way to do it. Idempotency allows to rerun the actions multiple times to gracefully deal with semi-complete actions.

### Serialization of workspace

We believe that serialization of workspaces is the way to achieve re-running the task in a non-sticky way. This means that the task can be restored and retried on a different scaffolder task worker. This serialization can be stored in the database, or perhaps additional modules could be installed to provide additional options for storing this serialized workspace data since it may be large in some cases.

### Secrets

Secrets will be stored for a longer period of time in the database and wiped out once the task goes into a completed state (successfully finished or archived). Depending on the life of the task, it's possible that these secrets could expire. The refresh of these tokens is out of scope for now, but perhaps could be achieved by notifying the user that they need to go back to a task page to re-trigger the task.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Idempotency

This is a simplified idempotent version of GitHub repository creation action:

```typescript
export function createGithubRepoCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    secrets?: { [key: string]: string };
    token?: string;
  }>({
    id: 'github:repo:create',
    description: 'Creates a GitHub repository.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: inputProps.repoUrl,
          token: inputProps.token,
          secrets: inputProps.secrets,
          repoVariables: inputProps.repoVariables,
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        secrets,
        repoVariables,
        token: providedToken,
      } = ctx.input;

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        repoUrl: repoUrl,
      });
      const client = new Octokit(octokitOptions);

      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const user = await client.rest.users.getByUsername({
        username: owner,
      });

      await ctx.checkpoint({
        key: 'repo.creation.v1',
        fn: async () => {
          const repoCreationPromise =
            user.data.type === 'Organization'
              ? client.rest.repos.createInOrg({
                  name: repo,
                  org: owner,
                })
              : client.rest.repos.createForAuthenticatedUser({
                  name: repo,
                });
          const { repoUrl } = await repoCreationPromise;
          return { repoUrl };
        },
      });

      if (secrets) {
        await ctx.checkpoint({
          key: 'repo.create.variables',
          fn: async () => {
            for (const [key, value] of Object.entries(repoVariables ?? {})) {
              await client.rest.actions.createRepoVariable({
                owner,
                repo,
                name: key,
                value: value,
              });
            }
          },
        });
      }

      ctx.output('remoteUrl', newRepo.clone_url);
    },
  });
}
```

#### Task context store

Implement the similar API to `CatalogProcessorCache` allowing to store markers or keys to enable users to write idempotent actions.
This context persists across retries.

```typescript
const repoMarker = await cache.get<RepoMarker>('repo.marker.key');
```

#### Checkpoints

Checkpoints will allow action authors to create actions where code paths are ignored if already run.
This will be provided on a context object and action of author provide a key and a callback.

```typescript
await ctx.checkpoint({
  key: 'repo.creation',
  fn: async () => {
    const { repoUrl } = await client.rest.Repository.create({});
    return { repoUrl };
  },
});
```

This checkpoint will be backed with task stored context namespaced with a checkpoint versioned prefix.
It's going look like:

```json
{
  "repo.creation": {
    "status": "success",
    "result": {
      "repoUrl": "https://github.com/backstage/backstage.git"
    }
  }
}
```

or a failed attempt as:

```json
{
  "repo.creation": {
    "status": "failed",
    "reason": "Namespace is not valid"
  }
}
```

`DatabaseTaskStore` will provide two extra methods `saveTaskState` and `getTaskState`. The type of state in API will be
represented as `JsonObject`.

Task state will be stored in the extra column `state` in the table `tasks` with the next structure:

```json
{
  "state": {
    "checkpoints": {
      "repo.creation": {
        "status": "success",
        "result": {
          "repoUrl": "https://github.com/backstage/backstage.git"
        }
      },
      "repo.add.member": {
        "status": "success",
        "result": {
          "id": "2345"
        }
      }
    }
  }
}
```

#### Workspace Persistence

The workspace will be serialized and stored in the database by default. This serialization should occur at the end of a step, and after each checkpoint. It will be possible to provide additional modules to extend the workspace serialization to other providers, such as GCS or S3 instead of the database.
This would be useful for larger workspaces, instead of taking up space in the database, we can store these directory structures in a more appropriate place.

The workspace will need to be zipped up into a binary like a `tar` or `zip` and be stored as a binary in the remote store. This is going to be better for performance than iterating through each file path and storing the contents along with the permissions.

There could be an impact to the speed of task recovery as it downloads the workspace, but this is an accepted risk and a tradeoff for the benefits of having the workspace stored in a remote store.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

We're going to release this behind `EXPERIMENTAL_` flags in the template schema to enable this on a per template level. And once we're happy with the implementation and after heavy testing, we can consider this being opt in at the plugin level, before being rolled out to all templates and the scaffolder plugin entirely.

There could also be the option to have this behind a `scaffolder.backstage.io/v1beta4` `apiVersion` if the `EXPERIMENTAL_` options are not enough, or causing too much of a headache.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

None present. However this BEP does unblock things like longer running tasks and [Gated Workflows](https://github.com/backstage/backstage/issues/16622)

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
