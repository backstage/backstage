---
id: experimental
title: Experimental Features
description: Information on Experimental Features that are currently available in the Scaffolder
---

## Introduction

This section contains information and guides on the experimental features that are currently available in the Scaffolder. Be advised that these features are still in development and may not be fully stable or complete, and are subject to change at any time.

Please leave feedback on these features in the [Backstage Discord](https://discord.com/invite/MUpMjP2) or by [creating an issue](https://github.com/backstage/backstage/issues/new/choose) on the Backstage GitHub repository.

## Retries and Recovery

:::note Note

Task recovery has been promoted from experimental to a stable feature. See the [Task Recovery configuration docs](./configuration.md#task-recovery) for the current setup guide.

The workspace provider extension point remains an alpha API.

The experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, etc.) and the per-template `EXPERIMENTAL_recovery` field are still supported as fallbacks but are deprecated and will be removed in a future release.

:::

## Form Decorators

Form decorators provide the ability to run arbitrary code before the form is submitted along with secrets to the `scaffolder-backend` plugin.

#### Configuring templates

Define which decorators run in each template using the `formDecorators` key in the template's `spec`:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-template
spec:
  formDecorators:
    - id: mockDecorator
      input:
        test: something funky

  parameters: ...
  steps: ...
```

:::note
The legacy `EXPERIMENTAL_formDecorators` field is still supported but deprecated. Migrate to `formDecorators` when possible.
:::

#### Creating a decorator

Create a decorator with `createScaffolderFormDecorator` and register it as an extension using `FormDecoratorBlueprint`:

```ts
import { createScaffolderFormDecorator } from '@backstage/plugin-scaffolder-react/alpha';
import { githubAuthApiRef } from '@backstage/core-plugin-api';

const mockDecorator = createScaffolderFormDecorator({
  id: 'mockDecorator',
  schema: {
    input: {
      test: z => z.string(),
    },
  },
  deps: {
    githubApi: githubAuthApiRef,
  },
  decorator: async (
    { setSecrets, setFormState, input: { test } },
    { githubApi },
  ) => {
    const token = await githubApi.getAccessToken(['repo']);
    setFormState(state => ({ ...state, test }));
    setSecrets(state => ({ ...state, GITHUB_TOKEN: token }));
  },
});
```

#### Installation (new frontend system)

Register your decorator as an extension using `FormDecoratorBlueprint`:

```ts
import { FormDecoratorBlueprint } from '@backstage/plugin-scaffolder-react/alpha';

export const myDecoratorExtension = FormDecoratorBlueprint.make({
  name: 'my-decorator',
  params: {
    decorator: mockDecorator,
  },
});
```

Then install the extension in your app or plugin.

#### Installation (legacy frontend system)

For apps using the legacy frontend system, provide decorators through a Utility API in `packages/app/src/apis.ts`:

```ts
createApiFactory({
  api: formDecoratorsApiRef,
  deps: {},
  factory: () =>
    DefaultScaffolderFormDecoratorsApi.create({
      decorators: [mockDecorator],
    }),
}),
```
