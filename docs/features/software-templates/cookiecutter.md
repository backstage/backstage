---
id: cookiecutter
title: Cookiecutter
sidebar_label: Cookiecutter
description: Use Cookiecutter templates in Backstage Software Templates
---

The `@backstage/plugin-scaffolder-backend-module-cookiecutter` package adds
the `fetch:cookiecutter` action to the Scaffolder backend. The action fetches
a Cookiecutter template, renders it with the values you provide, and writes the
generated files to the task workspace.

## Installation

Install the package in your backend:

```shell title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-cookiecutter
```

Register the module alongside the Scaffolder backend in
`packages/backend/src/index.ts`:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-cookiecutter'));
```

The backend environment must have the Cookiecutter command-line tool installed
and available in `PATH`. For example, install it with `pip`:

```shell
pip install cookiecutter
```

The module runs Cookiecutter in the backend process environment. Installing it
on a developer workstation does not make it available to a separately running
backend or container. Jinja extensions specified in the template must also be
installed in that environment.

## Use the action

Add a `fetch:cookiecutter` step to a Software Template. The `url` points to the
template directory, and `values` provides the values for the prompts in its
`cookiecutter.json` file:

```yaml title="template.yaml"
steps:
  - id: fetch
    name: Generate files from a Cookiecutter template
    action: fetch:cookiecutter
    input:
      url: ./template
      values:
        project_name: ${{ parameters.name }}
        owner: ${{ parameters.owner }}
```

The action reads the template's `cookiecutter.json` defaults and combines them
with `values`. Values supplied by the action take precedence over defaults.
Generated files are written to the Scaffolder task workspace.

## Inputs

| Input               | Required | Description                                                                                              |
| :------------------ | :------- | :------------------------------------------------------------------------------------------------------- |
| `url`               | Yes      | Relative path or absolute URL pointing to the template directory.                                        |
| `values`            | Yes      | Values passed to Cookiecutter and merged with the template's `cookiecutter.json` defaults.               |
| `targetPath`        | No       | Directory in the task workspace for generated files. Defaults to the workspace root.                     |
| `copyWithoutRender` | No       | File and directory patterns to copy without rendering. Passed to Cookiecutter as `_copy_without_render`. |
| `extensions`        | No       | Jinja extensions to load when Cookiecutter runs. Passed as `_extensions`.                                |

For details on Cookiecutter templates and Jinja extensions, see the
[Cookiecutter documentation](https://cookiecutter.readthedocs.io/).
