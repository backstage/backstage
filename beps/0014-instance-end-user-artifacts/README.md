---
title: Instance End-User Artifacts (CLI and SDK)
status: implementable
authors:
  - '@Sarabadu'
owners:
project-areas:
  - core
creation-date: 2026-04-09
---

# BEP: Instance End-User Artifacts (CLI and SDK)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [New Package Roles](#new-package-roles)
  - [The CLI Artifact](#the-cli-artifact)
    - [packages/cli entry point](#packagescli-entry-point)
    - [createSdkPlugin — the primary extension point](#createsdkplugin--the-primary-extension-point)
    - [SDK services](#sdk-services)
    - [CLI commands — a thin layer over SDK methods](#cli-commands--a-thin-layer-over-sdk-methods)
  - [The SDK Artifact](#the-sdk-artifact)
    - [packages/sdk entry point](#packagessdk-entry-point)
  - [SDK as the Primary Extension Point, CLI as a Consumer](#sdk-as-the-primary-extension-point-cli-as-a-consumer)
  - [TechDocs Preview](#techdocs-preview)
  - [Distribution](#distribution)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

A Backstage instance today produces two artifacts consumed by end users: a **frontend** (web app) and a **backend** (API server). Both are composable from plugins and fully customizable per instance — an instance's theme, entity types, scaffolder actions, and TechDocs addons all shape what end users see and do. This BEP proposes extending that model to new interaction surfaces, so that end users can interact with a Backstage instance in different ways while the instance preserves its identity and customizations across all of them.

Concretely, this means two new instance-owned artifact types:

- **`packages/cli`** — a composable, instance-customized CLI binary (`<instance>-cli`) where Backstage plugins contribute end-user-facing commands (e.g., `mybackstage-cli docs preview`, `mybackstage-cli catalog get my-service`, `mybackstage-cli scaffold run`).
- **`packages/sdk`** — a composable, typed client library (`<instance>-sdk`) that external systems can import to interact with a Backstage instance programmatically with full type safety (e.g., `MyBackstageInstance.notifications.push(...)`, `MyBackstageInstance.catalog.getEntity(...)`).

## Motivation

Today, tools like `@backstage/techdocs-cli` ship a hardcoded embedded Backstage app for previewing documentation locally. If an instance has custom TechDocs addons or a custom theme, the preview experience diverges from the real instance — it is a generic Backstage, not _your_ Backstage. Even if is possible to configure different local apps the experience for final users gets more complex.

Similarly, catalog YAML authors who want early validation feedback in CI must either call raw backend APIs directly or write ad-hoc scripts, with no access to instance-specific entity types or custom field validation.

Attempts to build plugin-specific CLIs (such as the `scaffolder-cli` proposed in [#26952](https://github.com/backstage/backstage/pull/26952)) face the same pattern: each plugin authors a standalone binary using commander.

TODO: lost a comment were someone was already trying something similar to this in their instance, will try to find it again and link here.

For the end user there is no scaffolder and techdocs its just MyBackstageInstance and the same **single pane of glass** perceived in the ui would be nice to be perceived on other interactions

### Goals

**Backstage instance should have a consistent identity and customization model regardless of what surface a user interacts through** — browser, CLI, or library. By introducing composable CLI and SDK artifact types — using the same plugin model that already governs the frontend and backend — instance maintainers gain a first-class mechanism to extend Backstage's reach to every developer interaction surface while keeping the instance's identity intact.

- Enable end users to interact with a Backstage instance through multiple surfaces (CLI, SDK) while the instance preserves its identity — its name, its customizations, and its plugin-contributed capabilities — across all of them.
- Provide a better channel to automate interactions with a Backstage instance from CI pipelines, scripts, and external systems via a typed SDK or CLI call, rather than ad-hoc HTTP calls.

### Non-Goals

- Replacing or modifying the existing `backstage-cli` maintainer tooling (`cli-module-*` packages). The new artifacts target end users; the existing `backstage-cli` targets instance maintainers.
- Defining a single universal distribution mechanism. Distribution is the responsibility of the instance maintainer in the same way it is the deployment of the instance itself.
- Replacing existing plugin-specific CLIs (e.g., `@backstage/techdocs-cli`) immediately. Existing tools remain functional as we cannot assume this publishing of internal libraries is that common for each organization.

## Proposal

Introduce two new composable instance artifact types — SDK and CLI — that extend the Backstage plugin model to new interaction surfaces. The **SDK is the primary artifact**: plugins contribute typed client methods that expose the instance's capabilities programmatically. The **CLI is a consumer of the SDK**: it wraps SDK methods with argument parsing and output formatting, giving end users a command-line interface to the same capabilities without duplicating any logic.

Each artifact lives in a package under `packages/` in the instance monorepo, alongside `packages/app` and `packages/backend`. The instance maintainer controls the composition by adding plugin packages, names the resulting binaries and packages after the instance, and publishes them to the organization's chosen registry. End users install and use tools that carry the instance's identity — not generic Backstage tooling.

## Design Details

### New Package Roles

The following new values are added to `PackageRole`:

| Role                | Description                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `cli-plugin`        | A plugin package contributing SDK methods (and by extension, CLI commands) for end-user-facing instance artifacts |
| `cli-plugin-module` | A module extending a `cli-plugin` with additional SDK methods                                                     |

The existing `cli` and `cli-module` roles remain unchanged and continue to refer to maintainer-facing tooling (`backstage-cli` modules).

### The CLI Artifact

#### `packages/cli` entry point

A new instance package scaffolded by `yarn new --select cli`. Its entry point mirrors `packages/backend/src/index.ts`:

```ts
import { createCli } from '@backstage/cli-app-api';

const cli = createCli();

cli.add(import('@backstage/plugin-auth-cli'));
cli.add(import('@backstage/plugin-catalog-cli'));
cli.add(import('@backstage/plugin-techdocs-cli'));
cli.add(import('@backstage/plugin-scaffolder-cli'));
cli.add(import('@backstage/plugin-notifications-cli'));

// Instance-specific customization
cli.add(import('./customCatalogModule'));

cli.run();
```

The resulting binary is named by the instance (e.g., `mybackstage-cli`) via `package.json#bin`.

#### `createSdkPlugin` — the primary extension point

Plugin packages with role `cli-plugin` export a default using `createSdkPlugin()`, which mirrors `createBackendPlugin()`. This is the sole framework extension point for both the SDK and CLI artifacts:

```ts
import { createSdkPlugin } from '@backstage/cli-plugin-api';

export default createSdkPlugin({
  pluginId: 'catalog',
  register(reg) {
    reg.addMethods({
      getEntity: (ref: string, ctx) => fetchEntity(ref, ctx.fetch),
      queryEntities: (filter, ctx) => queryEntities(filter, ctx.fetch),
      validate: (yaml: string, ctx) => validateCatalogYaml(yaml, ctx.fetch),
    });
  },
});
```

Modules extend plugins with additional methods:

```ts
import { createSdkModule } from '@backstage/cli-plugin-api';

export default createSdkModule({
  pluginId: 'catalog',
  register(reg) {
    reg.addMethods({
      importLocation: (target: string, ctx) =>
        importLocation(target, ctx.fetch),
    });
  },
});
```

#### SDK services

SDK method implementations receive a context with access to:

- **`auth`** — wraps the existing `CliAuth` from `@backstage/cli-node`. Provides `getAccessToken()`, `getBaseUrl()`. The underlying multi-instance storage (`~/.config/backstage-cli/auth-instances.yaml`) is shared with the maintainer CLI, so a single `backstage-cli auth login` covers both.
- **`fetch`** — authenticated HTTP client, pre-configured with the instance base URL and auth token.

```ts
// packages/cli-plugin-api (new)
export interface SdkMethodContext {
  auth: CliAuth;
  fetch: typeof fetch; // authenticated, base-URL-aware
}
```

#### CLI commands — a thin layer over SDK methods

The `packages/cli` entry point uses the same `cli-plugin` packages as `packages/sdk`. When `cli.run()` is called, the CLI layer maps each registered SDK method to a command by convention, or plugin authors can provide explicit CLI wrappers for commands that require interactive behavior (prompts, spinners, confirming destructive actions):

A `catalog get <ref>` command calls `MyBackstageInstance.catalog.getEntity(ref)` and formats the result as a table or JSON. A `catalog validate <file>` command reads the YAML file and calls `MyBackstageInstance.catalog.validate(content)`. No API logic lives in the CLI layer itself — only argument parsing and output formatting.

The resulting binary is named by the instance (e.g., `mybackstage-cli`) via `package.json#bin`.

### The SDK Artifact

#### `packages/sdk` entry point

A new instance package scaffolded by `yarn new --select sdk`:

```ts
import { createSdk } from '@backstage/sdk-app-api';

const sdk = createSdk();

sdk.add(import('@backstage/plugin-catalog-cli'));
sdk.add(import('@backstage/plugin-notifications-cli'));
sdk.add(import('@backstage/plugin-scaffolder-cli'));

export const MyBackstageInstance = sdk.build();
export type MyBackstageInstanceType = typeof MyBackstageInstance;
```

The resulting package is published to the organization's registry. External consumers install it:

```ts
import { MyBackstageInstance } from '@myorg/mybackstage-sdk';

const entity = await MyBackstageInstance.catalog.getEntity(
  'component:default/my-service',
);
await MyBackstageInstance.notifications.push({
  title: 'Done',
  recipients: ['user:default/alice'],
});
const task = await MyBackstageInstance.scaffolder.runTemplate(
  'template:default/create-repo',
  { name: 'my-new-repo' },
);
```

The existing `@backstage/catalog-client` — which exposes a fully typed `CatalogClient` class backed by an OpenAPI-generated HTTP layer — serves as the reference model for how plugin SDK contributions should be structured. Each plugin's SDK methods may be hand-crafted against the plugin's API, generated from its OpenAPI spec, or a combination of both.

`createSdk().build()` aggregates the registered methods from all plugins into a single typed object keyed by `pluginId`:

```ts
// Resulting type (inferred, not hand-written)
type MyBackstageInstanceType = {
  catalog: { getEntity(ref: string): Promise<Entity>; queryEntities(...): Promise<QueryEntitiesResponse>; validate(yaml: string): Promise<ValidationResult>; };
  notifications: { push(payload: NotificationPayload): Promise<void>; };
  scaffolder: { runTemplate(templateRef: string, values: Record<string, unknown>): Promise<TaskRef>; };
};
```

### Configuration and Customization

We could rely on extewnsion configuration similart to the NFS, where maintainer after adding a plugin can cuztomize or disable specific SDK methods or CLI commands by providing configuration in `app-config.yaml`.

```yaml
cli:
  extensions:
    catalog:getEntity: false
    catalog:getEntities:
      defaultFilter:
        kind: Component
```

### SDK as the Primary Extension Point, CLI as a Consumer

The SDK is where plugin logic lives. The CLI does not have its own extension point — it is a consumer of SDK methods. This mirrors how the best tools in the ecosystem are structured: `stripe-node` is the library, the `stripe` CLI calls its methods; `@octokit/rest` is the library, the `gh` CLI builds on top.

In practice: the `catalog get` CLI command calls `MyBackstageInstance.catalog.getEntity()`, formats the result as a table or JSON, and exits. The command contains no API logic — only argument parsing and output formatting. This means:

- Plugin authors write SDK methods once and get CLI commands as a thin layer on top.
- The SDK surface is independently useful to external systems (CI pipelines, scripts, integrations) without installing the CLI binary.
- Instance maintainers add a plugin once and get both surfaces.
- Interactive-only CLI behaviors (prompts, progress spinners, confirming destructive actions) that have no SDK equivalent are implemented as CLI-only wrappers around SDK calls, not as a separate plugin extension point.

The `createSdkPlugin()` API is therefore the sole framework extension point. `createCli()` is a composition tool that reads SDK method registrations and produces CLI commands from them by convention.

### TechDocs Preview

The existing `@backstage/techdocs-cli` ships a hardcoded embedded Backstage app (`techdocs-cli-embedded-app`) that does not reflect an instance's custom theme or TechDocs addons. With the CLI artifact:

`@backstage/plugin-techdocs-cli` contributes a `docs preview` command that serves a local embedded app. The embedded app is not hardcoded — it reads from a `packages/techdocs-preview-app` package in the instance, which the maintainer customizes exactly like `packages/app`:

```ts
// packages/techdocs-preview-app/src/App.tsx (instance-owned)
const app = createApp({
  features: [
    techdocsPlugin,
    myCustomThemeModule, // instance-specific
    myCustomAddonModule, // instance-specific
  ],
});
```

The `docs preview` command references this package at build time, bundling it into the CLI artifact. End users running `mybackstage-cli docs preview ./my-docs` see a preview that closely matches the real instance.

### Distribution

The instance maintainer is responsible for distributing the CLI and SDK artifacts to their organization. Backstage provides the build and composition infrastructure; the distribution channel is left to the maintainer.

The framework would need to provide examples on how to build and distribute the generated artifacts.

## Release Plan

**Phase 1 — Core framework (alpha)**

TBD

## Dependencies

TBD

## Alternatives

### Instance-specific CLI without a framework (ad-hoc today)

Instance maintainers can already write a Node.js CLI today using any framework (commander, yargs, oclif) and publish it runing different shell command to interact with plugin specific cli.

### Generate the SDK entirely from OpenAPI specs

`@backstage/repo-tools` already supports OpenAPI spec generation and typed client codegen, and `@backstage/catalog-client` includes an OpenAPI schema with a generated `DefaultApiClient`. A fully generated SDK would stay in sync automatically. However, the backend API not always cover things like techdocs preview.
