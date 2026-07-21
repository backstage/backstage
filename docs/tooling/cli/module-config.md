---
id: module-config
title: Config Module
description: CLI commands for inspecting and validating Backstage configuration.
---

The config module (`@backstage/cli-module-config`) provides commands for
inspecting, printing, and validating the Backstage configuration schema and
resolved values.

## config\:docs

Opens the reference documentation of your app's local configuration schema in
the browser. Use it to see what configuration values are available, what they
do, and where they get sent.

```text
Usage: backstage-cli config:docs [options]

Browse the configuration reference documentation

Options:
  --package <name>  Only include the schema that applies to the given package
  -h, --help        display help for command
```

## config\:print

Print the static configuration, defaulting to reading `app-config.yaml` in the
repo root, using schema collected from all local packages in the repo.

For example, to validate that a given configuration value is visible in the
frontend when building the `my-app` package, you can use the following:

```bash
yarn backstage-cli config:print --frontend --package my-app
```

```text
Usage: backstage-cli config:print [options]

Options:
  --package <name>   Only load config schema that applies to the given package
  --lax              Do not require environment variables to be set
  --frontend         Print only the frontend configuration
  --with-secrets     Include secrets in the printed configuration
  --format <format>  Format to print the configuration in, either json or yaml [yaml]
  --config <path>    Config files to load instead of app-config.yaml (default: [])
  -h, --help         display help for command
```

## config\:check

Validate that static configuration loads and matches schema, defaulting to
reading `app-config.yaml` in the repo root and using schema collected from all
local packages in the repo.

```text
Usage: backstage-cli config:check [options]

Options:
  --package <name>  Only load config schema that applies to the given package
  --lax             Do not require environment variables to be set
  --frontend        Only validate the frontend configuration
  --deprecated      Output deprecated configuration settings
  --strict          Ensure that the provided config(s) has no errors and does not contain keys not in the schema.
  --config <path>   Config files to load instead of app-config.yaml (default: [])
  -h, --help        display help for command
```

## config\:schema

Dump the configuration schema that was collected from all local packages in the
repo.

:::note
When run by `yarn`, supply the yarn option `--silent` if you are using the
output in a command line pipe to avoid non-schema output in the pipeline.
:::

```text
Usage: backstage-cli config:schema [options]

Print configuration schema

Options:
  --package <name>   Only output config schema that applies to the given package
  --format <format>  Format to print the schema in, either json or yaml [yaml]
  -h, --help         display help for command
```
