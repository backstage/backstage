---
id: dry run testing
title: Dry Run Testing
description: Documentation on how to enable and implement dry run testing in actions
---

Scaffolder templates can be tested using the dry run feature of scaffolder actions. This allows you to simulate the effects of running a scaffolder action without making any actual changes to your environment, for example creating a webhook in Github. Once dry run is enabled in the scaffolder action, you can add handling to actions you use in your scaffolder templates to define how an action should operate in a dry run scenario.

## Enabling dry run testing

To enable dry run for your scaffolder action you need to add 'supportsDryRun: true' to the configuration object of 'createTemplateAction' in the function where the behavior of your action is defined:

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

To add handling for dry run functionality you need to add a check for 'ctx.isDryRun' inside the handler of the configuration object which is being passed into 'createTemplateAction' in the function where the behavior of your action is defined. Once the check is successful, you can perform the desired actions expected in a dry run, e.g. outputting non-sensitive inputs.

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

## Dry run via API call

Dry run can be performed using the dry-run API, which allows the dry run to be completed in code.
This [command line script](https://github.com/backstage/backstage/blob/master/contrib/scaffolder/template-testing-dry-run.md) offers a way for you to do work with dry-run API. You run it against a running instance, either locally or remote, and use it like:

```bash
scaffolder-dry http://localhost:7007/ template-directory values.yml output-directory
```

If you're using backend permissions, pass a front-end auth token from a current browser session via --token $FRONTEND_TOKEN.

You can also query the dry run endpoint directly in code, for example:

`dry-run.js`

```javascript
const template = yaml.load(
  await fs.readFile('path/to/templates/template.yaml', 'utf-8'),
);
const values = JSON.parse(
  await fs.readFile('path/to/templates/template_values.json', 'utf-8'),
);

// Prepare the request body
const body = {
  template,
  values,
  directoryContents,
};

// Send the request to the dry-run endpoint
const response = await fetch(
  'http://localhost:7000/api/scaffolder/v2/dry-run',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer <YOUR_API_KEY>', // replace 'YOUR_API_KEY' with your actual API key
    },
    body: JSON.stringify(body),
  },
);
```

`template_values.json`

```json
{
  "example": "test",
  "name": "helloworld"
}
```

In this example `template.yaml` is your template yaml file, `template_values.json` would be a json file containing key value pairs for your template inputs, and `directoryContents` is an array that is populated with objects representing the contents of a specified directory (e.g. the same directory where you have your template yaml). Each object in the array corresponds to a file within the directory and contains two properties; the name of the file and the content of the file, encoded in Base64.
This is needed if any other files were required by the actions your template is using.
