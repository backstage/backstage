---
id: 01-getting-started
title: Schema-first plugins with OpenAPI (Experimental)
description: Tutorial on how to start using OpenAPI schema-first development in your plugins.
---

# Getting started with OpenAPI in your Backstage plugins

Target Audience: Plugin developers

Difficulty: Medium

## Goal

The goal of this tutorial is to give you exposure to tools that more tightly couple your OpenAPI specification and plugin lifecycle. The tools we'll be presenting were created by the OpenAPI tooling project area and allow you to create,

1. A typed `express` router that provides strong guardrails during development for input and output values. Support for query, path parameters, and request body, as well as experimental support for headers and cookies.
2. An auto-generated client to interact with your plugin's backend. Support for all request types, parameters, and body, as well as return types. Provides a low-level interface to allow more customization by higher-level libraries.
3. Validation and verification tooling to ensure your API and specification stay in sync. Includes testing against your unit tests.

## Prerequisites

### Technical Knowledge

This tutorial assumes that you're already familiar with the following,

1. How to build a Backstage plugin.
2. `Express.js` and `Typescript`
3. OpenAPI 3.1 schemas

:::note OpenAPI Version Support
Backstage supports both OpenAPI 3.0 and 3.1 specifications. If you have existing OpenAPI 3.0 specs, we recommend that you migrate them to 3.1. You can use `oasdiff upgrade spec.yaml` to automate this conversion. The main changes are:

- Replace `nullable: true` with `type: ['string', 'null']` or use `anyOf`/`oneOf`
- Remove `allowReserved` from path parameters (only valid on query/cookie parameters in 3.1)
  :::

### Setting up

Install `@backstage/repo-tools` in the _root_ of your workspace. This package contains all OpenAPI-related commands for your plugins and will be used throughout the tutorial.

For breaking change detection (`package schema openapi diff`), you also need the `oasdiff` CLI installed on your system. See the [oasdiff installation instructions](https://github.com/oasdiff/oasdiff#installation).

Further, a `java` binary has to be available on your PATH.

## Storing your OpenAPI specification

You should create a new folder, `src/schema` in your backend plugin to store your OpenAPI (and any other) specifications. For example, if you're adding a specification to the catalog plugin, you would add a `src/schema` folder to `plugins/catalog-backend`, making a `plugins/catalog-backend/src/schema` directory. This directory should have an `openapi.yaml` file inside.

> Currently, only the `.yaml` extension is supported, not `.yml`.

## Generating a typed express router from a spec

Run `yarn backstage-repo-tools package schema openapi generate --server` from the directory with your plugin. This will create a `router.ts` file in the `src/schema/openapi/generated` directory that contains the OpenAPI schema as well as a factory function for a generated express router with types that match your schema.

You should add this command to your `package.json` for future use and you can combine both the server generation and the client generation below like so, `yarn backstage-repo-tools package schema openapi generate --server --client-package <clientPackageDirectory>`

Use it like so, update your `router.ts` or `createRouter.ts` file with the following content,

```diff
+ import { createOpenApiRouter } from '../schema/openapi';
- import Router from 'express-promise-router';

...
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
+ const router = await createOpenApiRouter();
- const router = Router();
```

## Generating a typed client from a spec

From your current backend plugin directory, run `yarn backstage-repo-tools package schema openapi generate --client-package <plugin-client-directory>`. `<plugin-client-directory>` is a new directory and npm package that you should create. The general pattern is to add a new entry point to your plugin's common package, `plugins/<plugin-name>-common/client`. You should add this command to your `package.json` for future use.

The generated client will have a directory `src/schema/openapi/generated` that exports a `DefaultApiClient` class and all generated types. You can use the client like so,

```diff
+ import { DefaultApiClient } from '../schema/openapi/generated';

export class CatalogClient implements CatalogApi {
+ private readonly apiClient: DefaultApiClient;

  constructor(options: {
    discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
    fetchApi?: { fetch: typeof fetch };
  }) {
+    this.apiClient = new DefaultApiClient(options);
  }
  ...
```

usage of the types will depend on your type names.

You should be able to use the generated `DefaultApi.client.ts` file out of the box for your API needs. For full customization, you can use a wrapper around the generated client to adjust the flavour of your clients.

For more information, see [the docs](./generate-client.md).

## Validating your spec with test traffic

Add the following lines to your `createRouter.test.ts` or `router.test.ts` file,

```diff
+ import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
+ import type { Server } from 'node:http';

...

describe('createRouter', () => {
- let app: express.Express;
+ let app: Server;

...

- app = express().use(router);
+ app = await wrapServer(express().use(router));
```

This sets up a proxy that captures all requests and responses and validates them against your OpenAPI spec during tests. Any mismatches between your spec and actual API behavior will be reported as test failures.

For more information, see [the docs](./test-case-validation.md).
