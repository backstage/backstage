---
id: dry-run-testing
title: Dry Run Testing
description: How to enable and implement dry run testing in actions
---

Scaffolder templates can be tested using the dry run feature of scaffolder actions. This allows you to simulate the effects of running a scaffolder action without making any actual changes to your environment, for example creating a webhook in GitHub. Once dry run is enabled in the scaffolder action, you can add handling to actions you use in your scaffolder templates to define how an action should operate in a dry run scenario.

## Enabling dry run testing

To enable dry run for your scaffolder action you need to add `supportsDryRun: true` to the configuration object of `createTemplateAction` in the function where the behavior of your action is defined:

```typescript
export function exampleAction() {
  return createTemplateAction<{
    example: string;
  }>({
    id: 'action:example',
    description: 'Example action',
    schema: {
      input: {
        type: 'object',
        properties: {
          example: {
            title: 'example',
            type: 'string',
          },
        },
      },
    },
    supportsDryRun: true,
    async handler(ctx) {
      ...
    },
  });
}
```

## Adding handling for dry run

To add handling for dry run functionality you need to add a check for `ctx.isDryRun` inside the handler of the configuration object which is being passed into `createTemplateAction` in the function where the behavior of your action is defined. Once the check is successful, you can perform the desired actions expected in a dry run, e.g. outputting non-sensitive inputs.

```typescript
async handler(ctx) {
      ...

      // If this is a dry run, log and return
      if (ctx.isDryRun) {
        ctx.logger.info(`Dry run complete`);
        return;
      }

      ...
    },
```

## Testing dry run handling

You will also need to add tests for the dry run handling, for example:

```typescript
  it('should not perform action during dry run', async () => {
    ...

    // Create the context object with the necessary properties for a dry run
    const ctx = {
      ...mockContext,
      isDryRun: true,
      input: {
        ...
      },
    };

    // Call the handler with the context
    await action.handler(ctx);

    expect(...);
  });
```
