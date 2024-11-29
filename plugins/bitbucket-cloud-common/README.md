# @backstage/plugin-bitbucket-cloud-common

Welcome to the common package for bitbucket-cloud plugins!

This common package provides a reusable API client for the Bitbucket Cloud API
which can be reused in catalog-backend-module plugins, scaffolder modules, etc.

Using a shared client allows to control all traffic going from Backstage to
the Bitbucket Cloud API compared to separate clients or inline API calls.

We may want to leverage this later to add rate limiting, etc.

## How to maintain the generated code

### Update the Models

This command will

1. [refresh the schema/OpenAPI Specification](#refresh-the-schema)
2. [re-generate the models](#generate-models)
3. [reduce the models to the minimal needed](#reduce-models)

### Refresh the schema

This command will download the latest version of the Bitbucket Cloud OpenAPI Specification
and apply some mutations to fix bugs or improve the schema for a better code generation output.

```sh
yarn refresh-schema
```

### Generate Models

The models used are created based on the [local OpenAPI Specification file](bitbucket-cloud.oas.json)
using a code generator.
Some post-cleanup is applied to improve the generated output.

The client itself using the models is not generated.

```sh
yarn generate-models
```

### Reduce Models

In order to keep the API surface minimal, this command helps to only keep the minimal part of the
generated models by considering all `Models` module members directly or transitively used by the
client implementation.

```sh
yarn reduce-models
```

## Adding a New Client Method

If you want to add a new method to the client implementation which may use a new endpoint or "new" models
you can

1. optionally [refresh the schema](#refresh-the-schema) to get the latest version
2. and [generate the models](#generate-models).

At this point, you have **all** models usable for adding a new method using any of them.

If you are ready with your addition to the client, you can [reduce the models to the minimal needed](#reduce-models).
