---
id: experimental
title: Experimental Features
# prettier-ignore
description: Information on Experimental Features that are currently available in the Scaffolder
---

## Introduction

This section contains information and guides on the experimental features that are currently available in the Scaffolder. Be advised that these features are still in development and may not be fully stable or complete, and are subject to change at any time.

Please leave feedback on these features in the [Backstage Discord](https://discord.com/invite/MUpMjP2) or by [creating an issue](https://github.com/backstage/backstage/issues/new/choose) on the Backstage GitHub repository.

## Retries and Recovery

Do you have long-running tasks, and can they recover and proceed after Backstage redeploy?

Then you definitely will benefit from enabling the experimental feature called EXPERIMENTAL_recovery.

Whenever you do redeploy, on startup there will be a check of all tasks in "processing" state that you identified in your template as they are capable of starting over.

This is an example of how you can do it:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: recoverable-template
spec:
  EXPERIMENTAL_recovery:
    EXPERIMENTAL_strategy: startOver
```

And to enable the recovery feature itself, you can do it by adding this snippet into your app-config.yaml file:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasks: true
```

By default, all the tasks that are in a processing state and have a heartbeat of more than 30 seconds will be automatically recovered.
This implies that the task's status will shift to "Open," initiating its execution from the beginning. So you have to be sure that your tasks can run multiple times.
You can look at how to incorporate [checkpoints](https://backstage.io/docs/features/software-templates/writing-custom-actions#using-checkpoints-in-custom-actions-experimental) into your custom actions to achieve that.

In case 30 seconds of no heartbeat time is not appropriate for your case to restart the task, you can customize it for your needs with the configuration:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasksTimeout: { minutes: 1 }
```

If your task works with the filesystem, you might require serialization of your workspace.

You can enable this feature with:

```yaml
scaffolder:
  EXPERIMENTAL_workspaceSerialization: true
```

By default, the serialized workspace will be stored in your database.

If you work with large files, it might not be the best option for you.

At this moment we support the integration with the GCP bucket; to switch the serialization to this provider, you can with:

```yaml
scaffolder:
  EXPERIMENTAL_workspaceSerializationProvider: gcpBucket
  EXPERIMENTAL_workspaceSerializationGcpBucketName: name-of-your-bucket
```

You don't need to provide any extra configuration, but you have to be sure that you are using [workload identity](https://cloud.google.com/iam/docs/workload-identity-federation).

## Form Decorators

Form decorators provide the ability to run arbitrary code before the form is submitted along with secrets to the `scaffolder-backend` plugin. They are provided to the `app` using a Utility API.

#### Installation

To install the Form Decorators, add the following to your `packages/app/src/apis.ts`:

```ts
  createApiFactory({
    api: formDecoratorsApiRef,
    deps: {},
    factory: () =>
      DefaultScaffolderFormDecoratorsApi.create({
        decorators: [
          // add decorators here
        ],
      }),
  }),
```

And then you'll also need to define which decorators run in each template using the `EXPERIMENTAL_formDecorators` key in the template's `spec`:

```yaml
kind: Template
metadata:
  name: my-template
spec:
  EXPERIMENTAL_formDecorators:
    - id: my-decorator
      input:
        test: something funky

  parameters: ...
  steps: ...
```

#### Creating a Decorator

You can create a decorator using the simple helper method `createScaffolderFormDecorator`:

```ts
export const mockDecorator = createScaffolderFormDecorator({
  // give the decorator a name
  id: 'mock-decorator',

  // define the schema for the input that can be proided in `template.yaml`
  schema: {
    input: {
      test: z => z.string(),
    },
  },
  deps: {
    // define dependencies here
    githubApi: githubAuthApiRef,
  },
  decorator: async (
    // Context has all the things needed to write simple decorators
    { setSecrets, setFormState, input: { test } },
    // Depepdencies injected here
    { githubApi },
  ) => {
    // mutate the form state
    setFormState(state => ({ ...state, test, mock: 'MOCK' }));

    // mutate the form secrets
    setSecrets(state => ({ ...state, GITHUB_TOKEN: 'MOCK_TOKEN' }));
  },
});
```
