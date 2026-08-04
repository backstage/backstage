---
id: add-to-directory
title: Add to Directory
description: Documentation on Adding Plugin to Plugin Directory
---

:::caution Legacy Documentation

This section is part of the legacy plugins documentation. The process for
adding plugins to the directory described here is still current.

:::

## Add a plugin to the directory

To add a plugin to the [plugin directory](https://backstage.io/plugins), create
a manifest in
[`microsite/data/plugins`](https://github.com/backstage/backstage/tree/master/microsite/data/plugins).

### Create the manifest

1. Name the file `<plugin-slug>.yaml`. New filenames must use lowercase
   kebab-case, for example `example-monitoring.yaml`. The directory derives the
   plugin detail route from the filename, so this example is available at
   `/plugins/example-monitoring`. Do not add a `slug` key to the manifest.

1. Add the required contributor-owned fields:

   ```yaml
   ---
   title: Example Monitoring
   author: Example Inc.
   authorUrl: https://example.com
   category: Monitoring
   description: Shows service health and deployment activity.
   documentation: https://example.com/docs/backstage
   npmPackageName: '@example/backstage-plugin-monitoring'
   addedDate: '2026-08-03'
   status: active
   ```

   Set `status` to `active` for a new entry. The audit owns later changes to
   `status`.

1. Add any optional contributor-owned fields:

   | Field          | Type         | Description                                                                                                                                                                                 |
   | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `iconUrl`      | string       | An external URL or a path relative to `microsite/static`, such as `/img/example.svg`. The default is `/img/logo-gradient-on-dark.svg`. Use only an icon that you have the right to publish. |
   | `order`        | number       | The sort priority used by the directory.                                                                                                                                                    |
   | `capabilities` | string array | The plugin capabilities from the fixed vocabulary in [Declare capabilities](#declare-capabilities).                                                                                         |
   | `setup`        | object       | Package, frontend, integration, and configuration metadata described in [Add setup instructions](#add-setup-instructions).                                                                  |

1. Do not add or edit the audit-owned `staleSince` or `snapshot` keys. A new
   entry may omit `snapshot`. The audit populates it after the manifest is
   accepted. The audit also maintains `status` after its initial `active`
   value. See [Plugin Directory Audit](./plugin-directory-audit.md) for the
   generated field contract.

### Declare capabilities

Each `capabilities` entry must be one of these values:

- `entity-card`
- `entity-content`
- `standalone-page`
- `home-page`
- `search-result`
- `techdocs-addon`
- `catalog-processor`
- `catalog-provider`
- `scaffolder-actions`
- `search-collator`
- `backend-module`
- `permissions`
- `signals`

Unknown values fail manifest validation.

### Add setup instructions

The `setup` object supports `packages`, `frontend`, `integration`, and `config`.
All setup metadata is optional.

#### Declare packages

Each `setup.packages` item has these fields:

| Field  | Type   | Description                                                |
| ------ | ------ | ---------------------------------------------------------- |
| `name` | string | The package name used in the generated `yarn add` command. |
| `role` | string | Either `frontend` or `backend`.                            |

#### Declare frontend routes and extensions

`setup.frontend.routes` and `setup.frontend.extensions` are both required when
you add `setup.frontend`, even if one of the arrays is empty. Routes appear
before extensions on the plugin detail page.

Each route has these fields:

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `name`        | string | The stable route reference name.          |
| `type`        | string | Either `provided` or `external`.          |
| `description` | string | A description of what the route connects. |

Each extension has these fields:

| Field              | Type    | Description                                            |
| ------------------ | ------- | ------------------------------------------------------ |
| `id`               | string  | The extension identifier.                              |
| `kind`             | string  | The extension kind, such as `entity-content` or `api`. |
| `description`      | string  | A description of the extension's behavior.             |
| `enabledByDefault` | boolean | Whether the extension is enabled by default.           |

#### Add static integration snippets

Each `setup.integration` item renders one static code example and has these
fields:

| Field         | Type   | Description                                                                                                             |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| `title`       | string | The snippet heading.                                                                                                    |
| `explanation` | string | The instruction shown with the snippet.                                                                                 |
| `language`    | string | The syntax-highlighting language, such as `ts` or `yaml`.                                                               |
| `source`      | string | The exact source copied by the snippet's copy button. Use a YAML block scalar when the source spans more than one line. |

For example:

```yaml
setup:
  integration:
    - title: Register the backend plugin
      explanation: Add the backend plugin to packages/backend/src/index.ts.
      language: ts
      source: |
        backend.add(import('@example/backstage-plugin-monitoring-backend'));
```

#### Add a configuration form

Set `setup.config.schema` to one recursive schema node. The directory accepts
only this JSON Schema subset:

| Node type | Supported fields                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string`  | `type`, optional string `enum`, optional string `default`, optional `description`, and optional `x-ui`.                                                                             |
| `number`  | `type`, optional number `enum`, optional number `default`, optional `description`, and optional `x-ui`.                                                                             |
| `integer` | `type`, optional integer `enum`, optional integer `default`, optional `description`, and optional `x-ui`.                                                                           |
| `boolean` | `type`, optional boolean `enum`, optional boolean `default`, optional `description`, and optional `x-ui`.                                                                           |
| `object`  | `type`, `properties` containing named schema nodes, optional `required`, optional `description`, and optional `x-ui`. Each `required` name must be unique and must name a property. |
| `array`   | `type`, one `items` schema, optional `description`, and optional `x-ui`.                                                                                                            |

Each `x-ui` object supports an optional nonempty `label` and an optional
nonempty `secretEnv`. Every schema node is strict. Keywords outside this subset,
including `$ref`, unions, `patternProperties`, and `additionalProperties`, fail
validation.

Use `x-ui.secretEnv` only on a `string` field. Do not add `default` to a secret
field. The form does not collect the secret value. It displays an immutable
`${ENVIRONMENT_VARIABLE}` placeholder and emits the same placeholder in the
generated YAML.

For example:

```yaml
setup:
  config:
    schema:
      type: object
      properties:
        example:
          type: object
          properties:
            endpoint:
              type: string
              description: Base URL of the Example API.
              x-ui:
                label: API endpoint
            token:
              type: string
              description: Token read from the environment.
              x-ui:
                label: API token
                secretEnv: EXAMPLE_API_TOKEN
          required:
            - endpoint
            - token
      required:
        - example
```

### Validate the manifest

From the repository root, install dependencies and validate every manifest:

```shell
yarn install
yarn --cwd microsite plugins:verify
```

The verifier reports the filename and field path for invalid data. The same
command runs in continuous integration (CI).

## Submission tips

- Publish the package publicly on npm before you submit the manifest.
- Link the npm package to its source repository.
- Use an npm scope that matches the author organization or user when possible.
- If a plugin has frontend and backend packages, link `documentation` to the
  primary plugin guide and declare both packages in `setup.packages`.
- Include a product screenshot in the plugin documentation when available.
