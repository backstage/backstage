---
id: templates
title: CLI Templates
description: Overview of the new CLI Declarative Templates
---

The behavior of the `backstage-cli new` command is configurable through your root `package.json`, and you can also create and add custom CLI templates to suit your needs.

## Basic Configuration

```json
{
  "name": "root",
  "backstage": {
    "cli": {
      "new": {
        "globals": {
          "license": "MIT",
          "namePrefix": "@my-org/"
        }
      }
    }
  }
}
```

- `globals` - Configures input for all generated packages and plugins.
  - `version` - Sets the value of the `version` field in `package.json` of all generated packages. Defaults to `0.1.0`.
  - `license` - Sets the value of the `license` field in `package.json` of all generated packages. Defaults to `Apache-2.0`.
  - `private` - Sets the value of the `private` field in `package.json` of all generated packages. Defaults to `true`.
  - `publishRegistry` - Sets the value of the `publishConfig.registry` field in `package.json` of all generated packages.
  - `namePrefix` - The prefix used to generate the full package name. Defaults to `@internal/`.
  - `namePluginInfix` - The infix used to generate the full package name for plugin packages. Defaults to `plugin-`.
- `templates` - Specifies custom templates.
  - See [Installing custom templates](#installing-custom-templates) and [Creating your own CLI templates](#creating-your-own-cli-templates) for more information.

The generated package name is based on the `namePrefix` and `namePluginInfix` globals, as well as the "base name" which is derived from the package role and user input. For plugin packages the final package name will be `<namePrefix><namePluginInfix><baseName>`, and for other packages it will be `<namePrefix><baseName>`.

For example, if you want your plugin frontend packages to end up with the name `@acme/backstage-plugin-<pluginId>`, you should use the following configuration:

```json
{
  "name": "root",
  "backstage": {
    "cli": {
      "new": {
        "globals": {
          "namePrefix": "@acme/",
          "namePluginInfix": "backstage-plugin-"
        }
      }
    }
  }
}
```

## Installing custom templates

Custom templates can be installed from local directories. To install a template you add it to the `backstage.cli.new.templates` configuration array in your root `package.json`:

```json
{
  "name": "root",
  "backstage": {
    "cli": {
      "new": {
        "templates": ["./templates/custom-plugin"]
      }
    }
  }
}
```

Each entry in the `templates` array should be a relative path that points to a directory containing a `portable-template.yaml` file. If the path starts with `./` it will be used as is, otherwise it will be resolved as a module within `node_modules`.

When defining the `templates` array it will override the default set of templates. If you want to keep using one of the build-in templates in the Backstage CLI you can reference them directly within the CLI package. This following is the full list of built-in templates:

```json
{
  "name": "root",
  "backstage": {
    "cli": {
      "new": {
        "templates": [
          "@backstage/cli/templates/frontend-plugin",
          "@backstage/cli/templates/backend-plugin",
          "@backstage/cli/templates/backend-plugin-module",
          "@backstage/cli/templates/plugin-web-library",
          "@backstage/cli/templates/plugin-node-library",
          "@backstage/cli/templates/plugin-common-library",
          "@backstage/cli/templates/web-library",
          "@backstage/cli/templates/node-library",
          "@backstage/cli/templates/scaffolder-backend-module"
        ]
      }
    }
  }
}
```

## Creating your own CLI templates

Each template lives in its own directory and must have a `portable-template.yaml` file that describes the template. The template directory can also contain any files that should be templated or copied to the generated package.

Start by creating `portable-template.yaml` in a new directory somewhere in your project, in this example we're using `./templates/custom-plugin/portable-template.yaml`:

```yaml title="in templates/custom-plugin/portable-template.yaml"
name: custom-plugin
role: frontend-plugin
description: Description of my CLI template # optional
values: # optional
  pluginVar: '{{ camelCase pluginId }}Plugin'
```

The following properties are supported:

- `name` **(required)** - The name of your template, used by the user to select it.
- `role` **(required)** - The role of the template, similar to package role. See [Template Roles](#template-roles) for more details.
- `description` - A description of the type of package that this template produces.
- `values` - A map of additional values that will be present during templating. The values are themselves templated and can reference other values. If the key matches any of the user prompts, such as `pluginId`, the value will be used directly instead of prompting the user.

Next, add any other files you want to be part of the template to the same directory. All files will be copied as is, except any files with a `.hbs` extension. They will be treated as [Handlebars](https://handlebarsjs.com/) templates and will be rendered with the values from the `portable-template.yaml` file as well as additional prompts such as `pluginId`. For example, you could create a `src/index.ts` file with the following content:

```typescript title="in templates/custom-plugin/src/index.ts.hbs"
export function getPluginId() {
  return '{{ pluginId }}';
}
```

If you'd like to see more examples, you can find all the default templates and their yaml files [here](https://github.com/backstage/backstage/tree/master/packages/cli/templates).

Once your template is ready, [add it to your config](#installing-custom-templates), and you should now be able to select it when running `yarn new`.

### Template Roles

The `role` property in the template yaml file is used to determine what input will be gathered for the template, as well as what actions will be taken after the new package has been created. The following roles are supported:

| Role                     | Prompts                | Output Directory | Additional Actions                                                                |
| :----------------------- | :--------------------- | :--------------- | :-------------------------------------------------------------------------------- |
| `frontend-plugin`        | `pluginId`             | `plugins`        | Add dependency to `packages/app` and entry to `packages/backend/src/App.tsx`      |
| `frontend-plugin-module` | `pluginId`, `moduleId` | `plugins`        | Add dependency to `packages/app`                                                  |
| `backend-plugin`         | `pluginId`             | `plugins`        | Add dependency to `packages/backend` and entry to `packages/backend/src/index.ts` |
| `backend-plugin-module`  | `pluginId`, `moduleId` | `plugins`        | Add dependency to `packages/backend` and entry to `packages/backend/src/index.ts` |
| `web-library`            | `name`                 | `packages`       | none                                                                              |
| `node-library`           | `name`                 | `packages`       | none                                                                              |
| `common-library`         | `name`                 | `packages`       | none                                                                              |
| `plugin-web-library`     | `pluginId`             | `plugins`        | none                                                                              |
| `plugin-node-library`    | `pluginId`             | `plugins`        | none                                                                              |
| `plugin-common-library`  | `pluginId`             | `plugins`        | none                                                                              |
