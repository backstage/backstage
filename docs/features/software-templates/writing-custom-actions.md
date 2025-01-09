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
If you want to continue using the builtin actions, include them in the actions
array when registering your custom actions, as seen below.

:::

## Streamlining Custom Action Creation with Backstage CLI

The creation of custom actions in Backstage has never been easier thanks to the Backstage CLI. This tool streamlines the setup process, allowing you to focus on your actions' unique functionality.

Start by using the `yarn backstage-cli new` command to generate a scaffolder module. This command sets up the necessary boilerplate code, providing a smooth start:

```
$ yarn backstage-cli new
? What do you want to create?
  plugin-common - A new isomorphic common plugin package
  plugin-node - A new Node.js library plugin package
  plugin-react - A new web library plugin package
> scaffolder-module - An module exporting custom actions for @backstage/plugin-scaffolder-backend
```

You can find a [list](../../tooling/cli/03-commands.md) of all commands provided by the Backstage CLI.

When prompted, select the option to generate a scaffolder module. This creates a solid foundation for your custom action. Enter the name of the module you wish to create, and the CLI will generate the required files and directory structure.

## Writing your Custom Action

After running the command, the CLI will create a new directory with your new scaffolder module. This directory will be the working directory for creating the custom action. It will contain all the necessary files and boilerplate code to get started.

Let's create a simple action that adds a new file and some contents that are passed as `input` to the function. Within the generated directory, locate the file at `src/actions/example/example.ts`. Feel free to rename this file along with its generated unit test. We will replace the existing placeholder code with our custom action code as follows:

```ts title="With Zod"
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { z } from 'zod';

export const createNewFileAction = () => {
  return createTemplateAction({
    id: 'acme:file:create',
    description: 'Create an Acme file.',
    schema: {
      input: z.object({
        contents: z.string().describe('The contents of the file'),
        filename: z
          .string()
          .describe('The filename of the file that will be created'),
      }),
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

- `id` - A unique ID for your custom action. We encourage you to namespace these
  in some way so that they won't collide with future built-in actions that we
  may ship with the `scaffolder-backend` plugin.
- `description` - An optional field to describe the purpose of the action. This will populate in the `/create/actions` endpoint.
- `schema.input` - A `zod` or JSON schema object for input values to your function
- `schema.output` - A `zod` or JSON schema object for values which are output from the
  function using `ctx.output`
- `handler` - the actual code which is run as part of the action, with a context

You can also choose to define your custom action using JSON schema instead of `zod`:

```ts title="With JSON Schema"
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { writeFile } from 'fs';

