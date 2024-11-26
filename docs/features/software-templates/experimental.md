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

### TODO

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
