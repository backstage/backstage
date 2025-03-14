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

### Securing Rollbacks

#### Considerations

1. Add a rollback permission definition with permission checks in the NunjucksWorkflowRunner
1. Add a specific rule for rollback operations to scaffolderActionRules
1. Implement Scope-Limited Rollback Functions
1. Implement the AuditorService
1. Wrap in a secure rollback context

#### Implementation

We will provide a helper function that encapsulates the logic of verifying the resource and executing the rollback. Core security checks can be performed in this function to ensure the resource is valid and can be rolled back.

By default, we can handle the following:

1. Verify we reached the point of setting output
1. Parse resource details from the output and validate them against the input
1. Execute the actual rollback with the validated resource

```typescript
export function createSecureRollback
  TActionInput extends JsonObject,
  TActionOutput extends JsonObject,
  TSchemaType extends 'v1' | 'v2'
>(
  rollbackFn: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
    resource: { id: string; type: string; metadata?: JsonObject }
  ) => Promise<void>,
  options: {
    // Required resource identifier from the output
    outputKey: keyof TActionOutput;
    // Function to parse resource details from the output
    parseResource: (value: JsonValue) => { id: string; type: string; metadata?: JsonObject };
    // Validation to ensure resource matches input
    validateResource: (
      resource: { id: string; type: string; metadata?: JsonObject },
      input: TActionInput
    ) => boolean;
  }
) {
  return async (ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>) => {
    // 1. Verify we reached the point of setting output
    const outputValue = ctx.output?.values?.[options.outputKey];
    if (outputValue === undefined) {
      ctx.logger.info(`Skipping rollback: no resource was created (no value for ${String(options.outputKey)} in output)`);
      return;
    }

    // 2. Parse resource details from the output
    const resource = options.parseResource(outputValue);

    // 2. Verify the resource matches what would have been created from the input
    if (!options.validateResource(resource, ctx.input)) {
      ctx.logger.error(
        `Security check failed: output resource ${resource.id} doesn't match expected value from input parameters`
      );
      throw new Error(`Resource validation failed during rollback of ${resource.type}`);
    }

    // 4. Execute the actual rollback with the validated resource
    ctx.logger.info(`Rolling back ${resource.type} with id ${resource.id}`);
    await rollbackFn(ctx, resource);
    ctx.logger.info(`Successfully rolled back ${resource.type} with id ${resource.id}`);
  };
}
```

Implementers must provide a method to parse the resource details from the output and a method to validate the resource details against the input. An example implementation looks like

```typescript
rollback: createSecureRollback(
  async (ctx, resource) => {
    // Execute the actual deletion using the validated resource
    const { owner, repo } = resource.metadata;
    await githubClient.repos.delete({ owner, repo });
  },
  {
    outputKey: 'repoUrl',
    parseResource: repoUrl => {
      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      // the rollback function only knows about the resource details returned here
      return {
        id: repoUrl,
        type: 'github-repository',
        metadata: { owner, repo },
      };
    },
    validateResource: (resource, input) => {
      const { owner, repo } = resource.metadata;
      return owner === input.owner && repo === input.repoName;
    },
  },
);
```

The solution aims to only operate on resources that were actually created by the action.

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

### Enabling rollback for a step when writing a template

Rollbacks are disabled by default. Perhaps we can add a `dangerouslyEnableRollback` flag to the `NunjucksWorkflowRunner` to opt-in to this behavior,
but this is not yet decided.

We will leave it up to the template author to enable the rollback for a given step by setting a rollback property to `true`.

```yaml
steps:
...
- id: step-id
  name: Step name
  action: action:id
  // ...
  input:
    // ...
  rollback: true
```

###

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
