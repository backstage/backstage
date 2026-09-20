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
  - [Locations](#locations)
  - [Detection](#detection)
  - [Package Manager API](#package-manager-api)
  - [Commands](#commands)
  - [Version Bumps](#version-bumps)
  - [App Template](#app-template)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Design Details](#design-details)
  - [Locating the Roots](#locating-the-roots)
  - [Lockfile Naming](#lockfile-naming)
  - [The pnpm Lockfile](#the-pnpm-lockfile)
    - [Importer Names and Historical Lockfiles](#importer-names-and-historical-lockfiles)
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

Support is limited to pnpm 12.4 or later, Node.js 24 or later, Linux and macOS, and the `hoisted` node linker.

## Motivation

Organizations that use pnpm for their other projects cannot use it for Backstage. Their Backstage instance becomes the one Yarn project they run. It cannot live inside a pnpm monorepo. Some build tooling, such as the `rules_js` ruleset for Bazel, requires pnpm lockfiles.

Adopters cannot switch on their own. About 30 source files in `@backstage/cli-node`, the CLI modules, `@backstage/create-app`, `@backstage/eslint-plugin`, and `@backstage/plugin-devtools-backend` call `yarn` or read `yarn.lock`. `@backstage/cli-common` finds the project root by looking for a `workspaces` field, which pnpm projects do not have. Adopters who try end up patching the CLI or running a mixed setup.

### Goals

- An app created with `create-app --package-manager pnpm` works with every script in the app template and with the `versions:bump`, `versions:migrate`, and `package bundle` commands.
- The CLI detects the package manager from the project. No extra configuration is needed.
- Yarn behavior does not change.
- The `PackageManager` API in `@backstage/cli-node` is complete enough that another package manager can be added later without touching the commands again. `package bundle` is the exception, see [Dynamic Plugin Bundles](#dynamic-plugin-bundles).
- The CLI keeps the workspace root, the Backstage installation root, and the command directory apart, so that one workspace can hold several Backstage installations. See [Locations](#locations).
- pnpm installations manage their Backstage versions through a catalog, so `versions:bump` has one place to write. See [Version Bumps](#version-bumps).
- pnpm gets end-to-end test coverage in CI on Linux.

### Non-Goals

- Migrating the Backstage monorepo to pnpm.
- npm or Bun support. The API should not block them, but they are not implemented.
- Windows support for pnpm apps.
- The `isolated` node linker. See [Node Linker](#node-linker).
- A pnpm equivalent of the `backstage:^` version protocol. pnpm uses catalogs instead. See [Version Bumps](#version-bumps).
- pnpm support in `@backstage/repo-tools`, beyond the rename in [Lockfile Naming](#lockfile-naming). The package is public, and its package documentation, OpenAPI, and API report commands call Yarn and read `yarn.lock` directly. pnpm adopters who use those commands will hit this, so it is deferred rather than dismissed, and it is the first follow-up once the API is public.
- Changes to the Backstage Yarn plugin or to `pm verify-patches`.

## Proposal

### Supported Versions and Platforms

pnpm 12.4 or later. Requiring the current release keeps the tested surface small. The features the CLI needs are older: native `pnpm view` and the `pnpm-workspace.yaml` settings model came in pnpm 11.0, catalogs came in pnpm 9.5, and `pnpm pack --out` exists in all supported versions. The minimum can be lowered later if someone tests older versions.

Older versions fail with an error that names the minimum version.

Node.js 24 or later. This work lands after Backstage drops Node.js 22, so the repository and the generated app both declare a floor of 24. pnpm does not set that floor; every pnpm 12 release declares `node: >=18.*`. The `@pnpm/*` libraries used by the lockfile parser do, and Node.js 24 clears them. See [The pnpm Lockfile](#the-pnpm-lockfile).

Linux and macOS are supported. Windows is out of scope.

### Locations

The CLI works with three locations that must not be conflated. A large monorepo can hold a single lockfile at the top and many projects in folders below it, so the workspace root is not the Backstage installation root, and neither is the directory the command runs in.

- **Workspace root.** What the package manager treats as one workspace: the nearest ancestor whose `package.json` has a `workspaces` field, or that holds a `pnpm-workspace.yaml`. The lockfile, the package manager settings, and the catalogs live here. An install acts on everything inside it.
- **Installation root.** The nearest ancestor that holds a `backstage.json`. This is the Backstage installation the command operates on, and it decides which packages `versions:bump` bumps and which ones `info` reports. It is often the same directory as the workspace root, and it is never assumed to be.
- **Command directory.** The current working directory and the package that contains it. Package-scoped commands such as `package build` act here.

`targetPaths` in `@backstage/cli-common` models only two of these today: `dir` is the working directory and `rootDir` is the workspace root, which callers also use as the installation root. It gains `workspaceRootDir` and `installationRootDir`. `rootDir` keeps its current value and is deprecated in favor of the two explicit names, so that every existing caller has to say which one it meant.

The workspace root lookup uses `@manypkg/find-root`, which already understands Yarn and pnpm workspaces, instead of the hand-written walk that looks only for a `workspaces` field. `@backstage/cli-node` already depends on it through `@manypkg/get-packages`; `@backstage/cli-common` takes it as a new dependency.

A `PackageManager` instance is bound to one workspace root, because that is what fixes the lockfile and the settings. Every method takes the location it acts on rather than reading `process.cwd()`. This separation lands before the API becomes public, since it cannot be added afterwards without another breaking change.

### Detection

`detectPackageManager()` in `@backstage/cli-node` picks the package manager for a given workspace root. The order is:

1. The `packageManager` field in the root `package.json`, when it names `yarn` or `pnpm`.
2. `pnpm-lock.yaml` in the workspace root: pnpm.
3. `yarn.lock` in the workspace root: Yarn.
4. `pnpm-workspace.yaml` in the workspace root: pnpm.
5. A `workspaces` field in the root `package.json`: Yarn.
6. Otherwise Yarn, with a warning.

A project that names its package manager is taken at its word. A lockfile is evidence of what a project used, not of what it uses now, and a migration leaves the old one behind for a while. Reading the lockfile first would pick Yarn for a project that has moved to pnpm but still has a `yarn.lock`, and the next `versions:bump` would run `yarn install` and write that lockfile again. A migration from Yarn to pnpm goes through exactly this state.

A project with both a `pnpm-lock.yaml` and a `yarn.lock` file gets a warning about the extra lockfile. When the root `package.json` names a supported package manager, step 1 has already decided and the warning is the only effect. Otherwise step 2 applies and the project is treated as pnpm.

A `packageManager` value other than `yarn` or `pnpm` does not select anything. Detection continues with the files in the workspace root and warns that the field was ignored. When there is nothing else to go on, detection fails with an error that names the field, rather than falling back to Yarn and writing a `yarn.lock` into a project that picked npm or Bun. A project that declares an unsupported package manager but has a `yarn.lock` keeps working as it does today.

The result is cached per workspace root. Warnings from detection go to stderr, so the JSON output of commands such as `info --format json` stays clean.

Today the `workspaces` check runs before the `packageManager` field is read, so a pnpm repo with a `workspaces` field looks like Yarn. The new order fixes that.

Detection reads only the workspace root. It never walks up past it, and it never uses the installation root or the command directory, so a Backstage installation nested inside a larger monorepo resolves to the package manager of the monorepo that actually owns the lockfile.

### Package Manager API

The `PackageManager` interface in `@backstage/cli-node` grows to cover what the commands need. It becomes part of the public API of the package.

| Method                              | Yarn                               | pnpm                             |
| ----------------------------------- | ---------------------------------- | -------------------------------- |
| `name()`                            | `yarn`                             | `pnpm`                           |
| `version()`                         | `yarn --version`                   | `pnpm --version`                 |
| `lockfileName()`                    | `yarn.lock`                        | `pnpm-lock.yaml`                 |
| `install(options)`                  | `yarn install --immutable`         | `pnpm install --frozen-lockfile` |
| `run(args)`                         | `yarn <args>`                      | `pnpm <args>`                    |
| `runScript(name, args)`             | `yarn run <name>`                  | `pnpm run <name>`                |
| `runWorkspaceScript(pkg, name)`     | `yarn workspace <pkg> <name>`      | `pnpm --filter <pkg> run <name>` |
| `pack(out, dir)`                    | `yarn pack --out`                  | `pnpm pack --out`                |
| `fetchPackageInfo(name)`            | `yarn npm info --json`             | `pnpm view --json`               |
| `loadLockfile()`, `parseLockfile()` | `yarn.lock` parser                 | `pnpm-lock.yaml` parser          |
| `versionStrategy()`                 | `backstage-protocol` or `explicit` | `catalog`                        |
| `readCatalogs()`, `writeCatalog()`  | not supported                      | `pnpm-workspace.yaml` catalogs   |
| `getCommandHint(args)`              | `yarn backstage-cli repo fix`      | `pnpm backstage-cli repo fix`    |

`install()` acts on the whole workspace, and the API says so rather than leaving it to the caller's working directory. Neither package manager scopes an install to the directory it runs in: `pnpm install` inside a workspace project installs every project in that workspace, and Yarn behaves the same way. So `install()` takes no `cwd`. It runs at the workspace root the instance is bound to, and a caller that changes directory cannot accidentally install a whole monorepo.

Its options are `immutable`, `offline`, `filter`, plus `env` and output callbacks. `immutable: true` gives `--immutable` or `--frozen-lockfile`. `immutable: false` forces a mutable install where the package manager would default to an immutable one, such as in CI. Yarn gets `YARN_ENABLE_IMMUTABLE_INSTALLS=false` and pnpm gets `--no-frozen-lockfile`. `offline: true` gives `--offline` for pnpm and Yarn classic, and `YARN_ENABLE_NETWORK=0` for modern Yarn. `package bundle` uses it.

`filter` narrows the install to named workspace projects. pnpm gets `--filter <pkg>...`. Yarn has no equivalent that works without the workspace-tools plugin, so its implementation rejects a `filter` it cannot honor instead of quietly installing everything. No command in this BEP passes it; the option exists so that scoping is a request the package manager either honors or refuses.

The methods are used by the CLI modules. `runWorkspaceScript()` has no caller in the CLI yet. The end-to-end test does not use the API. It runs commands in a generated app and keeps its own short list of them per package manager, so it does not depend on `@backstage/cli-node`.

Both implementations live in `@backstage/cli-node`. See [Alternatives](#alternatives) for why there is no separate pnpm package.

### Commands

Every command that calls Yarn today moves to the API.

- `repo test`, `repo lint`, `info`, `new`, and `versions:bump` read the lockfile through `loadLockfile()`. `repo build`, `repo test`, and `repo lint` with `--since` diff the lockfile at a git ref. They use `lockfileName()` to know which file changed. When the changed lockfile belongs to another package manager, when it cannot be read or parsed, or when its workspace entries cannot be named against that same ref, all packages count as changed. See [Importer Names and Historical Lockfiles](#importer-names-and-historical-lockfiles).
- `versions:bump`, `versions:migrate`, and `new` run installs through `install()`. `new` runs `lint --fix` through `runScript()`. Under pnpm, `versions:bump` skips the Yarn plugin update step and writes a catalog instead. See [Version Bumps](#version-bumps).
- `package build` for backends and `build-workspace` copy the lockfile named by `lockfileName()` into the dist workspace. Under pnpm they also copy `pnpm-workspace.yaml`. Packages are packed with `pack()`. Custom build scripts run through `runScript()`.
- `repo test` discovers workspace packages through `@manypkg/get-packages`, which reads the globs from `pnpm-workspace.yaml` or from the `workspaces` field as appropriate. Without this, it only tests the root package of a pnpm workspace. `@backstage/cli-node` already depends on that package, so this replaces hand-written glob handling rather than adding any.
- `repo clean` runs the `clean` script through `runScript()`.
- `package bundle` supports pnpm. See [Dynamic Plugin Bundles](#dynamic-plugin-bundles).
- The `no-undeclared-imports` lint rule uses `pnpm add` and `pnpm remove` in its fixer. See [Lint Rule Fixer](#lint-rule-fixer).
- Messages that tell the user to run `yarn <something>` use `getCommandHint()`.

### Version Bumps

Yarn keeps exactly the behavior it has today. With the Backstage Yarn plugin, `backstage:^` resolves through the plugin and `versions:bump` writes that range; without the plugin it writes explicit ranges. Nothing on the Yarn path changes.

pnpm does not get an equivalent protocol. It uses catalogs, which pnpm supports natively and which give `versions:bump` a single place to write. The pnpm template declares a catalog named `backstage` in `pnpm-workspace.yaml`, and every `@backstage/*` dependency in the generated app refers to it:

```yaml
catalogs:
  backstage:
    '@backstage/plugin-catalog': ^1.0.0
```

```json
{
  "dependencies": {
    "@backstage/plugin-catalog": "catalog:backstage"
  }
}
```

`backstage` is the name `versions:bump` reads and writes by default. A plain `versions:bump` resolves the release manifest the way it does today and rewrites the entries of that catalog, leaving the `package.json` files alone. A dependency that is not in the catalog keeps its explicit range and is bumped in place, as it is under Yarn without the plugin.

`versions:bump --catalog <name>` bumps a different catalog. Together with `--release` this lets one installation track more than one line:

```bash
backstage-cli versions:bump --catalog backstage-next --release next
```

Only the `backstage` catalog has a default. For any other catalog the caller supplies the conditions on each run, since nothing in the repository records what a given catalog is meant to track.

`versions:migrate` moves the `@backstage/*` dependencies of a pnpm installation into the `backstage` catalog, replacing their ranges with `catalog:backstage` and creating the catalog if it is missing. This is how an existing pnpm app opts in.

Catalogs are a workspace-level feature, so the catalog lives at the workspace root while the packages being bumped live under the installation root. `versions:bump` uses the installation root to decide which packages it owns and the workspace root to find the catalog that serves them. See [Locations](#locations).

pnpm records the resolved catalog entries in `pnpm-lock.yaml`, so a catalog change is a lockfile change and `--since` sees it like any other.

### App Template

`create-app` gets a `--package-manager <yarn|pnpm>` option. The default is Yarn. When the option is not given and the command runs through pnpm, for example `pnpm create @backstage/app`, pnpm is selected. This uses the `npm_config_user_agent` environment variable, which pnpm sets to `pnpm/<version> ...`. The prerequisite check verifies the pnpm version. It runs `pnpm -v` from the system temporary directory, not from the target directory. pnpm refuses to run in a directory tree whose `package.json` pins another package manager, and `create-app` may be started from inside a Yarn project.

The option is independent of the existing `--legacy` option. Both built-in templates, `default-app` and `legacy-app`, get a pnpm variant, so `create-app --legacy --package-manager pnpm` creates a legacy app that uses pnpm.

The pnpm variant of the template differs in these files:

- `package.json`: `packageManager` is set to pnpm. There is no `workspaces` field and no `resolutions` field. Every `@backstage/*` dependency is `catalog:backstage`. Scripts use `pnpm --filter backend` instead of `yarn workspace backend`.
- `pnpm-workspace.yaml`: package globs, `nodeLinker: hoisted`, a `backstage` catalog holding the `@backstage/*` ranges, `minimumReleaseAge` with an exclusion for `@backstage/*`, `overrides` for the React type packages, and `allowBuilds`. See [pnpm Settings in the Template](#pnpm-settings-in-the-template).
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

The test then runs `pnpm install` in the app directory, followed by the same type-check, build, lint, and test scripts as the Yarn variant. A separate `E2E Linux pnpm` job in the Linux end-to-end workflow runs this on pull requests, on Node.js 24 with pnpm 12.4. The job installs pnpm with `pnpm/action-setup` and sets the version explicitly, since the root `package.json` of the repository pins Yarn.

Unit tests cover detection, the three locations against a fixture monorepo that holds two Backstage installations, the pnpm lockfile parser with fixture files, catalog reads and writes, and every command that branches on the package manager.

### Documentation

A new `docs/tooling/package-managers.md` page describes which package managers are supported, how detection works, what the pnpm template contains and why, how catalogs replace the `backstage:^` protocol under pnpm, what differs per command, the limitations, and how to migrate an existing app from Yarn. The getting started guide, the "Keeping Backstage Updated" page, the CLI module overview, the Yarn package manager module page, and the local package linking page get short pnpm notes that link to it. The Yarn-plugin-only parts are marked as such.

## Design Details

### Locating the Roots

`targetPaths.rootDir` in `@backstage/cli-common` finds the root by walking up until a `package.json` has a `workspaces` field. `isMonoRepo()` in `@backstage/cli-node` and the linked workspace check in `package start` do the same. pnpm workspaces define their packages in `pnpm-workspace.yaml`, and the root `package.json` normally has no `workspaces` field, so none of these find a pnpm workspace at all.

Fixing that lookup is not enough on its own, because the single `rootDir` is used for two different questions. `targetPaths` gains the two roots described in [Locations](#locations):

- `workspaceRootDir` walks up with `@manypkg/find-root`, which accepts a `workspaces` field or a `pnpm-workspace.yaml`. Callers that want the lockfile, the package manager settings, or the catalogs use this.
- `installationRootDir` walks up for the nearest `backstage.json`. Callers that want the set of packages that make up one Backstage installation use this. `BACKSTAGE_JSON` is already exported from `@backstage/cli-common`; there is no helper that finds it today.

Both are lazy and cached the way `rootDir` already is, and both re-resolve when the working directory changes. `rootDir` keeps returning the workspace root, and is deprecated. Every caller of `rootDir` in the repository is moved to one of the two explicit names, which is where the two questions get separated in practice.

When there is no `backstage.json` above the working directory, `installationRootDir` falls back to the workspace root and the commands that need an installation say so in their error rather than operating on the wrong set of packages.

This is the first change to make, because every other change depends on it, and because the `PackageManager` API cannot be made public before the locations it takes are settled.

### Lockfile Naming

`@backstage/cli-node` exports a `Lockfile` class today, together with the `LockfileQueryEntry`, `LockfileDiff`, and `LockfileDiffEntry` types. The class parses `yarn.lock` and is used by the CLI modules and by `@backstage/repo-tools`. The internal `pacman` module has a `Lockfile` interface and `LockfileEntry`, `LockfileDiff`, and `LockfileDiffEntry` types. One package cannot export both sets under the same names.

The interface and its types become the public ones: `Lockfile`, `LockfileEntry`, `LockfileDiff`, and `LockfileDiffEntry`. The class is renamed to `YarnLockfile` and implements the interface. It keeps its static `load()` and `parse()` methods, its `toString()` method, and `LockfileQueryEntry` as its entry type. The old `Lockfile` class export is removed. This is a breaking change for anyone who imports the class directly. `@backstage/cli-node` is below version 1.0, so it ships as a `minor` bump with a changeset that names the new class. The packages that only follow the rename ship as `patch` bumps.

### The pnpm Lockfile

The parser uses the `@pnpm/*` libraries rather than reading the YAML by hand. `@pnpm/lockfile.fs` reads and validates `pnpm-lock.yaml`, handles the multi-document layout that pnpm 12 writes when `package.json` pins a pnpm version, and tracks the format as pnpm changes it. Reproducing that by hand is work the pnpm project has already done, and it would have to be redone at every format change.

Those libraries are ESM only, and `@backstage/cli-node` publishes CommonJS. They are loaded through a dynamic `import()` that the package build preserves, which works from CommonJS on every Node.js version this BEP targets. They also require Node.js 22.13 or later, which is why an earlier draft avoided them; with the floor at Node.js 24 that objection is gone. See [Supported Versions and Platforms](#supported-versions-and-platforms).

Lockfile version `9.0` is supported. pnpm 9 through 12 write this format. The fixture files cover both the single-document layout and the two-document layout that a pinned `packageManager` field produces.

The mapping to the `Lockfile` interface is:

- `importers.<dir>.dependencies[name].specifier` gives the range of a direct dependency.
- `packages["name@version"]` gives the version and `resolution.integrity`.
- `snapshots["name@version(...)"].dependencies` and `optionalDependencies` give the dependency graph.

Workspace projects are entries too, listed under their package name with a `workspace:<dir>` range. Dependencies between workspace projects have a `link:` version, which is normalized to the project directory relative to the workspace root.

#### Importer Names and Historical Lockfiles

A pnpm lockfile keys its importers by directory, while the `Lockfile` interface is keyed by package name. The parser does not bridge that gap by reading the `package.json` files in the working tree. A lockfile taken from an older git ref would then be read with today's names and today's workspace membership, so a renamed package would be attributed to the wrong name and a removed workspace would silently disappear. `--since` does exactly that: it parses a lockfile at a git ref.

The parser works on importer paths internally and reports workspace entries by name only when the caller supplies importer metadata drawn from the same source as the lockfile:

- `loadLockfile()` reads the lockfile and the importer `package.json` files from the same working tree, so the two match.
- `parseLockfile()` takes the importer metadata as an argument. A caller that reads a lockfile at a git ref supplies the metadata from that same ref, or supplies none.

With no matching metadata the parser still returns a usable lockfile, with the workspace entries keyed by path and marked as unnamed. `repo build`, `repo test`, and `repo lint` treat that result the way they already treat an unreadable lockfile and count every package as changed. Failing closed costs one full run; guessing costs a wrong one.

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

The steps of this command are the one place where a package manager is not reached through the `PackageManager` API alone. The two flows differ in kind, not only in flags: Yarn writes a `.yarnrc.yml` with a `yarnPath`, pnpm writes a `pnpm-workspace.yaml` with copied settings and patch files; and Yarn merges overrides into `resolutions` while pnpm merges them into `overrides`. So the command keeps one set of steps per package manager, behind a small internal interface, rather than pushing a bundle-shaped operation into the public API. Adding a third package manager means writing those steps, not changing the command.

The pnpm flow mirrors this:

1. Write `pnpm-workspace.yaml` in the bundle directory with `nodeLinker: hoisted` and the same `overrides` that Yarn gets as `resolutions`. The settings of the source `pnpm-workspace.yaml` that the bundle needs are copied. See [Bundle Settings](#bundle-settings). When the root `package.json` pins pnpm in `packageManager`, the bundle `package.json` gets the same pin, so the bundle uses that pnpm version even when it is written outside the source project.
2. Copy `pnpm-lock.yaml` from the plugin directory or the monorepo root.
3. Prune with `pnpm install --lockfile-only --no-frozen-lockfile --offline`. The seeded lockfile belongs to another project, so the prune must be able to rewrite it where pnpm defaults to a frozen lockfile, such as in CI.
4. For backend plugins, install with `pnpm install --frozen-lockfile --offline`.

Offline stays offline. When pnpm reports that its cache lacks the metadata or tarball for a package, the step fails and names the package and the setting that would have put it in the cache. It does not retry with `--prefer-offline`. A caller that asked for an offline bundle usually has no network to fall back to, and reaching for one anyway turns a clear failure into a build that cannot be reproduced. The `ERR_PNPM_NO_OFFLINE_*` codes are matched only to turn that failure into a message that says which setting was missing from [Bundle Settings](#bundle-settings).

#### Bundle Settings

Two groups of settings are copied.

The first group makes the offline steps work: `storeDir`, `cacheDir`, `minimumReleaseAge`, `minimumReleaseAgeExclude`, `resolutionMode`, and `allowBuilds`. pnpm's store and metadata cache are global on the machine, not per repo, and the offline steps rely on both having been filled by the install in the source repo. The store and cache settings are copied so the bundle looks in the same place, and relative paths are resolved against the source root. `minimumReleaseAge` and `resolutionMode` are copied because pnpm keeps a separate metadata cache per value. `allowBuilds` is copied so the bundle builds the same native dependencies as the source project.

The second group changes what the lockfile resolves to: `packageExtensions`, `patchedDependencies`, `peerDependencyRules`, `ignoredOptionalDependencies`, `supportedArchitectures`, `autoInstallPeers`, `excludeLinksFromLockfile`, `dedupePeerDependents`, `catalog`, and `catalogs`. pnpm records these in the lockfile, for example as `packageExtensionsChecksum`, and re-resolves the seeded lockfile when they do not match. It does so without an error, so a bundle built without them is quietly wrong: a dependency that `packageExtensions` added is dropped, and a patched dependency is installed unpatched. `patchedDependencies` names patch files, so the files are copied into the bundle and the setting is rewritten to point at the copies. A patch file that does not exist is reported and left out.

Settings that describe the workspace layout of the source project are not copied, because the bundle is a single package with its own linker. Everything else that the source project sets is named in a warning, so that a setting the bundle does not know about does not change the result unnoticed.

`pnpm-lock.yaml` has an `importers` section keyed by workspace directory. The bundle is a different project, so its importers do not match the seeded lockfile. The prune step relies on pnpm keeping the `packages` and `snapshots` entries that the bundle still resolves to and dropping the rest. A resolution that is missing from the cache is a bundle settings problem, and it is reported as one.

### Lint Rule Fixer

The `no-undeclared-imports` rule in `@backstage/eslint-plugin` is plain JavaScript with a synchronous fixer. It cannot call the async `detectPackageManager()`. The fixer follows the same order synchronously, as far as it needs to: the `packageManager` field in the workspace root `package.json` when it names a supported package manager, then `pnpm-lock.yaml`, then Yarn. All it decides is whether the fix names `pnpm add` or `yarn add`.

### DevTools Backend

`@backstage/plugin-devtools-backend` has its own copy of the `yarn.lock` parser for the Info tab. It does not depend on `@backstage/cli-node`, and adding that dependency would pull CLI-only packages into a backend runtime. The plugin keeps a local parser. It picks the parser the same way the fixer does, by the `packageManager` field first and lockfile presence second, and gains a pnpm parser that only reads package names and versions.

### Backward Compatibility

Breaking change, shipped as a `minor` bump:

- The `Lockfile` class in `@backstage/cli-node` is renamed to `YarnLockfile`. `@backstage/repo-tools` and the CLI modules are updated to the new name.

Non-breaking changes, shipped as `patch` bumps:

- `PackageManager`, `Lockfile`, `detectPackageManager()`, and the two implementations become public exports of `@backstage/cli-node`.
- `targetPaths` in `@backstage/cli-common` gains `workspaceRootDir` and `installationRootDir`. `rootDir` keeps its value and is deprecated.
- `hasBackstageYarnPlugin()` stays. It is marked deprecated in favor of `versionStrategy()` on the detected package manager.
- The `--alwaysYarnPack` alias of `build-workspace` stays.
- `resolvePackagePath()` in `@backstage/backend-plugin-api` gains the retry described in [Node Linker](#node-linker). Packages found by the normal lookup resolve as before.
- `repo test` finds the packages of pnpm workspaces. Yarn workspaces are read as before.
- No CLI command is renamed or removed.

## Release Plan

The work is split into stacked pull requests.

1. The three locations in `@backstage/cli-common`: `workspaceRootDir` and `installationRootDir`, the `@manypkg/find-root` lookup, and moving every caller of `rootDir` onto one of the two names. No behavior change for a repository where all three coincide, which is every Yarn repository today.
2. Package manager API in `@backstage/cli-node` and the `YarnLockfile` rename, on top of the settled locations. Detection warnings go to stderr, and `--since` treats every package as changed when the lockfile cannot be diffed or its workspace entries cannot be named. No other behavior change for Yarn projects.
3. Move every command onto the API. No behavior change.
4. pnpm implementation and detection, workspace discovery through `@manypkg/get-packages`, and the lockfile parser on `@pnpm/*`. Existing pnpm projects start working with the CLI.
5. Catalogs: `versionStrategy()`, catalog reads and writes, `versions:bump --catalog`, and `versions:migrate` moving an existing pnpm app into the `backstage` catalog.
6. `package bundle` under pnpm.
7. `create-app --package-manager pnpm` and the template, together with the `resolvePackagePath()` retry in `@backstage/backend-plugin-api`. The generated backend needs it to find the `app` package.
8. End-to-end tests and the `E2E Linux pnpm` job.
9. Documentation.

pnpm support is documented as experimental in the first release that ships it. It is documented as stable after one full release cycle with the end-to-end job green.

## Dependencies

None on other BEPs. The work builds on the CLI module system and the internal `PackageManager` interface in `@backstage/cli-node`.

## Alternatives

**A separate `@backstage/cli-module-package-manager-pnpm` package.** CLI modules can only register commands. A module that provides a package manager would need a new public registration API, and every command would need to look up the provider. A pnpm module can still be added later for pnpm-only commands, like the Yarn module does for patch verification.

**Hand-write the lockfile parser on top of the `yaml` package.** This is what an earlier draft proposed, to avoid an ESM-only dependency while Backstage still supported Node.js 22.0. With the floor at Node.js 24 the only cost left is a dynamic `import()` from a CommonJS build, which is far cheaper than owning a parser for a format pnpm keeps evolving.

**Support the `isolated` linker first.** This breaks plugins with undeclared imports. `hoisted` is a drop-in for what Yarn produces today.

**Explicit ranges under pnpm instead of catalogs.** This is what an earlier draft proposed: `versions:bump` would rewrite every `@backstage/*` range in every `package.json`, as Yarn does without the plugin. It works, but it spreads one decision across every package in the installation and gives no way to track two release lines at once. Catalogs are a native pnpm feature that solves both, so the extra scope is worth it.

**A custom pnpm resolver for a `backstage:` protocol.** Custom resolvers arrived in pnpm 11 and could reproduce `backstage:^` under pnpm. That would mean shipping and maintaining a pnpm plugin as well as the Yarn one, to reach a place catalogs already reach natively. A follow-up at most.

**Keep Yarn and set `nodeLinker: pnpm`.** This gives Yarn users a pnpm-style layout but does not help adopters who want the pnpm CLI, its lockfile, or a pnpm monorepo.
