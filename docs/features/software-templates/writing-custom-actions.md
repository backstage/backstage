---
id: writing-custom-actions
title: Writing Custom Actions
description: How to write your own actions
---

If you want to extend the functionality of the Scaffolder, you can do so
by writing custom actions which can be used alongside our
[built-in actions](./builtin-actions.md).

:::note Note

When adding custom actions, the actions array will **replace the
built-in actions too**. Meaning, you will no longer be able to use them.
If you want to continue using the builtin actions, include them in the `actions`
array when registering your custom actions, as seen below.

:::

## Streamlining Custom Action Creation with Backstage CLI

The creation of custom actions in Backstage has never been easier thanks to the Backstage CLI. This tool streamlines the
setup process, allowing you to focus on your actions' unique functionality.

Start by using the `yarn backstage-cli new` command to generate a scaffolder module. This command sets up the necessary
boilerplate code, providing a smooth start:

```sh
$ yarn backstage-cli new
? What do you want to create?
  plugin-common - A new isomorphic common plugin package
  plugin-node - A new Node.js library plugin package
  plugin-react - A new web library plugin package
> scaffolder-module - An module exporting custom actions for @backstage/plugin-scaffolder-backend
```

When prompted, select the option to generate a scaffolder module. This creates a solid foundation for your custom
action. Enter the name of the module you wish to create, and the CLI will generate the required files and directory
structure.

## Writing your Custom Action

After running the command, the CLI will create a new directory with your new scaffolder module. This directory will be
the working directory for creating the custom action. It will contain all the necessary files and boilerplate code to
get started.

Let's create a simple action that adds a new file and some contents that are passed as `input` to the function. Within
the generated directory, locate the file at `src/actions/example/example.ts`. Feel free to rename this file along with
its generated unit test. We will replace the existing placeholder code with our custom action code as follows:

```ts title="With Zod"
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { type z } from 'zod';

export const createNewFileAction = () => {
  return createTemplateAction({
    id: 'acme:file:create',
    description: 'Create an Acme file.',
    schema: {
      input: {
        contents: z => z.string({ description: 'The contents of the file' }),
        filename: z =>
          z.string({
            description: 'The filename of the file that will be created',
          }),
      },
    },

    async handler(ctx) {
      await fs.outputFile(
        resolveSafeChildPath(ctx.workspacePath, ctx.input.filename),
        ctx.input.contents,
      );
    },
  });
};
```

So let's break this down. The `createNewFileAction` is a function that returns a
`createTemplateAction`, and it's a good place to pass in dependencies which
close over the `TemplateAction`. Take a look at our
[built-in actions](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/actions/builtin)
for reference.

The `createTemplateAction` takes an object which specifies the following:

- `id` - A **unique** ID for your custom action. We encourage you to namespace these
  in some way so that they won't collide with future built-in actions that we
  may ship with the `scaffolder-backend` plugin.
- `description` - An optional field to describe the purpose of the action. This will populate in the `/create/actions`
  endpoint.
- `schema.input` - A `zod` schema object for input values to your function
- `schema.output` - A `zod` schema object for values which are output from the
  function using `ctx.output`
- `handler` - the actual code which is run as part of the action, with a context

### Naming Conventions

Try to keep names consistent for both your own custom actions, and any actions contributed to open source. We've found
that a separation of `:` and using a verb as the last part of the name works well.
We follow `provider:entity:verb` or as close to this as possible for our built-in actions. For example,
`github:actions:create` or `github:repo:create`.

Also feel free to use your company name to namespace them if you prefer too, for example `acme:file:create` like above.

Prefer to use `camelCase` over `snake_case` or `kebab-case` for these actions if possible, which leads to better reading
and writing of template entity definitions.

### Adding a TemplateExample

