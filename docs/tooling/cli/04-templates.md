---
id: templates
title: CLI Templates
description: Overview of the new CLI Declarative Templates
---

The `backstage-cli new` command is now configurable through your root `package.json`.
You can also create and add your own CLI templates.

## Basic Configuration

```json
{
  "name": "root",
  "backstage": {
    "cli": {
      "defaults": true,
      "globals": {
        "license": "MIT"
      },
      "templates": []
    }
  }
}
```

- `defaults` - This toggles the inclusion of default templates.
  - If not configured, the default value is true, meaning all the built-in CLI templates will be included by default.
  - Setting this to false excludes all built-in templates so use this setting if you want to rely solely on custom templates.
- `globals` - Configures default values for every generated package and plugin.
  - These values populate placeholders in your skeleton template files.
  - You can provide a default value in globals and still include a user prompt for the same key. In such cases, the user-provided value will take precedence.
- `templates` - Specifies custom templates.
  - See [Creating your own CLI Templates](#creating-your-own-cli-templates) for more information.

## Creating your own CLI Templates

Your first step in creating your own CLI template is composing your yaml file:

```yaml
# ./custom-template.yaml
description: Description of my CLI template
template: ./template # required
targetPath: packages # required

suffix: hello
backendModulePrefix: true

prompts:
  - id # required
additionalActions:
  - install-backend
```

There are three required properties:

- `template` - Path to the skeleton files of your template.
- `targetPath` - Directory where the package of plugin will be created. For a plugin template, you would want to use `plugins` if that's where you keep all of your other Backstage plugins.
- `prompts.id` - Configures prompts to gather user input. The `id` prompt is required for all templates. See [Prompts](#prompts) for more details.

Optional configurations include:

- `suffix` - Adds a suffix to package/plugin names. For example, a suffix of `hello` results in `${plugin-id}-hello`.
- `backendModulePrefix` - Setting this to `true` will apply the naming pattern for backend modules: `{plugin_id}-backend-module-{module_id}`.
  - This setting will require that you have `moduleid` as one of the prompts.
  - This setting takes higher precedence over `suffix`, so if you were to configure both, it would only apply the backend module prefix and ignore `suffix`.
- `additionalActions` - There might be additional steps you want taken after your package is generated. See [Additional Actions](#additional-actions) for more details.

Once you have your composed template yaml file, add your new template to the CLI config in your root `package.json`:

```diff
{
  // ...
  "backstage": {
    "cli": {
      // ...
+       "templates": [
+         {
+           "id": "my custom CLI template",
+           "target": "./custom-template.yaml"
+         }
+       ]
    }
  }
}
```

If you'd like to see more examples, you can find all the default templates and its yaml files [here](https://github.com/backstage/backstage/tree/master/packages/cli/templates).

### Prompts

Prompts elicit values from users and replace variables in skeleton templates.

There are four pre-defined prompts:

```yaml
prompts:
  - id
  - moduleid
  - npmregistry
  - owner
```

If your template requires more information, you can also configure your own custom prompts:

```yaml
prompts:
  - id: color
    prompt: Enter your favorite color
    default: red
    validate: backstage-id
```

- `id` - The `id` is the value that will be applied to your template. An `id` of `color`, like in the example above, will be used to replace placeholder values you configure in your skeleton template:
  ```ts
  // ./template/index.ts.hbs
  console.log('My favorite color is {{color}}');
  ```
- `prompt` - The `prompt` value is the text that is displayed to the user:
  ```
  ? What do you want to create? custom-template
  ? Enter the ID of the plugin [required] my-plugin
  ? Enter your favorite color (red)
  ```
- `default` - You can also provide a `default` value for the convenience of the user.
- `validate` - There is only one built-in validator at the moment and it is `backstage-id`. The `backstage-id` validator enforces the user-provided value to be all lowercase and only contain letters, digits, and dashes.

### Additional Actions

Additional actions are useful for running tasks. For example, if you want your newly created package to be automatically added as a dependency to `packages/backend/package.json` so that your users won't have to do so manually, you could add `install-backend` as one of the `additionalActions` to your template.

There are four `additionalActions`:

|        Action         | Description                                                            |
| :-------------------: | :--------------------------------------------------------------------- |
|  `install-frontend`   | Installs your new package/plugin as a dependency to `packages/app`     |
| `add-frontend-legacy` | Adds your new frontend plugin to `packages/app/src/App.tsx`            |
|   `install-backend`   | Installs your new package/plugin as a dependency to `packages/backend` |
|     `add-backend`     | Adds your module/extension/plugin to `packages/backend/index.ts`       |
