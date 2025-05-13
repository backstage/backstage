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

The Backstage CLI is continuing to expand and evolve. Recently, there has been a new wave of CLI proposals, like catalog customization or API integrations that require more information about your Backstage instance. The CLI is also continuing to pick up more and more dependencies (80), which may sit in unused code paths causing CLI bloat. In order to best support a leaner, more extensible CLI, we propose a new modular CLI approach. The modular CLI will build on the new backend abstractions and eventually the goal is to let users install plugins/modules/services into their CLI, while still using the same `backstage-cli` command they're familiar with.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

As a user/integrator/admin, I would like to be able to add functionality to the Backstage CLI. Examples of this might be wanting additional templates for creating plugins, new build plugins, entity catalog validation, etc. While I could create my own CLI that sits on top of or adjacent to the Backstage CLI, that's confusing for users and means that I have to own the scaffolding of that new CLI.

As a 3rd party plugin developer, I'd also like to be able to write CLI commands that can be easily integrated with a customer's Backstage CLI instance. Owning a completely separate CLI is cumbersome and can be a poor DX, as can owning the integration layers for communicating with a Backstage instance. By creating a new command instead of an entire new CLI, I get a full CLI experience and I can tie into standard dependencies for the integration layers for free.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

1. Integrators can define custom CLI commands that add functionality to the Backstage CLI.
1. Users and integrators are able to install new commands into the CLI.
1. Users can write commands locally and install them into the CLI.
1. Users will still be able to use the existing `backstage-cli` command.
1. Shared dependency management, like peer dependencies, should work as expected.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

1. Distribution of your CLI, including compiling your CLI for different architectures.
1. Module system for adding functionality across different plugins.
1. CLI packaging, users should be able to use your CLI outside of your Backstage repository.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

A new core for the Backstage CLI that enables modularization of the CLI. This will be built as a new system, taking the best of the frontend and the backend systems and applying it for a CLI. Neither the frontend system or the backend system are wholly fit for this role as they're specializing in different run-times and focusing on different levels of abstractions.

Performance will also need to be prioritized as slow initialization times for the backend are noticeable once, slow CLI initialization will be consistently noticed whenever commands are run. Lazy loading of key dependencies will be a substantial part of this effort.

A new declarative installation method for plugins to be added to the CLI. Inspired by `Rushstack`'s [`rush-plugins` architecture](https://rushjs.io/pages/maintainer/using_rush_plugins/), users will define a new `cli-config.yaml` file with a map of profile names to plugin names and entry points. To solve the problem of peer dependencies and dependency management in general for the CLI, we propose creating a new Backstage type `cli-profile` package that holds a `package.json` and a [lockfile](https://github.com/lirantal/nodejs-cli-apps-best-practices?tab=readme-ov-file#22-use-the-shrinkwrap-luke) with the installed plugins. This package will not have any Typescript code nor executables and will simply define the dependencies needed for your modular CLI. With the shrink wrap file, installs will also be repeatable.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Plugin Abstractions

We propose a new system for the CLI, this system will be mostly focused on allowing developers to add Plugins, Commands and Services. Services will be the same as the backend system, allowing for dependency injection. Plugins will be the new replacement for frontend plugins and backend features. Commands will be the individual CLI commands.

```ts
interface Plugin {
  // Out of the box, we will have a registration point for adding new commands.
  register(registrationPoints: {
    [key: string]: RegistrationPointRef;
  }): void | Promise<void>;
}

interface Command {
  // What path in the CLI this command will sit at? eg ["repo", "build", "backend"]
  path: string[];

  init(deps: { [key: string]: ServiceRef }): Promise<void>;
}
```

Plugins are essentially how developers will package their set of Commands (and services).

Commands are at their core a sparse tree of nodes, connected by their paths to create a command-line interface. Users can create new Commands that tie directly into other commands' paths, for example, a user can add a new `build` command. Users aren't required to use a module interface to interact with other commands, both because other commands are unlikely to share much code and command hierarchy is not an indicator of interoperability. `build frontend` and `build backend` are similar domain commands but have much different end results.

In this model, Commands do not have any inherited hierarchy, for example, flags cannot be set on the `package` command and expected to be inherited down to the `package migrate schema-tools` command. In those cases where inherited hierarchy might make sense, we propose using environment variables, like `LOG_LEVEL` and `DEBUG` to convey that state instead.

#### Plugins

What do plugins mean in a CLI system?

A plugin should continue to be a unit of self-contained functionality. It will own at least one Command and possibly a set of Services. For example, there could be a new Build plugin that holds the functionality for building the frontend and the backend.

##### Default Plugins

As part of this effort, we propose breaking up the existing CLI into a set of plugins and then combining those plugins into a default profile. That set of plugins would be:

1. Build plugin - All of the existing build commands, as well as the rollup/esbuild/webpack configuration and orchestration.
1. Start plugin - May be pulled into the build plugin, would hold all development related commands that aren't necessarily for static output/building.
1. Clean plugin - Repository/package cleaning logic.
1. Lint plugin - Both lint commands and their dependencies.
1. Test plugin - All 3 test commands and their dependencies.
1. Config plugin - All of the config related commands.
1. Info plugin - Information about your Backstage installation.
1. Migration plugin - Automatic migration scripts.
1. "New plugin" plugin - Creating a new plugin flow.
1. Version plugin - Handle versioning for your Backstage instance.

### Services

We'll also need Services to store common functionality that no single command should own. Services will be injected into each Command and will mirror those found in the backend system.

#### Config Service

The Backstage CLI currently doesn't ship with config information and doesn't require to be run in your local Backstage repo. We'll need some way of setting the URL of your Backstage instance, for plugins that require direct communication. We propose a `backstage-cli config set` command to set config, including Backstage instance URL, that writes to your `cli-config.yaml` file either in your git repo or globally.

```ts
interface ConfigOptions {
  global?: boolean;
}

interface ConfigService {
  get(options: ConfigOptions): string | undefined;
  set(key: string, options: ConfigOptions): void;
}
```

#### Identity Service

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

#### PluginCommandService

Let users register actions with the CLI. It would be based on a subset of the `commander` API.

```ts
// A scoped command with the pluginId as the command name.
interface PluginCommandService {
  // Only allowed to call this once per Command.
  action(processingFn: () => void | Promise<void>): PluginCommandService;
  option(
    argument: string,
    description: string,
    processingFn?: () => void,
    defaultValue?: string,
  ): Command;
}
```

Usage:

```ts
createCliPlugin({
  path: ['package', 'build'],
  deps: {
    command: services.pluginCommandService,
  },
  register({ command }) {
    command
      .option('-f', 'Forcefully build')
      .action(lazy(() => import('./command').then(m => m.default)));
  },
});
```

```ts
createCliPlugin({
  path: ['package', 'test'],
  deps: {
    command: services.pluginCommandService,
  },
  register({ command }) {
    command
      .option(
        '--pass-with-no-tests',
        'Allow the tests to pass if there are no tests.',
      )
      .action(lazy(() => import('./command').then(m => m.default)));
  },
});
```

#### Logger Service

This will generally be pulled from the backend system. Logs will likely need to be enabled with a global verbosity flag/environment variable.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

1. Iterate in `packages/cli` using a new `alpha` entrypoint - this will mainly be focused on the overall types and not services.
2. Promote that alpha entrypoint to main when things seem figured out.
3. Add support for a few services as mentioned above - config, auth, fetch and logging.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

1. Device auth will be required for unlocking CLI authentication.

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
