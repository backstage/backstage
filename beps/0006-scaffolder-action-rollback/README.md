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
  - [Auditing and Permissions](#auditing-and-permissions)
  - [Securing Rollbacks](#securing-rollbacks)
  - [Rollback mechanism](#rollback-mechanism)
  - [WorkflowRunner changes](#workflowrunner-changes)
  - [Enabling rollback for a step when writing a template](#enabling-rollback-for-a-step-when-writing-a-template)
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
- Provide a clear indicator of which actions have rollbacks in the UI (/create/actions)
- Provide override options when possible
- Ensure auditing is a first class concern

### Non-Goals

- Modifying existing actions to implement rollback (this proposal only provides the framework)
- Adding automatic rollback triggers for all possible error scenarios

## Proposal

Rollback is going to be performed:

- on template execution failure
- for each step when rollback is enabled and the correlating action includes a rollback function
- and possibly incorporate when `TaskRecoverStrategy` set to 'rollback' (needs more research)

## Design Details

### Auditing and Permissions

1. Implement the AuditorService for key operations
1. Add a rollback permission definition with permission checks in the NunjucksWorkflowRunner
1. Add a specific rule for rollback operations to `scaffolderActionRules` ([ref](https://github.com/backstage/backstage/blob/85df833fe33c45cf2ad8e0322dafb118b89a5ea8/plugins/scaffolder-backend/src/service/rules.ts#L133-L138))

### Securing Rollbacks

We will provide a helper function that encapsulates the logic of verifying the resource and executing the rollback. Core security checks can be performed in this function to ensure the resource is
valid and can be rolled back. There is a possible opportunity to allow others to extend this function to provide custom security checks.

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

    try {
      // 4. Execute the actual rollback with the validated resource
      ctx.logger.info(`Rolling back ${resource.type} with id ${resource.id}`);
      await action.rollback(ctx);
      ctx.logger.info(`Successfully rolled back ${resource.type} with id ${resource.id}`);
    } catch (error) {
      ctx.logger.error(
        `Failed to rollback ${resource.type} with id ${resource.id}: ${error}`,
      );
      ctx.logger.info('Continuing with next rollback...');
    }
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
  ) => Promise<void>;
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
  rollback: createSecureRollback(
    async (ctx, resource) => {
      await githubClient.repos.delete({ owner, repo });
    },
    {
      outputKey: 'repoUrl',
      parseResource: repoUrl => {
        const { owner, repo } = parseRepoUrl(repoUrl, integrations);
        return { id: repoUrl, type: 'github-repository', metadata: { owner, repo } };
      },
      validateResource: (resource, input) => {
        return owner === input.owner && repo === input.repoName;
      },
    },
  ),
});
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

The NunjucksWorkflowRunner will be modified to track successfully completed actions with their rollback function. When a scaffolder task fails, the system will invoke the rollback function for any actions that:

1. Were successfully executed
1. Provide a rollback implementation

The rollback execution will follow a reverse order (LIFO approach) from the original execution, ensuring dependent resources are cleaned up properly. Rollback failures will be logged, but not fail the overall
task of rolling back. This means that if one rollback function fails, it will be logged and the next rollback function will be attempted. This will be the default behavior, but we can provided configuration to override.

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
    await action.rollback(ctx);
  }
}
```

### Enabling rollback for a step when writing a template

Rollbacks are disabled by default. Perhaps we can add a `dangerouslyEnableRollback` flag to the `NunjucksWorkflowRunner` to opt-in to this behavior, but this is not yet decided.

We will leave it up to the template author to enable the rollback for a given step by setting a rollback property to `true`. If the action does not provide a rollback function, the property will be ignored.

```yaml
steps:
...
- id: step-id
  name: Step name
  action: action:id
  // ...
  input:
    // ...
  // reminder this is optional, and defaults to false - it also has no effect if the action does not provide a rollback function
  rollback: true
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

This feature enhancement will be optional, ensuring we maintain backwards compatibility. It will be released as an opt in feature for both action maintainers and template authors. It can initially be
released as part of the [experimental features](https://backstage.io/docs/features/software-templates/experimental).

We will update the documentation to include:

- Description of the rollback feature
- Usage examples
- Best practices

## Dependencies

- Possibly experimental task execution checkpoints ([docs](https://backstage.io/docs/features/software-templates/writing-custom-actions/#using-checkpoints-in-custom-actions-experimental))

## Alternatives

- Create a separate action that is called as a parameter to the template step
- Allow the template author to specify a rollback mechanism for each step
