---
title: pnpm Support
status: implementable
authors:
  - '@sebdanielsson'
owners:
  - '@sebdanielsson'
project-areas:
  - tooling
  - framework
creation-date: 2026-09-19
---

# BEP: pnpm Support

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
  - [Supported Versions and Platforms](#supported-versions-and-platforms)
  - [Detection](#detection)
  - [Package Manager API](#package-manager-api)
  - [Commands](#commands)
  - [Version Bumps](#version-bumps)
  - [App Template](#app-template)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Design Details](#design-details)
  - [Project Root Detection](#project-root-detection)
  - [Lockfile Naming](#lockfile-naming)
  - [The pnpm Lockfile](#the-pnpm-lockfile)
  - [Node Linker](#node-linker)
  - [pnpm Settings in the Template](#pnpm-settings-in-the-template)
  - [Dynamic Plugin Bundles](#dynamic-plugin-bundles)
    - [Bundle Settings](#bundle-settings)
  - [Lint Rule Fixer](#lint-rule-fixer)
  - [DevTools Backend](#devtools-backend)
  - [Backward Compatibility](#backward-compatibility)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

The Backstage CLI only works with Yarn. `create-app` produces a Yarn workspace. Commands such as `versions:bump`, `repo test`, `package bundle`, and `build-workspace` call `yarn` directly or read `yarn.lock`.

This BEP adds pnpm as a second supported package manager. `@backstage/cli-node` has an internal, unused `PackageManager` interface. This BEP completes it, makes it public, moves every command onto it, and adds a pnpm implementation. `create-app` gets a `--package-manager` option. The Backstage monorepo itself keeps using Yarn.

Support is limited to pnpm 12.4 or later, Linux and macOS, and the `hoisted` node linker.

## Motivation

Organizations that use pnpm for their other projects cannot use it for Backstage. Their Backstage instance becomes the one Yarn project they run. It cannot live inside a pnpm monorepo. Some build tooling, such as the `rules_js` ruleset for Bazel, requires pnpm lockfiles.

Adopters cannot switch on their own. About 30 source files in `@backstage/cli-node`, the CLI modules, `@backstage/create-app`, `@backstage/eslint-plugin`, and `@backstage/plugin-devtools-backend` call `yarn` or read `yarn.lock`. `@backstage/cli-common` finds the project root by looking for a `workspaces` field, which pnpm projects do not have. Adopters who try end up patching the CLI or running a mixed setup.

### Goals

- An app created with `create-app --package-manager pnpm` works with every script in the app template and with the `versions:bump`, `versions:migrate`, and `package bundle` commands.
- The CLI detects the package manager from the project. No extra configuration is needed.
- Yarn behavior does not change.
- The `PackageManager` API in `@backstage/cli-node` is complete enough that another package manager can be added later without touching the commands again. `package bundle` is the exception, see [Dynamic Plugin Bundles](#dynamic-plugin-bundles).
- pnpm gets end-to-end test coverage in CI on Linux.

### Non-Goals

- Migrating the Backstage monorepo to pnpm.
- npm or Bun support. The API should not block them, but they are not implemented.
- Windows support for pnpm apps.
- The `isolated` node linker. See [Node Linker](#node-linker).
- A pnpm equivalent of the `backstage:^` version protocol. See [Version Bumps](#version-bumps).
- pnpm support in `@backstage/repo-tools`. That package serves the Backstage repository and Yarn patches. It is only touched for the rename in [Lockfile Naming](#lockfile-naming).
- Changes to the Backstage Yarn plugin or to `pm verify-patches`.

## Proposal

### Supported Versions and Platforms

pnpm 12.4 or later. Requiring the current release keeps the tested surface small. The features the CLI needs are older: native `pnpm view` and the `pnpm-workspace.yaml` settings model came in pnpm 11.0, and `pnpm pack --out` exists in all supported versions. The minimum can be lowered later if someone tests older versions.

Older versions fail with an error that names the minimum version.

Linux and macOS are supported. Windows is out of scope.

### Detection

`detectPackageManager()` in `@backstage/cli-node` picks the package manager. The order is:

1. The `packageManager` field in the root `package.json`, when it names `yarn` or `pnpm`.
2. `pnpm-lock.yaml` in the project root: pnpm.
3. `yarn.lock` in the project root: Yarn.
4. `pnpm-workspace.yaml` in the project root: pnpm.
5. A `workspaces` field in the root `package.json`: Yarn.
6. Otherwise Yarn, with a warning.

A project that names its package manager is taken at its word. A lockfile is evidence of what a project used, not of what it uses now, and a migration leaves the old one behind for a while. Reading the lockfile first would pick Yarn for a project that has moved to pnpm but still has a `yarn.lock`, and the next `versions:bump` would run `yarn install` and write that lockfile again. A migration from Yarn to pnpm goes through exactly this state.

A project with both a `pnpm-lock.yaml` and a `yarn.lock` file gets a warning about the extra lockfile. When the root `package.json` names a supported package manager, step 1 has already decided and the warning is the only effect. Otherwise step 2 applies and the project is treated as pnpm.

A `packageManager` value other than `yarn` or `pnpm` does not select anything. Detection continues with the files in the root and warns that the field was ignored. When there is nothing else to go on, detection fails with an error that names the field, rather than falling back to Yarn and writing a `yarn.lock` into a project that picked npm or Bun. A project that declares an unsupported package manager but has a `yarn.lock` keeps working as it does today.

The result is cached per project root. Warnings from detection go to stderr, so the JSON output of commands such as `info --format json` stays clean.

Today the `workspaces` check runs before the `packageManager` field is read, so a pnpm repo with a `workspaces` field looks like Yarn. The new order fixes that.

### Package Manager API

The `PackageManager` interface in `@backstage/cli-node` grows to cover what the commands need. It becomes part of the public API of the package.

| Method                               | Yarn                          | pnpm                             |
| ------------------------------------ | ----------------------------- | -------------------------------- |
| `name()`                             | `yarn`                        | `pnpm`                           |
| `version()`                          | `yarn --version`              | `pnpm --version`                 |
| `lockfileName()`                     | `yarn.lock`                   | `pnpm-lock.yaml`                 |
| `install({ immutable, offline })`    | `yarn install --immutable`    | `pnpm install --frozen-lockfile` |
| `run(args)`                          | `yarn <args>`                 | `pnpm <args>`                    |
| `runScript(name, args)`              | `yarn run <name>`             | `pnpm run <name>`                |
| `runWorkspaceScript(pkg, name)`      | `yarn workspace <pkg> <name>` | `pnpm --filter <pkg> run <name>` |
| `pack(out, dir)`                     | `yarn pack --out`             | `pnpm pack --out`                |
| `fetchPackageInfo(name)`             | `yarn npm info --json`        | `pnpm view --json`               |
| `loadLockfile()`, `parseLockfile()`  | `yarn.lock` parser            | `pnpm-lock.yaml` parser          |
| `supportsBackstageVersionProtocol()` | `true` with the Yarn plugin   | `false`                          |
| `getCommandHint(args)`               | `yarn backstage-cli repo fix` | `pnpm backstage-cli repo fix`    |

`install()` takes `immutable` and `offline` options, plus `cwd`, `env`, and output callbacks. `immutable: true` gives `--immutable` or `--frozen-lockfile`. `immutable: false` forces a mutable install where the package manager would default to an immutable one, such as in CI. Yarn gets `YARN_ENABLE_IMMUTABLE_INSTALLS=false` and pnpm gets `--no-frozen-lockfile`. `offline: true` gives `--offline` for pnpm and Yarn classic, and `YARN_ENABLE_NETWORK=0` for modern Yarn. `package bundle` uses it.

The methods are used by the CLI modules. `runWorkspaceScript()` has no caller in the CLI yet. The end-to-end test does not use the API. It runs commands in a generated app and keeps its own short list of them per package manager, so it does not depend on `@backstage/cli-node`.

Both implementations live in `@backstage/cli-node`. See [Alternatives](#alternatives) for why there is no separate pnpm package.

### Commands

Every command that calls Yarn today moves to the API.

- `repo test`, `repo lint`, `info`, `new`, and `versions:bump` read the lockfile through `loadLockfile()`. `repo build`, `repo test`, and `repo lint` with `--since` diff the lockfile at a git ref. They use `lockfileName()` to know which file changed. When the changed lockfile belongs to another package manager, or the lockfile cannot be read or parsed, all packages count as changed.
- `versions:bump`, `versions:migrate`, and `new` run installs through `install()`. `new` runs `lint --fix` through `runScript()`. Under pnpm, `versions:bump` skips the Yarn plugin update step.
- `package build` for backends and `build-workspace` copy the lockfile named by `lockfileName()` into the dist workspace. Under pnpm they also copy `pnpm-workspace.yaml`. Packages are packed with `pack()`. Custom build scripts run through `runScript()`.
- `repo test` reads the workspace package globs from `pnpm-workspace.yaml` when the root `package.json` has no `workspaces` field. Without this, it only tests the root package of a pnpm workspace.
- `repo clean` runs the `clean` script through `runScript()`.
- `package bundle` supports pnpm. See [Dynamic Plugin Bundles](#dynamic-plugin-bundles).
- The `no-undeclared-imports` lint rule uses `pnpm add` and `pnpm remove` in its fixer. See [Lint Rule Fixer](#lint-rule-fixer).
- Messages that tell the user to run `yarn <something>` use `getCommandHint()`.

### Version Bumps

With the Backstage Yarn plugin, Yarn users can write `backstage:^` as a version. There is no pnpm equivalent in this BEP. Under pnpm, `versions:bump` writes explicit ranges. This is what Yarn does without the plugin. Possible follow-ups are listed in [Alternatives](#alternatives).

### App Template

`create-app` gets a `--package-manager <yarn|pnpm>` option. The default is Yarn. When the option is not given and the command runs through pnpm, for example `pnpm create @backstage/app`, pnpm is selected. This uses the `npm_config_user_agent` environment variable, which pnpm sets to `pnpm/<version> ...`. The prerequisite check verifies the pnpm version. It runs `pnpm -v` from the system temporary directory, not from the target directory. pnpm refuses to run in a directory tree whose `package.json` pins another package manager, and `create-app` may be started from inside a Yarn project.

The option is independent of the existing `--legacy` option. Both built-in templates, `default-app` and `legacy-app`, get a pnpm variant, so `create-app --legacy --package-manager pnpm` creates a legacy app that uses pnpm.

The pnpm variant of the template differs in these files:

- `package.json`: `packageManager` is set to pnpm. There is no `workspaces` field and no `resolutions` field. Scripts use `pnpm --filter backend` instead of `yarn workspace backend`.
- `pnpm-workspace.yaml`: package globs, `nodeLinker: hoisted`, `minimumReleaseAge` with an exclusion for `@backstage/*`, `overrides` for the React type packages, and `allowBuilds`. See [pnpm Settings in the Template](#pnpm-settings-in-the-template).
- `.yarnrc.yml`, `.yarn/`, and `yarn.lock` are not written. `pnpm-workspace.yaml` is not written for Yarn apps.
- `packages/backend/Dockerfile` installs pnpm with `npm install -g pnpm@<version>`, where the version is the one in the `packageManager` field. It copies `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`, `backstage.json`, and the skeleton archive. It installs with `pnpm install --frozen-lockfile --prod`, with the cache mount pointed at the pnpm store.
- `.github/workflows/ci.yml` sets up pnpm with `pnpm/action-setup` and runs `pnpm install --frozen-lockfile`.
- `.prettierignore` ignores `pnpm-lock.yaml`. pnpm writes the file in its own format, and `prettier:check` would fail on it.
- `playwright.config.ts` starts the app and the backend with the selected package manager, `pnpm start app` instead of `yarn start app`. Without this the `test:e2e` script of a pnpm app would still call Yarn.
- `.dockerignore`, `.gitignore`, `packages/app/public/index.html`, the READMEs, and the plugin README use pnpm paths and commands.

`create-app` downloads a seed `yarn.lock` today. It holds a few pins for dependency versions known to break new apps, added with a repo script. pnpm apps do not get a seed lockfile. If a pin is ever needed for pnpm, it goes into `overrides` in the template.

### Testing

`e2e-test run` gets a `--package-manager` option. The workspace of local packages is still built with Yarn, since it is the Backstage repository. The generated app points at that workspace through `file:` overrides for every workspace package. For Yarn they go into `resolutions` in `package.json`, for pnpm into `overrides` in `pnpm-workspace.yaml`.

The test also sets `frozenLockfile: false` in `pnpm-workspace.yaml`. pnpm turns on frozen installs when `CI` is set and a lockfile exists, and the installs that `backstage-cli new` runs after adding a plugin must be able to update the lockfile. This is the pnpm equivalent of the `YARN_ENABLE_IMMUTABLE_INSTALLS=false` setting the Yarn variant uses.

The test then runs `pnpm install` in the app directory, followed by the same type-check, build, lint, and test scripts as the Yarn variant. A separate `E2E Linux pnpm` job in the Linux end-to-end workflow runs this on pull requests, on Node.js 22 with pnpm 12.4. The job installs pnpm with `pnpm/action-setup` and sets the version explicitly, since the root `package.json` of the repository pins Yarn.

Unit tests cover detection, the pnpm lockfile parser with fixture files, and every command that branches on the package manager.

### Documentation

A new `docs/tooling/package-managers.md` page describes which package managers are supported, how detection works, what the pnpm template contains and why, what differs per command, the limitations, and how to migrate an existing app from Yarn. The getting started guide, the "Keeping Backstage Updated" page, the CLI module overview, the Yarn package manager module page, and the local package linking page get short pnpm notes that link to it. The Yarn-plugin-only parts are marked as such.

## Design Details

### Project Root Detection

`targetPaths.rootDir` in `@backstage/cli-common` finds the root by walking up until a `package.json` has a `workspaces` field. `isMonoRepo()` in `@backstage/cli-node` and the linked workspace check in `package start` do the same. pnpm workspaces define their packages in `pnpm-workspace.yaml`, and the root `package.json` normally has no `workspaces` field.

A directory counts as a root when its `package.json` has a `workspaces` field or when it contains `pnpm-workspace.yaml`. This is the first change to make, because every other command depends on it.

### Lockfile Naming

`@backstage/cli-node` exports a `Lockfile` class today, together with the `LockfileQueryEntry`, `LockfileDiff`, and `LockfileDiffEntry` types. The class parses `yarn.lock` and is used by the CLI modules and by `@backstage/repo-tools`. The internal `pacman` module has a `Lockfile` interface and `LockfileEntry`, `LockfileDiff`, and `LockfileDiffEntry` types. One package cannot export both sets under the same names.

The interface and its types become the public ones: `Lockfile`, `LockfileEntry`, `LockfileDiff`, and `LockfileDiffEntry`. The class is renamed to `YarnLockfile` and implements the interface. It keeps its static `load()` and `parse()` methods, its `toString()` method, and `LockfileQueryEntry` as its entry type. The old `Lockfile` class export is removed. This is a breaking change for anyone who imports the class directly. `@backstage/cli-node` is below version 1.0, so it ships as a `minor` bump with a changeset that names the new class. The packages that only follow the rename ship as `patch` bumps.

### The pnpm Lockfile

The parser reads `pnpm-lock.yaml` with the `yaml` package that `@backstage/cli-node` already depends on. It does not use the `@pnpm/*` libraries. Those are ESM only and require Node.js 22.13 or later, while Backstage supports all of Node.js 22. The CLI ships CommonJS.

Lockfile version `9.0` is supported. pnpm 9 through 12 write this format.

When `package.json` pins pnpm through the `packageManager` field, pnpm 12 writes `pnpm-lock.yaml` as two YAML documents separated by `---`. The first document records the pinned pnpm version under `packageManagerDependencies`, with the `pnpm` and `@pnpm/exe.*` packages. The last document is the project lockfile. Without the pin, the file is a single document. The parser reads all documents and uses the last one. Importer keys such as `configDependencies` and `packageManagerDependencies` are skipped. The fixture files cover both layouts.

The mapping to the `Lockfile` interface is:

- `importers.<dir>.dependencies[name].specifier` gives the range of a direct dependency.
- `packages["name@version"]` gives the version and `resolution.integrity`.
- `snapshots["name@version(...)"].dependencies` and `optionalDependencies` give the dependency graph.

Workspace projects are entries too, listed under their package name with a `workspace:<dir>` range. The lockfile only has the importer directory, not the name. `load()` and `parseLockfile()` pass the workspace directory, and the parser reads the name from the `package.json` of each importer. Without a workspace directory, a name is only known when another project has a `link:` dependency on it. Dependencies between workspace projects have a `link:` version, which is normalized to the project directory relative to the workspace root.

Transitive packages have no specifier in pnpm lockfiles. Their entries use the resolved version as the range. Two consumers look at ranges. `versions:bump` matches the range of a direct dependency, which pnpm records. `new` picks the highest range that a target version satisfies. A version used as its own range satisfies itself, so both work. `diff()` keys entries by range as well. For transitive packages this means a version change shows up as one removed and one added entry instead of one changed entry. The consumers of `diff()` only use the set of changed package names, so the result is the same.

`getDependencyTreeHash()` and `createSimplifiedDependencyGraph()` walk the snapshots. This gives `repo test` and `repo lint` the same cache behavior as under Yarn.

### Node Linker

Generated pnpm apps set `nodeLinker: hoisted`. This produces a flat `node_modules` layout equivalent to what Yarn produces with `nodeLinker: node-modules`. That layout is what the Backstage repository and all Backstage plugins are tested against.

The `isolated` linker exposes undeclared imports, which are common in the plugin ecosystem. Supporting it is a separate effort.

One difference from Yarn remains with the `hoisted` linker. pnpm does not link workspace packages into the root `node_modules`. A `workspace:` or `link:` dependency is linked only into the `node_modules` of the packages that depend on it. `hoistWorkspacePackages` and `publicHoistPattern` do not change this. This was checked with pnpm 12.4.2. Yarn links every workspace package into the root.

This matters for the backend. `@backstage/backend-plugin-api` is hoisted to the root, and its `resolvePackagePath()` is how the backend finds the `app` package it serves. From the root, `app` is not visible. `resolvePackagePath()` now retries from the current working directory and from the directory of the main module when the normal lookup fails. Both lead to the backend package, which has `app` in its own `node_modules`. Plain `require.resolve()` calls from a hoisted dependency do not get this fallback.

### pnpm Settings in the Template

Some pnpm defaults conflict with how Backstage apps are used. The template handles them.

- The template sets `minimumReleaseAge: 4320`, three days in minutes. This matches `npmMinimalAgeGate: 3d` in the Yarn template. A `versions:bump` right after a Backstage release would then fail, so `minimumReleaseAgeExclude` lists `@backstage/*`. This mirrors `npmPreapprovedPackages` in the Yarn template.
- Build scripts of dependencies are blocked by default since pnpm 10. When a dependency with a build script is not listed in `allowBuilds`, `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, whether or not `package.json` pins pnpm. The template lists what a default app needs. `@swc/core`, `@tree-sitter-grammars/tree-sitter-yaml`, `better-sqlite3`, `cpu-features`, `esbuild`, `keytar`, `ssh2`, `tree-sitter`, `tree-sitter-json`, and `unrs-resolver` are set to `true`. `@scarf/scarf`, `core-js`, `core-js-pure`, `msw`, and `protobufjs` are set to `false`, since their scripts only print messages or collect telemetry. `msw` is on the list because the frontend plugin template adds it.
- pnpm 12 fails on unknown keys in `pnpm-workspace.yaml` when `package.json` pins a pnpm version. The template pins one, so the template may only use keys that exist in the minimum supported version.
- pnpm turns on `--frozen-lockfile` when the `CI` environment variable is set and a lockfile exists. The API passes `--no-frozen-lockfile` when a mutable install is requested.

### Dynamic Plugin Bundles

`package bundle` builds a self-contained plugin directory with its own lockfile and `node_modules`. Under Yarn it writes a `.yarnrc.yml` and seeds `yarn.lock` from the plugin directory or the monorepo root. It prunes the lockfile with an offline `yarn install --no-immutable --mode update-lockfile` against the source cache folder. For backend plugins it then installs with `yarn install --immutable`.

The steps of this command are the one place where a package manager is not reached through the `PackageManager` API alone. The two flows differ in kind, not only in flags: Yarn writes a `.yarnrc.yml` with a `yarnPath`, pnpm writes a `pnpm-workspace.yaml` with copied settings and patch files; Yarn merges overrides into `resolutions`, pnpm into `overrides`; and the pnpm prune and install fall back from `--offline` to `--prefer-offline`. So the command keeps one set of steps per package manager, behind a small internal interface, rather than pushing a bundle-shaped operation into the public API. Adding a third package manager means writing those steps, not changing the command.

The pnpm flow mirrors this:

1. Write `pnpm-workspace.yaml` in the bundle directory with `nodeLinker: hoisted` and the same `overrides` that Yarn gets as `resolutions`. The settings of the source `pnpm-workspace.yaml` that the bundle needs are copied. See [Bundle Settings](#bundle-settings). When the root `package.json` pins pnpm in `packageManager`, the bundle `package.json` gets the same pin, so the bundle uses that pnpm version even when it is written outside the source project.
2. Copy `pnpm-lock.yaml` from the plugin directory or the monorepo root.
3. Prune with `pnpm install --lockfile-only --no-frozen-lockfile --offline`. The seeded lockfile belongs to another project, so the prune must be able to rewrite it where pnpm defaults to a frozen lockfile, such as in CI.
4. For backend plugins, install with `pnpm install --frozen-lockfile --offline`.

When pnpm reports that its cache lacks the metadata or tarball for a package, the step prints a warning and runs again with `--prefer-offline`. That mode still uses the cache for everything it has and fetches the rest. The output is matched on the `ERR_PNPM_NO_OFFLINE_*` codes and on the messages pnpm prints when it drops the code.

#### Bundle Settings

Two groups of settings are copied.

The first group makes the offline steps work: `storeDir`, `cacheDir`, `minimumReleaseAge`, `minimumReleaseAgeExclude`, `resolutionMode`, and `allowBuilds`. pnpm's store and metadata cache are global on the machine, not per repo, and the offline steps rely on both having been filled by the install in the source repo. The store and cache settings are copied so the bundle looks in the same place, and relative paths are resolved against the source root. `minimumReleaseAge` and `resolutionMode` are copied because pnpm keeps a separate metadata cache per value. `allowBuilds` is copied so the bundle builds the same native dependencies as the source project.

The second group changes what the lockfile resolves to: `packageExtensions`, `patchedDependencies`, `peerDependencyRules`, `ignoredOptionalDependencies`, `supportedArchitectures`, `autoInstallPeers`, `excludeLinksFromLockfile`, `dedupePeerDependents`, `catalog`, and `catalogs`. pnpm records these in the lockfile, for example as `packageExtensionsChecksum`, and re-resolves the seeded lockfile when they do not match. It does so without an error, so a bundle built without them is quietly wrong: a dependency that `packageExtensions` added is dropped, and a patched dependency is installed unpatched. `patchedDependencies` names patch files, so the files are copied into the bundle and the setting is rewritten to point at the copies. A patch file that does not exist is reported and left out.

Settings that describe the workspace layout of the source project are not copied, because the bundle is a single package with its own linker. Everything else that the source project sets is named in a warning, so that a setting the bundle does not know about does not change the result unnoticed.

`pnpm-lock.yaml` has an `importers` section keyed by workspace directory. The bundle is a different project, so its importers do not match the seeded lockfile. The prune step relies on pnpm keeping the `packages` and `snapshots` entries that the bundle still resolves to and dropping the rest. The `--prefer-offline` retry covers the case where a resolution is missing from the cache.

### Lint Rule Fixer

The `no-undeclared-imports` rule in `@backstage/eslint-plugin` is plain JavaScript with a synchronous fixer. It cannot call the async `detectPackageManager()`. The fixer follows the same order synchronously, as far as it needs to: the `packageManager` field in the root `package.json` when it names a supported package manager, then `pnpm-lock.yaml`, then Yarn. All it decides is whether the fix names `pnpm add` or `yarn add`.

### DevTools Backend

`@backstage/plugin-devtools-backend` has its own copy of the `yarn.lock` parser for the Info tab. It does not depend on `@backstage/cli-node`, and adding that dependency would pull CLI-only packages into a backend runtime. The plugin keeps a local parser. It picks the parser the same way the fixer does, by the `packageManager` field first and lockfile presence second, and gains a pnpm parser that only reads package names and versions.

### Backward Compatibility

Breaking change, shipped as a `minor` bump:

- The `Lockfile` class in `@backstage/cli-node` is renamed to `YarnLockfile`. `@backstage/repo-tools` and the CLI modules are updated to the new name.

Non-breaking changes, shipped as `patch` bumps:

- `PackageManager`, `Lockfile`, `detectPackageManager()`, and the two implementations become public exports of `@backstage/cli-node`.
- `hasBackstageYarnPlugin()` stays. It is marked deprecated in favor of `supportsBackstageVersionProtocol()` on the detected package manager.
- The `--alwaysYarnPack` alias of `build-workspace` stays.
- `resolvePackagePath()` in `@backstage/backend-plugin-api` gains the retry described in [Node Linker](#node-linker). Packages found by the normal lookup resolve as before.
- `repo test` finds the packages of pnpm workspaces. Yarn workspaces are read as before.
- No CLI command is renamed or removed.

## Release Plan

The work is split into stacked pull requests.

1. Package manager API in `@backstage/cli-node`, the `YarnLockfile` rename, and root detection in `@backstage/cli-common`. Detection warnings go to stderr, and `--since` treats every package as changed when the lockfile cannot be diffed. No other behavior change for Yarn projects.
2. Move every command onto the API. No behavior change.
3. pnpm implementation and detection, and `repo test` reading the package globs from `pnpm-workspace.yaml`. Existing pnpm projects start working with the CLI.
4. `package bundle` under pnpm.
5. `create-app --package-manager pnpm` and the template, together with the `resolvePackagePath()` retry in `@backstage/backend-plugin-api`. The generated backend needs it to find the `app` package.
6. End-to-end tests and the `E2E Linux pnpm` job.
7. Documentation.

pnpm support is documented as experimental in the first release that ships it. It is documented as stable after one full release cycle with the end-to-end job green.

## Dependencies

None on other BEPs. The work builds on the CLI module system and the internal `PackageManager` interface in `@backstage/cli-node`.

## Alternatives

**A separate `@backstage/cli-module-package-manager-pnpm` package.** CLI modules can only register commands. A module that provides a package manager would need a new public registration API, and every command would need to look up the provider. A pnpm module can still be added later for pnpm-only commands, like the Yarn module does for patch verification.

**Use the `@pnpm/lockfile.fs` library.** It is ESM only and requires Node.js 22.13. The CLI ships CommonJS and the parser is small. Writing it is less work than changing the build.

**Support the `isolated` linker first.** This breaks plugins with undeclared imports. `hoisted` is a drop-in for what Yarn produces today.

**A pnpm `catalog:` or a custom pnpm resolver for `backstage:^`.** Catalogs would give `versions:bump` one place to write versions. Custom resolvers, added in pnpm 11, could support a `backstage:` protocol. Both are possible follow-ups. Explicit ranges work today, so neither is needed here.

**Keep Yarn and set `nodeLinker: pnpm`.** This gives Yarn users a pnpm-style layout but does not help adopters who want the pnpm CLI, its lockfile, or a pnpm monorepo.
