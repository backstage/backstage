---
title: CLI Modularization
status: provisional
authors:
  - '@aramissennyeydd'
owners:
  - '@aramissennyeydd'
project-areas:
  - core
creation-date: 2024-05-25
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: CLI Modularization

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

The Backstage CLI is continuing to expand and evolve. Recently, there has been a new wave of CLI proposals, like catalog customization or API integrations that require more information about your Backstage instance. The CLI is also continuing to pick up more and more dependencies (80), which may sit in unused code paths causing CLI bloat. In order to best support a leaner, more extensible CLI, we propose a new modular CLI approach. The modular CLI will build on the new backend abstractions and let users install plugins/modules/services into their CLI, while still using the same `backstage-cli` command they're familiar with. To adapt to different workloads, we propose a new CLI profiles concept that lets you define separate CLI profiles to run, letting you create purpose-built CLIs for CI validation or local development.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

As a user/integrator/admin, I would like to be able to add functionality to the Backstage CLI. Examples of this might be wanting additional templates for creating plugins, new build plugins, entity catalog validation, etc. While I could create my own CLI that sits on top of or adjacent to the Backstage CLI, that's confusing for users and means that I have to own the scaffolding of that new CLI.

As a 3rd party plugin developer, I'd also like to be able to write CLI plugins that can be easily integrated with a customer's Backstage CLI instance. Owning a completely separate CLI is cumbersome and can be a poor DX, as can owning the integration layers for communicating with a Backstage instance. By building a plugin instead of an entire new CLI, I get a full CLI experience and I can tie into standard dependencies for the integration layers for free.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

1. No breaking changes to the current functionality of the Backstage CLI.
1. Integrators can define CLI plugins that add functionality to the Backstage CLI.
1. Users and integrators are able to install plugins into the CLI.
1. Users can write plugins locally and install them into the CLI.
1. Users will still be able to use the existing `backstage-cli` command.
1. Shared dependency management, like peer dependencies, should work as expected.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

1. CLI packaging, the ability to use this CLI outside of your local Backstage repo for personalized tasks.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

A new core for the Backstage CLI that enables modularization of the CLI. This should build off of the existing new backend system, leveraging its API wherever possible to reduce duplication of work and confusion around API shape. Some services will need to be adjusted to fit into the new CLI system, and others will need to be added to support newer workflows. Performance will also need to be prioritized as slow initialization times for the backend are noticeable once, slow CLI initialization will be consistently noticed whenever commands are run.

A new declarative installation method for plugins to be added to the CLI. Inspired by `Rushstack`'s [`rush-plugins` architecture](https://rushjs.io/pages/maintainer/using_rush_plugins/), users will define a new `cli-config.yaml` file with a map of profile names to plugin names and entry points. To solve the problem of peer dependencies and dependency management in general for the CLI, we propose creating a new `packages/cli` package that holds a `package.json` with the installed plugins. This package will not have any Typescript code nor executables and will simply define the dependencies needed for your modular CLI.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Plugin Abstractions

Reusing the existing new backend system's plugin/module/service abstractions for the new modular CLI is key to providing a familiar interface and not reinventing the wheel. While there is some small differences, the overall structure and abstractions should be comparable.

#### Backend Adjustments

While we can reuse many of the types and setup code for the `BackstageBackend` class, we need to adjust its initialization to not start a permanent waiting loop and pull out some of the shared functionality for plugin registration. we propose a set of new classes to store shared functionality,

```ts
// This could probably be shared across CLI and server implementations.
interface Initializer {
  serviceRegistry: ServiceRegistry;
  featureRegistry: FeatureRegistry;

  // Create all of the required dependencies for the backend.
  initialize(): Promise<void>;
}

// This would need to be extended for CLI and server.
interface Backend {
  // Start the server/CLI.
  start(): Promise<void>;

  // Stop the server/CLI, for CLI this will be called immediately.
  stop(): Promise<void>;
}

// Similar to the ServiceRegistry, having a single store of features allows the logic to be shared.
// Features refers to plugins and modules only. This would mostly be the logic in #doStart on BackendInitializer.
interface FeatureRegistry {
  serviceRegistry: ServiceRegistry;

  add(feature: BackendFeature | Promise<BackendFeature>): Promise<void>;

  // Get a specific feature by ID.
  get(pluginId: string, moduleId?: string): Promise<BackendFeature | undefined>;

  getAll(): Promise<BackendFeature[]>;
}
```

#### Services

##### Existing Services

Many of the existing shared services can be reused. Of those that cannot,

###### `rootConfigService`

The Backstage CLI currently doesn't ship with config information and doesn't require to be run in your local Backstage repo. We'll need some way of setting the URL of your Backstage instance, for plugins that require direct communication. We propose a `backstage-cli config set` command to set config, including Backstage instance URL, that writes to your `cli-config.yaml` file either in your git repo or globally.

##### New Services

The following new services would need to be added:

###### Identity Service

This service is intended to be used with [external auth](../0007-auth-external-services/README.md) to return a longer lasting user session that can be stored locally and used in HTTP calls to your Backstage instance.

```ts
interface LocalIdentityService {
  // Similar to the AWS CLI, allow users to set an auth token that's stored to disk.
  storeToken(token: string): Promise<void>;

  // Return the token stored on disk, throw if it isn't present.
  getToken(): Promise<string>;

  // Does the user have a token set?
  hasToken(): Promise<boolean>;
}
```

