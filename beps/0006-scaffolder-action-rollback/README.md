---
title: Scaffolder Action Rollback
status: provisional
authors:
  - 'bnechyporenko@bol.com'
  - 'benjaminl@spotify.com'
owners:
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2024-03-13
---

# BEP: Scaffolder Action Rollback

[**Discussion Issue**](https://github.com/backstage/backstage/issues/28818)

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

Introducing the rollback to scaffolder actions provides the mean to come back to the initial state.

## Motivation

Mitigate the issue of manual clean up from partially created resources during template execution failures. When a template execution fails after creating a number of resources but before completing, the system is left in an inconsistent state. Currently, there is no standardized way to clean up these partially created resources, leading to orphaned resources in external systems requiring manual cleanup.

### Goals

- Provide a standardized, optional rollback mechanism for scaffolder actions
- Enable proper cleanup of resources created in third-party systems when template execution fails
- Improve the developer experience by reducing manual intervention for cleanup after failures
- Allow for targeted rollbacks of specific actions rather than only full template rollbacks

### Non-Goals

- Modifying existing actions to implement rollback (this proposal only provides the framework)
- Adding automatic rollback triggers for all possible error scenarios

## Proposal

Rollback is going to be performed:

- when a user manually decide to perform this action.
- when a task has to be recovered and TaskRecoverStrategy set to 'rollback'

## Design Details

The rollback mechanism will be implemented by extending the existing `TemplateAction` [type](https://github.com/backstage/backstage/blob/946721733c1bc76059a12163503c4e959df4ec34/plugins/scaffolder-node/report.api.md?plain=1#L510-L529) to include an optional rollback function:

```typescript
export type TemplateAction<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
  TSchemaType extends 'v1' | 'v2' = 'v1',
> = {
  ...,
  handler: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
  ) => Promise<void>;
  rollback?: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
  ) => Promise<void>;
};
```

The template action options will be updated to include the rollback function:

```typescript
export type TemplateActionOptions<
  ...
  handler: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
  rollback?: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
  ) => Promise<void>;
};
```

Implementers provide the rollback function when calling `createTemplateAction`.

```typescript
const createPublishGitHubAction = createTemplateAction({
  id: 'publish:github',
  ...,
  async handler() {},
  async rollback() {},
});
```

When a scaffolder task fails, the system will invoke the rollback function for any actions that:

1. Were successfully executed
1. Provide a rollback implementation

The rollback execution will follow a reverse order (LIFO approach) from the original execution, ensuring dependent resources are cleaned up properly.

### Example

- closing/deleting a pull request
- deleting a created repository
- deleting a _third party X_

```tsx
createTemplateAction<{
  apiUrl: (z) => z.string(),
  projectKey: (z) => z.string(),
  // other inputs...
}, {
  projectId: (z) => z.string(),
}>(
  {
    ...,
    handler: async (ctx) => {
      // Create the project
      const projectId = await create(ctx.input.apiUrl, ctx.input.projectKey);
      ctx.output.projectId = projectId;
    },
    rollback: async (ctx) => {
      // Delete the project if it was created
      if (ctx.output.projectId) {
        await delete(ctx.input.apiUrl, ctx.output.projectId);
      }
    }
  }
)
```

### Rolling back a set of actions

The rollback will be performed in the reverse order of the execution. For example, if the following actions are executed:

1. create a repository
2. create a pull request
3. create a branch
4. create third party resource

The rollback will be performed in the following order:

1. delete the third party resource
2. delete the branch
3. delete the pull request
4. delete the repository

This will be managed by the TaskBroker.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

This feature enhancement will be optional, ensuring we maintain backwards compatibility.

## Dependencies

No known dependencies at this time.

## Alternatives

No other alternatives at this time.