export const createNewFileAction = () => {
  return createTemplateAction<{ contents: string; filename: string }>({
    id: 'acme:file:create',
    description: 'Create an Acme file.',
    schema: {
      input: {
        required: ['contents', 'filename'],
        type: 'object',
        properties: {
          contents: {
            type: 'string',
            title: 'Contents',
            description: 'The contents of the file',
          },
          filename: {
            type: 'string',
            title: 'Filename',
            description: 'The filename of the file that will be created',
          },
        },
      },
    },
    async handler(ctx) {
      const { signal } = ctx;
      await writeFile(
        resolveSafeChildPath(ctx.workspacePath, ctx.input.filename),
        ctx.input.contents,
        { signal },
        _ => {},
      );
    },
  });
};
```

### Naming Conventions

Try to keep names consistent for both your own custom actions, and any actions contributed to open source. We've found that a separation of `:` and using a verb as the last part of the name works well.
We follow `provider:entity:verb` or as close to this as possible for our built in actions. For example, `github:actions:create` or `github:repo:create`.

Also feel free to use your company name to namespace them if you prefer too, for example `acme:file:create` like above.

Prefer to use `camelCase` over `snake_case` or `kebab-case` for these actions if possible, which leads to better reading and writing of template entity definitions.

> We're aware that there are some exceptions to this, but try to follow as close as possible. We'll be working on migrating these in the repository over time too.

### Adding a TemplateExample

A TemplateExample is a predefined structure that can be used to create custom actions in your software templates. It serves as a blueprint for users to understand how to use a specific action and its fields as well as to ensure consistency and standardization across different custom actions.

#### Define a TemplateExample and add to your Custom Action

```ts title="With JSON Schema"
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Template Example for Creating an Acme file',
    example: yaml.stringify({
      steps: [
        {
          action: 'acme:file:create',
          name: 'Create an Acme file.',
          input: {
            contents: 'file contents...',
            filename: 'ACME.properties',
          },
        },
      ],
    }),
  },
];
```

Add the example to the `createTemplateAction` under the object property `examples`:

`return createTemplateAction<{ contents: string; filename: string }>({id: 'acme:file:create', description: 'Create an Acme file', examples, ...};`

### The context object

When the action `handler` is called, we provide you a `context` as the only
argument. It looks like the following:

- `ctx.baseUrl` - a string where the template is located
- `ctx.checkpoint` - _Experimental_ allows to
  implement [idempotency of the actions](https://github.com/backstage/backstage/tree/master/beps/0004-scaffolder-task-idempotency)
  by not re-running the same function again if it was
  executed successfully on the previous run.
- `ctx.logger` - a Winston logger for additional logging inside your action
- `ctx.logStream` - a stream version of the logger if needed
- `ctx.workspacePath` - a string of the working directory of the template run
- `ctx.input` - an object which should match the `zod` or JSON schema provided in the
  `schema.input` part of the action definition
- `ctx.output` - a function which you can call to set outputs that match the
  JSON schema or `zod` in `schema.output` for ex. `ctx.output('downloadUrl', myDownloadUrl)`
- `createTemporaryDirectory` a function to call to give you a temporary
  directory somewhere on the runner, so you can store some files there rather
  than polluting the `workspacePath`
- `ctx.metadata` - an object containing a `name` field, indicating the template
  name. More metadata fields may be added later.

## Registering Custom Actions

To register your new custom action in the Backend System you will need to create a backend module. Here is a very simplified example of how to do that:

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

If your custom action requires core services such as `config` or `cache` they can be imported in the dependencies and passed to the custom action function.

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
      async init({ scaffolder, cache, config }) {
        scaffolder.addActions(
          customActionNeedingCacheAndConfig({ cache: cache, config: config }),
        );
    })
```

### Using Checkpoints in Custom Actions (Experimental)

Idempotent action could be achieved via the usage of checkpoints.

Example:

```ts title="plugins/my-company-scaffolder-actions-plugin/src/vendor/my-custom-action.ts"
const res = await ctx.checkpoint?.('create.projects', async () => {
  const projectStgId = createStagingProjectId();
  const projectProId = createProductionProjectId();

  return {
    projectStgId,
    projectProId,
  };
});
```

You have to define the unique key in scope of the scaffolder task for your checkpoint. During the execution task engine
will check if the checkpoint with such key was already executed or not, if yes, and the run was successful, the callback
will be skipped and instead the stored value will be returned.

### Register Custom Actions with the Legacy Backend System

Once you have your Custom Action ready for usage with the scaffolder, you'll
need to pass this into the `scaffolder-backend` `createRouter` function. You
should have something similar to the below in
`packages/backend/src/plugins/scaffolder.ts`

```ts
return await createRouter({
  catalogClient,
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
});
```

There's another property you can pass here, which is an array of `actions` which
will set the available actions that the scaffolder has access to.

```ts
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createNewFileAction } from './scaffolder/actions/custom';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, createNewFileAction()];

  return createRouter({
    actions,
    catalogClient: catalogClient,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}
```

## List of custom action packages

Here is a list of Open Source custom actions that you can add to your Backstage
scaffolder backend:

| Name                     | Package                                                                                                                                         | Owner                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Yeoman                   | [plugin-scaffolder-backend-module-yeoman](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend-module-yeoman)                     | [Backstage](https://backstage.io)                            |
| Cookiecutter             | [plugin-scaffolder-backend-module-cookiecutter](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend-module-cookiecutter)         | [Backstage](https://backstage.io)                            |
| Rails                    | [plugin-scaffolder-backend-module-rails](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend-module-rails)                       | [Backstage](https://backstage.io)                            |
| HTTP requests            | [scaffolder-backend-module-http-request](https://www.npmjs.com/package/@roadiehq/scaffolder-backend-module-http-request)                        | [Roadie](https://roadie.io)                                  |
| Utility actions          | [scaffolder-backend-module-utils](https://www.npmjs.com/package/@roadiehq/scaffolder-backend-module-utils)                                      | [Roadie](https://roadie.io)                                  |
| AWS cli actions          | [scaffolder-backend-module-aws](https://www.npmjs.com/package/@roadiehq/scaffolder-backend-module-aws)                                          | [Roadie](https://roadie.io)                                  |
| Scaffolder .NET Actions  | [plugin-scaffolder-dotnet-backend](https://www.npmjs.com/package/@plusultra/plugin-scaffolder-dotnet-backend)                                   | [Alef Carlos](https://github.com/alefcarlos)                 |
| Scaffolder Git Actions   | [plugin-scaffolder-git-actions](https://www.npmjs.com/package/@mdude2314/backstage-plugin-scaffolder-git-actions)                               | [Drew Hill](https://github.com/arhill05)                     |
| Azure Pipeline Actions   | [scaffolder-backend-module-azure-pipelines](https://www.npmjs.com/package/@parfuemerie-douglas/scaffolder-backend-module-azure-pipelines)       | [Parfümerie Douglas](https://github.com/Parfuemerie-Douglas) |
| Azure Repository Actions | [scaffolder-backend-module-azure-repositories](https://www.npmjs.com/package/@parfuemerie-douglas/scaffolder-backend-module-azure-repositories) | [Parfümerie Douglas](https://github.com/Parfuemerie-Douglas) |
| Snyk Import Project      | [plugin-scaffolder-backend-module-snyk](https://www.npmjs.com/package/@ma11hewthomas/plugin-scaffolder-backend-module-snyk)                     | [Matthew Thomas](https://github.com/Ma11hewThomas)           |
| JSON Merge Actions       | [plugin-scaffolder-json-merge-actions](https://www.npmjs.com/package/@mdude2314/backstage-plugin-scaffolder-json-merge-actions)                 | [Drew Hill](https://github.com/arhill05)                     |
| NPM Actions              | [plugin-scaffolder-npm-actions](https://www.npmjs.com/package/@mdude2314/backstage-plugin-scaffolder-npm-actions)                               | [Drew Hill](https://github.com/arhill05)                     |
| Slack Actions            | [plugin-scaffolder-backend-module-slack](https://www.npmjs.com/package/@mdude2314/backstage-plugin-scaffolder-backend-module-slack)             | [Drew Hill](https://github.com/arhill05)                     |
| Microsoft Teams Actions  | [plugin-scaffolder-backend-module-ms-teams](https://www.npmjs.com/package/@grvpandey11/backstage-plugin-scaffolder-backend-module-ms-teams)     | [Gaurav Pandey](https://github.com/grvpandey11)              |

Have fun! 🚀
