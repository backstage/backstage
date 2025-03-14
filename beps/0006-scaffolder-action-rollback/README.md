---
title: Scaffolder Action Rollback
status: provisional
authors:
  - 'bnechyporenko@bol.com'
  - 'benjaminl@spotify.com'
  - 'kurtaking@gmail.com'
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

### Rollback mechanism

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

#### Example

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

#### Example scenario

The rollback will be performed in the reverse order of the execution. For example, if the following actions are executed, where the rollback is provided for the last 3 actions:

1. create a repository (no rollback provided)
1. create a pull request (rollback provided)
1. create a branch (rollback provided)
1. create third party resource (rollback provided)

The rollback will be performed in the following order:

1. delete the third party resource
1. delete the branch
1. delete the pull request

The repository will not be deleted because the rollback is not provided for it.

### WorkflowRunner changes

When a scaffolder task fails, the system will invoke the rollback function for any actions that:

1. Were successfully executed
1. Provide a rollback implementation

The rollback execution will follow a reverse order (LIFO approach) from the original execution, ensuring dependent resources are cleaned up properly.

The NunjucksWorkflowRunner will be modified to track successfully completed actions with their rollback function.

```typescript
const completedActionsWithRollback: Array<{
  action: TemplateAction;
  ctx: ActionContext<any, any, any>;
  step: TaskStep;
}> = [];
```

```typescript
const completedActionsWithRollback = [];

async executeStep(
  task: TaskContext,
  step: TaskStep,
  context: TemplateContext,
  ...
) {
  // ...
  await action.handler(ctx);

  if (action.rollback && !task.isDryRun) {
    completedActionsWithRollback.push({ action, ctx, step });
  }

  // ...
}
```

In case of a failure, the workflow runner will invoke the rollback function for each of the completed actions.

```ts
for (const { action, ctx, step } of [
  ...this.completedActionsWithRollback,
].reverse()) {
  if (action.rollback) {
    // ...
    taskLogger.info(`Rolling back step ${step.id} (${step.name})`);
    await action.rollback(ctx);
    taskLogger.info(`Successfully rolled back step ${step.id} (${step.name})`);

    // ...
  }
}
```

### Disable rollback for a step

Sometimes, the template author is leveraging community created actions. In this case, the template author does not have control over the rollback function.

To address this, we will allow the template author to disable the rollback for a given step by setting a rollback property to `false`.

```yaml
steps:
...
- id: step-id
  name: Step name
  action: action:id
  // ...
  input:
    // ...
  rollback: false
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

This feature enhancement will be optional, ensuring we maintain backwards compatibility.

1. Update Type Definitions
   - Add rollback to TemplateActionOptions and TemplateAction interfaces
1. Ensure createTemplateAction Preserves Rollback
   - Verify that the rollback function is properly passed through
1. Modify TaskWorker
   - Track completed actions during execution
   - Implement rollback logic for failed tasks
   - Handle rollback errors gracefully
1. Update Documentation
   - Describe the rollback feature
   - Provide usage examples
   - Explain best practices

## Dependencies

No known dependencies at this time.

## Alternatives

No other alternatives at this time.