###### CLI Services

These services let users register commands with the CLI. It would be based on the `commander` API.

:::note

Having a standard service layer will let us further control what our CLIs should look like. We recommend moving towards a standard `[command] [subcommand]` format which is widely used across the Backstage CLI and repo tools. There are a few stragglers like `versions:bump`, `versions:migrate`, etc that can be aliased to point to the new commands.

:::

```ts
// Allow users to register top level commands with the program.
interface RootProgramService {
  command(commandAndArgs: string, description: string): PluginCommandService;

  // Alias the first argument to be called as the second argument.
  alias(command: string, newCommand: string);
}

// A scoped command with the pluginId as the command name.
interface PluginCommandService extends Command {}

// Allow users to register commands under specific commands (of arbitrary depth).
interface Command {
  command(commandAndArgs: string, description: string): Command;
  action(
    argument: string,
    description: string,
    processingFn?: () => void,
    defaultValue?: string,
  ): Command;
  action(handler: () => void | () => Promise<void>): void;
}
```

Usage:

```ts
createCliPlugin({
  pluginId: 'package',
  deps: {
    program: services.cliProgramService,
  },
  register({ program }) {
    // TODO: Figure out the best way to have commands register underneath a separate package.
    program.command('package');
  },
});
```

#### Plugins

What do plugins and modules mean in a CLI system?

A plugin should continue to be a unit of self-contained functionality. It may have a top level CLI command, like `package`, `repo`, `api`, or `catalog`, but that is not required. If plugins define a top-level CLI command, they own the entire subtree of commands, i.e. `[command] [...subtree]`.

A module ties a plugin to another plugin. The only way to register new sub commands is through modules. If those modules register subcommands, then they in turn own that subcommand and its subtree, i.e. `[command] [subcommand] [...subtree]`. It can also add functionality to other plugins through extension points.

##### Default Plugins

By default, we propose having the following plugins installed, `package` and `repo`.

For functionality that targets a single package, providing a standard `package` top-level command interface to add sub commands is helpful for organizing our information architecture as well as providing a good example of what the plugin/module split can look like.

Similar to `package`, for commands that target the entire repository, like `test`, we should provide a standard interface.

### CLI Installation

There are 2 goals with this design,

1. Not require a new `backstage-cli` executable to be created and distributed.
1. Rely on existing module resolution technology by using a `package.json` to declare the dependencies to install.

#### Declaring your CLI

We propose a new file, `cli-config.yaml` that will serve as both your declarative installation format and your config store (mentioned above in [`rootConfigService`](#rootconfigservice)). That file will have the following "schema":

```ts
interface CliConfigYaml {
  app?: {
    baseUrl?: string;
  };

  backend?: {
    baseUrl?: string;
  };

  cli?: {
    profiles?: {
      [key: string]: {
        // The package name of the package that contains your dependency information.
        // Separate profiles can have separate packages to reduce dependency bloat.
        entrypoint: string;

        // A list of plugins and their entrypoints to install into the CLI.
        plugins: {
          // The name of the plugin install, should match a key in the package.json.
          name: string;

          // Which file to use the default export of to install the above plugin? Defaults to `dist/index.js`
          entrypoint?: string;
        }[];
      };
    };
  };
}
```

The CLI will start with the `default` profile, unless a `--profile` parameter is passed during execution, in which case we will instead load from that profile instead. In order to make the launch of this new modular CLI not a massive breaking change, we propose the creation of a new package, `@backstage/cli-default-profile` that contains the previous plugins that were bundled with the pre-modular CLI. Users that want to customize their CLI, we recommend using `@backstage/cli-default-profile` as a starting place, but being judicious about what functionality they actually need and installing that directly into a new profile.

Each `cli.profiles.[].entrypoint` above refers to a package name,

```yaml
packages/
  cli/
    package.json:
      name: '@internal/cli-custom-profile'
```

Upon initialization, the existing installation of `backstage-cli` will detect that `cli-config.yaml` is set and needs to load the profile and plugins.

Users can declare both direct plugin dependencies and peer dependency resolutions in this profile to minimize the size of this new package and allow plugins to not have to bundle their own large dependencies (`eslint`, `esbuild`, etc).

### Migrating existing plugins

We'll want a way similar to the new backend migration to easily use plugins in both the old and new contexts. We propose the following export strategy,

```ts title="plugin/src/index.ts"
export default createCliPlugin(...);

// Each action would be re-exported.
// This does introduce possible naming skew between commands in plugins vs commands in the old CLI. There are only 35 commands in the existing CLI, it should be easy to fix naming skew as it comes up.
export const actions = {
  'namedAction': fn,
}
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

In order to prevent breaking changes, the release process for this is going to be involved. We propose creating a `cli-next` project that contains the new core CLI, using the `@backstage/cli-common` library to share functionality between the 2 `cli` projects where needed. Once that is stable, we would start to migrate existing commands into the new system. After migrating all of the core CLI functionality,

```
  new [options]
  test
  config:docs [options]
  config:print [options]
  config:check [options]
  config:schema [options]
  repo [command]
  package [command]
  migrate [command]
  versions:bump [options]
  versions:check [options]
  versions:migrate [options]
  clean
  build-workspace [options] <workspace-dir> [packages...]
  create-github-app <github-org>
  info
  help [command]
```

We could then launch the new CLI.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

1. External authentication is a dependency for more complex personalized plugins. It is not a blocker for an initial modularization effort.

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
