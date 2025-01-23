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
3. OpenAPI 3.0 schemas

### Setting up

There are two required npm packages before we start,

1. `@backstage/repo-tools`, this package contains all OpenAPI-related commands for your plugins. We will be using this throughout the tutorial.
2. `@useoptic/optic`, this package is a dependency of `@backstage/repo-tools` but is only required for OpenAPI-related commands.

You should install both of the above packages in the _root_ of your workspace.

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
+ import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils/testUtils';
+ import { Server } from 'http';

...

describe('createRouter', () => {
- let app: express.Express;
+ let app: express.Express | Server;

...

- app = express().use(router);
+ app = wrapInOpenApiTestServer(express().use(router));
```

This adds a wrapper around the express server that allows it to reroute traffic for `supertest`. Run `yarn backstage-repo-tools package schema openapi init` to create some required files. Now, when you run `yarn backstage-repo-tools repo schema openapi test` your schema will now be tested against your test data. Any errors will be reported.

Our command is a small wrapper over [`Optic`](https://github.com/opticdev/optic) which does all of the heavy lifting.

For more information, see [the docs](./test-case-validation.md).
