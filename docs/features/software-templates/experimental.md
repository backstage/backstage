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

Running tasks, especially longer running ones can be at risk of being lost when the `scaffolder-backend` plugin is redeployed. These tasks will just be stuck in a `processing` state, with no real way to recover them.

The experimental Retries and Recovery is here to help mitigate this.

Whenever you do redeploy, on startup there will be a check of all tasks in `processing` state that you identified in your template as being capable of starting over.

More details about the motivation and the goals of this feature can be found in [the `Scaffolder Retries and Idempotency` BEP](https://github.com/backstage/backstage/tree/master/beps/0004-scaffolder-task-idempotency)

Here is an example of how you can enable this in your `template.yaml` manifest:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: recoverable-template
spec:
  EXPERIMENTAL_recovery:
    EXPERIMENTAL_strategy: startOver
```

You'll also need enable the recovery feature, add this snippet into your `app-config.yaml` file:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasks: true
```

By default, the tasks that are in a `processing` state and have not reported back with a heartbeat for longer than 30 seconds will be automatically recovered.

This implies that the task's status will shift to `open` initiating and will be restarted from the beginning. This means that it's important that your actions that you have in the template run are idempotent.

You can look at how to incorporate [checkpoints](https://backstage.io/docs/features/software-templates/writing-custom-actions#using-checkpoints-in-custom-actions-experimental) into your custom actions to achieve that.

In the case that you would like to make the heartbeat threshold shorter or longer than the default 30 seconds, you can customize it for your needs with the configuration:

```yaml
scaffolder:
  EXPERIMENTAL_recoverTasksTimeout: { minutes: 1 }
```

If your task works with the filesystem and stores files in the workspace and you want to store these workspaces across runs, you can enable this with some additional config to `app-config.yaml`

```yaml
scaffolder:
  EXPERIMENTAL_workspaceSerialization: true
```

By default, the serialized workspace will be stored in the database, however if there's larger files, or if you're worried about the size of these files taking up space in the database you can configure bucket storage and have a sensible retention policy there to cleanup older files.

At the moment we also support integration with Google GCS; to switch the serialization to this provider, you can do so with:

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