A TemplateExample is a way to document different ways that your custom action can be used. Once added, it will be visible
in your Backstage instance under the [/create/actions](https://demo.backstage.io/create/actions) path. You can have multiple
examples for one action that can demonstrate different combinations of inputs and how to use them.

#### Define TemplateExamples

Below is a sample TemplateExample that is used for `publish:github`. The source code is available
on [GitHub](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-github/src/actions/github.examples.ts)
and preview on [demo.backstage.io/create/actions](https://demo.backstage.io/create/actions#publish-github)

```ts title="With JSON Schema"
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Initializes a GitHub repository with a description.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:github',
          name: 'Publish to GitHub',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a GitHub repository with public repo visibility, if not set defaults to private',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:github',
          name: 'Publish to GitHub',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'public',
          },
        },
      ],
    }),
  },
];
```

#### Register TemplateExample with your custom action

It is also crucial
to [register](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-github/src/actions/github.ts#L126)
the `TemplateExample` when calling `createTemplateAction` by including the `examples`
property.

```ts
return createTemplateAction({
  id: 'publish:github',
  description:
    'Initializes a git repository of contents in workspace and publishes it to GitHub.',
  examples,
  // ...rest of the action configuration
});
```

#### Test TemplateAction examples

It is also possible to test your example TemplateActions. You can see a sample test
on [GitHub](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-github/src/actions/github.examples.test.ts)

### The context object

When the action `handler` is called, we provide you a `context` as the only
argument. It looks like the following:

- `ctx.baseUrl` - a string where the template is located
- `ctx.checkpoint` - _Experimental_ allows to
  implement [idempotency of the actions](https://github.com/backstage/backstage/tree/master/beps/0004-scaffolder-task-idempotency)
  by not re-running the same function again if it was
  executed successfully on the previous run.
- `ctx.logger` - a [LoggerService](../../backend-system/core-services/logger.md) instance for additional logging inside your action
- `ctx.workspacePath` - a string of the working directory of the template run
- `ctx.input` - an object which should match the `zod` schema provided in the
  `schema.input` part of the action definition
- `ctx.output` - a function which you can call to set outputs that match the
  `zod` schema in `schema.output` for ex. `ctx.output('downloadUrl', myDownloadUrl)`
- `createTemporaryDirectory` a function to call to give you a temporary
  directory somewhere on the runner, so you can store some files there rather
  than polluting the `workspacePath`
- `ctx.metadata` - an object containing a `name` field, indicating the template
  name. More metadata fields may be added later.

## Registering Custom Actions

To register your new custom action in the Backend System, you will need to create a backend module. Here is a very
simplified example of how to do that:

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ scaffolder /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        scaffolder.addActions(createNewFileAction()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend'));
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomExtensions);
```

If your custom action requires core services such as `config` or `cache` they can be imported in the dependencies and
passed to the custom action function.

```ts title="packages/backend/src/index.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

...

env.registerInit({
  deps: {
    scaffolder: scaffolderActionsExtensionPoint,
    cache: coreServices.cache,
    config: coreServices.rootConfig,
  },
  async init({scaffolder, cache, config}) {
    scaffolder.addActions(
      customActionNeedingCacheAndConfig({cache: cache, config: config}),
    );
  })
```

### Using Checkpoints in Custom Actions (Experimental)

Idempotent action could be achieved via the usage of checkpoints, for example:

```ts title="plugins/my-company-scaffolder-actions-plugin/src/vendor/my-custom-action.ts"
const res = await ctx.checkpoint?.({
  key: 'create.projects',
  fn: async () => {
    const projectStgId = createStagingProjectId();
    const projectProId = createProductionProjectId();

    return {
      projectStgId,
      projectProId,
    };
  },
});
```

You have to define the unique key in the scope of the scaffolder task for your checkpoint. During the execution task engine
will check if the checkpoint with such a key was already executed or not, if yes, and the run was successful, the callback
will be skipped and instead the stored value will be returned.

Whenever you change the return type of the checkpoint, we encourage you to change the ID.
For example, you can embed the versioning or another indicator for that (instead of using key `create.projects`, it can
be `create.projects.v1`).
If you'll preserve the same key, and you'll try to restart the affected task, it will fail on this checkpoint.
The cached result will not match with the expected updated return type.
By changing the key, you'll invalidate the cache of the checkpoint.

## Contributed Community Actions

You can find a list of community-contributed and open-source actions by:

- Going to the [Backstage Plugin Directory](https://backstage.io/plugins/) and filter by `scaffolder`!
- Checking out the [Community Plugins Repo](https://github.com/backstage/community-plugins)!
