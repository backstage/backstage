---
title: Workspace Release Restructure
status: implementable
authors:
  - '@Rugvip'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: 2026-05-18
---

# BEP: Workspace Release Restructure

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
  - [Workspace layout](#workspace-layout)
  - [Workspace map](#workspace-map)
  - [Release cadence per workspace](#release-cadence-per-workspace)
  - [Staged changes](#staged-changes)
  - [Mainline and next releases from the same branch](#mainline-and-next-releases-from-the-same-branch)
  - [Promoting staged changes](#promoting-staged-changes)
  - [Patch releases](#patch-releases)
- [Design Details](#design-details)
  - [Repository layout](#repository-layout)
  - [Staged change file format](#staged-change-file-format)
  - [Author workflow](#author-workflow)
  - [Release workflow](#release-workflow)
    - [Triggering publishing in the private repo](#triggering-publishing-in-the-private-repo)
    - [Publish-time safeguards](#publish-time-safeguards)
  - [Framework versioning and the release lifecycle](#framework-versioning-and-the-release-lifecycle)
  - [Repository tooling](#repository-tooling)
  - [Tooling consolidation with backstage-community-plugins](#tooling-consolidation-with-backstage-community-plugins)
  - [Documentation and microsite](#documentation-and-microsite)
  - [Backstage release manifest](#backstage-release-manifest)
  - [OIDC binding mechanics](#oidc-binding-mechanics)
  - [Next pre-release versioning](#next-pre-release-versioning)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

This BEP proposes restructuring the `backstage/backstage` repository from a single
Yarn workspace into a set of independent workspaces under a top-level `workspaces/`
directory, modeled on `backstage/community-plugins`. Each workspace owns its own
packages, changesets, version lines, and release cadence, so a bug fix in one area
no longer drags the rest of the repository through a release.

It also introduces an opt-in "staged change" mechanism: a breaking (or otherwise
held-back) change is committed to `main` as a description plus a patch file under
a per-workspace `.staged/` directory. Mainline `@latest` releases flow continuously
from `main` and never apply staged entries, while `@next` releases are produced by
applying the queued staged entries on top of `main`. When a workspace is ready to
ship its accumulated batch, a bot-maintained `Promote staged` PR merges them into
`main` as a single coordinated release. This lets a deprecation and its eventual
removal be authored in the same PR, and keeps the set of queued breaking changes
verifiable on every push.

Finally, the `framework` workspace adopts a date-based release identifier of the
form `YYNN` (e.g. `2604`, `2610`) that names the Backstage release and keys the
release manifest. The identifier does not determine the semver of any individual
package — every framework package keeps its own independent semver and moves at
the pace its API stability allows.

## Motivation

The current single-workspace release model has accumulated a number of well-known
problems:

- Releases happen on a fixed weekly cadence regardless of whether the change is a
  one-line bug fix or a multi-package feature. Small fixes wait, and large changes are
  rushed into the next cut-off.
- Breaking changes for the core framework are scary, infrequent, and tend to bunch up.
  Adopters perceive the framework as both "too noisy" (frequent minor bumps) and
  "too disruptive" (occasional sweeping breaks), which is the worst of both worlds.
- Deprecations linger for many minor versions, sometimes years, because the deprecation
  PR and the removal PR are separated by an unbounded amount of time. Removal PRs
  routinely conflict with intervening changes and require non-trivial rebasing.
- There is no structured representation of what breaking changes are queued up. We
  cannot easily generate a "what is coming in the next major" overview, and we cannot
  guarantee that an in-flight breaking change still applies cleanly to the latest
  `main`.
- A breaking-change branch that is kept in sync with `main` indefinitely is
  operationally expensive and tends to rot.
- Plugin areas that are stable (e.g. the framework APIs) are coupled to plugin areas
  that want to move quickly (e.g. catalog, scaffolder). A bug-fix release of one plugin
  drags the entire monorepo through a release.
- Conversely, plugin areas that want to ship breaking changes more often (such as
  `ui`, where the BUI design system is in active development) are gated on the core
  framework's slow major-version cadence.

The `backstage/community-plugins` repository already demonstrates that a per-workspace
release model works well for a multi-repository-like set of plugins inside a single git
repository. The remaining gap is a way to handle deprecations and breaking changes
cleanly, which is what the patch mechanism is designed to solve.

### Goals

- Allow each area of Backstage (framework, catalog, scaffolder, auth, ...) to release on
  its own cadence, with its own changeset queue.
- Move every package — published or private — into a per-area workspace, so that the
  repository root is package-free and is not itself a Yarn workspace.
- Ship non-breaking changes from `main` continuously, without waiting for a weekly
  release cycle.
- Represent every queued breaking change as a reviewable artifact that
  lives in `main` and is verified to apply cleanly on every PR.
- Allow a deprecation and its eventual removal to be authored together in a single PR.
- Produce ongoing `next` releases that preview the result of applying all queued
  breaking patches, while `latest` releases remain non-breaking.
- Move the core framework onto a slower, predictable release cadence with a clear,
  human-readable version label.
- Preserve the current security boundary: package publishing continues to happen from a
  separate, private repository, never from `backstage/backstage` itself.
- Share the underlying tooling with `backstage/community-plugins` and with any other
  repository that wants to adopt this same workspace structure and release process,
  so that improvements benefit every consumer.

### Non-Goals

- This BEP does not propose to physically split `backstage/backstage` into multiple git
  repositories. Everything still lives in one repo.
- This BEP does not propose changes to the public package names or import paths.
- This BEP does not change how adopters consume Backstage releases, beyond introducing
  more frequent `latest` releases and a more meaningful version scheme for the core
  framework.
- This BEP does not pre-commit to a specific set of breaking changes for any workspace.
  It only describes the mechanism by which they will be authored and released.

## Proposal

### Workspace layout

The repository moves from a single root Yarn workspace to a set of independent
workspaces under a top-level `workspaces/` directory, matching the layout used by
`backstage/community-plugins`:

```
workspaces/
  framework/
    package.json
    yarn.lock
    .changeset/
    packages/
    plugins/
  catalog/
    ...
  scaffolder/
    ...
  ...
```

Each workspace:

- Has its own `package.json`, `yarn.lock`, and `tsconfig.json`.
- Has its own `.changeset/` directory and `changeset` configuration.
- Has its own `.staged/` directory of pending breaking changes (see
  [Staged changes](#staged-changes)).
- Is independently releasable and has an independent version line per package.

No packages live at the repository root once the migration is complete. The root is
not a Yarn workspace — every package, including private development packages, is
owned by exactly one workspace under `workspaces/`. The root keeps only repo-wide
concerns: BEPs, top-level cross-cutting docs, the `.github/` workflows, shared
tooling configuration, and the CI workflow that fans out to per-workspace jobs.

### Workspace map

Every package in `packages/` and `plugins/`, published or private, is assigned a
home in the new layout. The workspaces below are grouped into three categories:
the framework and the supporting workspaces around it, the plugin workspaces that
release independently, and the private workspaces that exist but do not publish
anything.

> **Note**: This mapping is a proposal for review. Many packages have plausible homes in
> more than one workspace, and the boundaries should be debated before we commit.

#### Framework and supporting workspaces

##### Workspace: `framework`

The slowly-evolving framework core: the plugin and app APIs, the backend system, the
defaults, plus the foundational cross-cutting features (events, signals, integrations)
that other plugins build on. Intended cadence: slow, on the order of months between
major releases.

Defaults packages (`app-defaults`, `backend-defaults`, `frontend-defaults`) are included
because they are conceptually part of the framework. Although they tend to absorb
breaking changes more often than the rest of the framework, the framework release
cadence under this BEP is frequent enough that a shared cadence with the rest of the
workspace is acceptable, so we do not split them out.

Packages from `packages/`:

- `@backstage/app-defaults`
- `@backstage/backend-app-api`
- `@backstage/backend-defaults`
- `@backstage/backend-dev-utils`
- `@backstage/backend-dynamic-feature-service`
- `@backstage/backend-internal` (currently `packages/backend-internal`, private)
- `@backstage/backend-openapi-utils`
- `@backstage/backend-plugin-api`
- `@backstage/backend-test-utils`
- `@backstage/config`
- `@backstage/config-loader`
- `@backstage/core-app-api`
- `@backstage/core-compat-api`
- `@backstage/core-plugin-api`
- `@backstage/e2e-test` (currently `packages/e2e-test`, private)
- `@backstage/e2e-test-utils` (currently `packages/e2e-test-utils`, private)
- `@backstage/errors`
- `@backstage/filter-predicates`
- `@backstage/frontend-app-api`
- `@backstage/frontend-defaults`
- `@backstage/frontend-dev-utils`
- `@backstage/frontend-dynamic-feature-loader`
- `@backstage/frontend-internal` (currently `packages/frontend-internal`, private)
- `@backstage/frontend-plugin-api`
- `@backstage/frontend-test-utils`
- `@backstage/integration`
- `@backstage/integration-aws-node`
- `@backstage/integration-react`
- `@backstage/module-federation-common`
- `@backstage/opaque-internal`
- `@backstage/release-manifests`
- `@backstage/core-components`
- `@backstage/test-utils`
- `@backstage/theme`
- `@backstage/types`
- `@backstage/version-bridge`

Plugins from `plugins/`:

- `@backstage/plugin-app`, `plugin-app-backend`, `plugin-app-node`, `plugin-app-react`, `plugin-app-visualizer`
- `@backstage/plugin-bitbucket-cloud-common`
- `@backstage/plugin-events-backend`, `plugin-events-backend-test-utils`, `plugin-events-node`
- All `@backstage/plugin-events-backend-module-*` packages
- `@backstage/plugin-gateway-backend`
- `@backstage/plugin-permission-backend`, `plugin-permission-backend-module-policy-allow-all`, `plugin-permission-common`, `plugin-permission-node`, `plugin-permission-react`
- `@backstage/plugin-signals`, `plugin-signals-backend`, `plugin-signals-node`, `plugin-signals-react`

##### Workspace: `cli`

All CLI and developer-tooling packages. Independent from `framework` so that CLI
improvements can ship continuously, and the first non-`framework` workspace to
migrate so it can exercise the new release tooling end to end.

- `@backstage/cli`, `@backstage/cli-common`, `@backstage/cli-defaults`, `@backstage/cli-internal` (private), `@backstage/cli-node`
- All `@backstage/cli-module-*` packages. The shared release-automation CLI lives
  separately in the `tooling` workspace below — it is not a CLI module.
- `@backstage/codemods`
- `@backstage/create-app`
- `@backstage/dev-utils`
- `@backstage/eslint-plugin`
- `@backstage/repo-tools`
- `@backstage/yarn-plugin`

##### Workspace: `tooling`

A constrained workspace that hosts the release-automation scripts run by this
repository's workflows _and_ the standalone CLI that ships that same automation to
other adopters (`backstage/community-plugins` and any third party using this
structure). It is the only workspace where runtime code must be dependency-free, it
is not a Backstage CLI module, and it does not follow the standard Backstage
monorepo layout. See [Repository tooling](#repository-tooling) for the full
constraints and the rationale.

- The published standalone CLI for managing workspaces, staged changes, and
  `@next` version computation. The package name is left to implementation.
- Additional in-repo-only entrypoints used by this repository's workflows (the
  Promote staged PR builder, the manifest updater, the OIDC dispatch helper,
  etc.). These may be co-located in the same package or in private packages
  within the workspace.

##### Workspace: `ui`

The new Backstage UI design system, the migration tooling that helps adopters move
to it, and the documentation site for the design system. Separated from `framework`
so that the BUI surface can ship breaking changes on its own schedule, which is
expected to be faster than the framework's. `@backstage/theme` and
`@backstage/core-components` stay in `framework` because the framework's defaults
and many existing plugins still depend on them; `ui` carries only the new design
system for now.

- `@backstage/ui`
- `@backstage/plugin-mui-to-bui` (the MUI → BUI migration aid)
- The `docs-ui` Next.js site, currently at the repository's top-level `docs-ui/`
  folder. Like `microsite`, it is a private workspace package and is not published.

#### Plugin workspaces

##### Workspace: `catalog`

The catalog plugin family.

- `@backstage/catalog-client`
- `@backstage/catalog-model`
- `@backstage/plugin-catalog`, `plugin-catalog-backend`, `plugin-catalog-common`, `plugin-catalog-graph`, `plugin-catalog-import`, `plugin-catalog-node`, `plugin-catalog-react`
- `@backstage/plugin-catalog-unprocessed-entities`, `plugin-catalog-unprocessed-entities-common`
- All `@backstage/plugin-catalog-backend-module-*` packages

##### Workspace: `scaffolder`

- `@backstage/plugin-scaffolder`, `plugin-scaffolder-backend`, `plugin-scaffolder-common`, `plugin-scaffolder-node`, `plugin-scaffolder-node-test-utils`, `plugin-scaffolder-react`
- `@backstage/scaffolder-internal` (currently `packages/scaffolder-internal`)
- All `@backstage/plugin-scaffolder-backend-module-*` packages

##### Workspace: `auth`

- `@backstage/plugin-auth`, `plugin-auth-backend`, `plugin-auth-node`, `plugin-auth-react`
- All `@backstage/plugin-auth-backend-module-*` packages

##### Workspace: `techdocs`

- `@backstage/plugin-techdocs`, `plugin-techdocs-backend`, `plugin-techdocs-common`, `plugin-techdocs-node`, `plugin-techdocs-react`
- `@backstage/plugin-techdocs-addons-test-utils`, `plugin-techdocs-module-addons-contrib`
- `@backstage/techdocs-cli`, `@backstage/techdocs-cli-embedded-app`

##### Workspace: `search`

- `@backstage/plugin-search`, `plugin-search-backend`, `plugin-search-backend-node`, `plugin-search-common`, `plugin-search-react`
- All `@backstage/plugin-search-backend-module-*` packages

##### Workspace: `notifications`

The notifications plugin family is kept in its own workspace rather than folded into
`framework`, because we expect it to evolve at a different speed and have its own
module ecosystem.

- `@backstage/plugin-notifications`, `plugin-notifications-backend`, `plugin-notifications-common`, `plugin-notifications-node`
- All `@backstage/plugin-notifications-backend-module-*` packages

##### Workspace: `kubernetes`

- `@backstage/plugin-kubernetes`, `plugin-kubernetes-backend`, `plugin-kubernetes-cluster`, `plugin-kubernetes-common`, `plugin-kubernetes-node`, `plugin-kubernetes-react`

##### Workspace: `api-docs`

- `@backstage/plugin-api-docs`, `plugin-api-docs-module-protoc-gen-doc`

##### Workspace: `devtools`

- `@backstage/plugin-devtools`, `plugin-devtools-backend`, `plugin-devtools-common`, `plugin-devtools-react`
- `@backstage/plugin-config-schema` — a frontend plugin that mounts a route in the
  app for browsing the live config schema; conceptually a developer tool.

##### Workspace: `home`

- `@backstage/plugin-home`, `plugin-home-react`

##### Workspace: `org`

- `@backstage/plugin-org`, `plugin-org-react`

##### Workspace: `user-settings`

- `@backstage/plugin-user-settings`, `plugin-user-settings-backend`, `plugin-user-settings-common`

##### Workspace: `proxy`

- `@backstage/plugin-proxy-backend`, `plugin-proxy-node`

##### Workspace: `mcp`

- `@backstage/plugin-mcp-actions-backend`

#### Private workspaces

##### Workspace: `microsite`

The Docusaurus site that powers `backstage.io`. The workspace is private — it does
not publish any packages — and is included in the workspace map for completeness.
See [Documentation and microsite](#documentation-and-microsite) for how plugin
docs are pulled in at build time.

##### Workspace: `demo`

The end-to-end example Backstage app for the project. Today this lives in the
separate `backstage/demo` repository (the source of `demo.backstage.io`); under this
BEP it folds into the main repository as a private workspace at `workspaces/demo/`.

The demo workspace owns one canonical example frontend app, one example backend, and
any demo-specific plugins (currently a small catalog processor module and a
notifications tester backend). It is private — no packages from it are published.
Local development and the Docker build for the deployed demo both work by Yarn
workspace linking, so changes to any other workspace flow into the demo build from
source without going through npm. The trade-off is that building the demo requires
`yarn install`-ing every workspace it depends on, which we accept as the cost of
having one always-up-to-date end-to-end example.

This replaces the legacy `packages/app`, `packages/app-legacy`, `packages/backend`,
`packages/app-example-plugin`, and `plugins/example-todo-list*` examples that
previously lived at the repository root. None of those have a place under the new
layout: the legacy frontend system example is dropped, the toy todo-list plugin is
dropped, and the canonical example app/backend become the demo workspace.

Plugin workspaces may still keep their own minimal local-development setup (a small
example app and/or backend used while iterating on the plugin), mirroring the
`backstage/community-plugins` convention. That setup is per-workspace, not shared,
and is for development only — it does not double as a project-wide example.

### Release cadence per workspace

Every workspace uses the same mainline-release mechanism: the changesets bot
maintains a `Version Packages (<workspace>)` pull request that accumulates pending
changesets and bumps versions. A maintainer reviews and merges that PR, and the
merge triggers an `@latest` release for that workspace.

There is no configurable release cadence. A workspace releases whenever a
maintainer decides to merge its Version Packages PR, and the practical cadence is
purely a function of how often that happens — `framework` ships rarely, `home`
ships whenever a fix lands.

#### Finding pending releases

Because every workspace has its own Version Packages PR, the number of open ones
gets unwieldy to find in the regular PR list. To make pending releases easy to
discover and act on:

- Every Version Packages PR carries a well-known label (e.g. `release: pending`),
  applied by the release workflow when the PR is opened or updated.
- A bot-maintained tracking issue (e.g. `Pending releases`) is kept up to date with
  a checklist of all open Version Packages PRs across every workspace, grouped by
  workspace and annotated with the number of changesets queued.

The label and the tracking issue together give maintainers a one-click overview of
"what's ready to release right now" without changing the underlying flow.

#### How this interacts with `@next` and major releases

The `Version Packages` PR only governs `@latest` releases. Two adjacent flows have
their own triggers and are independent of it:

- **Releases that promote queued staged changes** follow a separate, uniform flow
  described in [Promoting staged changes](#promoting-staged-changes). That flow is
  the same for every workspace.
- **`@next` pre-releases** ship from the staged changes themselves, independent of
  the Version Packages PR. The exact semantics of when an `@next` ships and which
  major it targets are unchanged from
  [Next pre-release versioning](#next-pre-release-versioning) but are flagged for
  follow-up review (see the note at the end of that section).

#### Workspace-level versioning

The framework workspace uses the date-based `YYNN` scheme described in
[Framework versioning and the release lifecycle](#framework-versioning-and-the-release-lifecycle).
In every other workspace, the root `package.json` stays at a fixed
`version: "0.0.0"` and is never bumped — those workspaces do not have a
workspace-level version, only per-package semver. Their GitHub releases are tagged
by date.

### Staged changes

A "staged change" is a strict superset of a regular Changesets `changeset`. Where a
changeset captures _what_ will bump in the next release, a staged change additionally
captures _the actual code change_ that will produce that bump. A single staged-change
entry is composed of three things:

1. A **description**: a human-readable note in changeset front-matter format. It
   names the packages that the change affects and is used both as the eventual
   changelog entry and as the synthesized changeset that drives version computation
   in the `Promote staged` PR and in `@next` releases.
2. A **patch**: a git diff that, when applied to the current state of the
   workspace, transforms it into the form it will take after the change ships.
   This is what makes the entry self-contained: the description without the patch
   would just be a normal changeset, and the patch without the description would
   just be a diff with no release semantics.
3. **Optional metadata**: related issue/PR numbers and `notBefore` constraints
   (see [Staged change file format](#staged-change-file-format) for details). Apply
   order is encoded in the entry's slug, not in metadata.

Staged changes are an **opt-in** mechanism for any change that should ship in a
coordinated batch with the next named release of the workspace, instead of
streaming straight into `@latest`, or that should be available in `@next`
previews without ever automatically reaching `@latest`. Workspaces that don't
opt in keep shipping breaking changes the traditional way — as regular
changesets that the next release of the workspace promotes through Version
Packages. The motivating use case for opting in is breaking changes that need
to be rolled out carefully, but the same mechanism is also useful for:

- **Experimental features** that should preview through `@next` but stay out of
  `@latest` until they're stabilized (see the `experimental` flag in
  [Staged change file format](#staged-change-file-format)). An experimental
  entry can be dropped without ever shipping, or graduated to stable later via a
  separate PR.
- **Non-breaking features held back for a coordinated batch**, where the team
  wants the feature to ship alongside other related changes rather than dribble
  out into `@latest`.

The description's front-matter may declare any bump level: `major`, `minor`, or
`patch` (with the usual Backstage convention that `minor` is the breaking bump
for `0.x` packages). The staging tooling does not constrain the bump level; it
only requires that the description is a valid changeset.

This means non-breaking changes have two valid paths:

- The **normal Changesets flow** for things that should ship to `@latest` as soon
  as the workspace next releases (the default).
- The **staged-change flow** for things that should be held back from `@latest`
  until the next coordinated batch ships, while still showing up in the `@next`
  preview.

The same entry serves two consumers downstream:

- The **`Promote staged` PR builder** applies the patch to `main` and uses the
  description to synthesize a real changeset, which then drives the eventual
  `@latest` release through the normal Changesets version-and-publish flow
  (see [Promoting staged changes](#promoting-staged-changes)).
- The **`dispatch-next` job** does the same in a temporary checkout to compute the
  next `@next` snapshot (see
  [Next pre-release versioning](#next-pre-release-versioning)).

The mechanics are built on top of Changesets — staging adds a patch file and some
metadata alongside the changeset, and the surrounding tooling treats the bundle as
the unit of work — so the staged-change tooling does not reimplement version
computation, changelog generation, or any other Changesets responsibility.

Staged changes live under each workspace in a `.staged/` directory, and are checked
on every PR: the CI applies them in order to verify that they still cleanly transform
the workspace. Any PR that mutates code touched by an open staged change is required
to update that staged change as part of the same PR; this is the property that
guarantees the queue never rots.

A PR that introduces a deprecation can include the staged change that removes the
deprecation in the same PR. Reviewers can read both the deprecation diff and the
removal diff side by side, the deprecation ships immediately to `@latest`, the
removal ships to `@next` on the same merge, and the eventual cleanup is no longer
the responsibility of a future contributor.

### Mainline and next releases from the same branch

This is the central operational property of the proposal. From a single linear `main`
branch:

```
                main HEAD
                     │
   ┌── apply zero staged changes ──> publish @latest of every changed package
   │                                  (e.g. plugin-catalog 1.42.0)
   │
   └── apply queued .staged/* in order ──> publish @next of every package
                                            affected by a staged change, at the
                                            base version that the staged set bumps
                                            them to (typically the next major,
                                            e.g. plugin-catalog 2.0.0-next.<N>)
```

The `<N>` suffix on `@next` releases is a per-workspace counter that is shared by
every package in a given `@next` publish, so that any two packages with the same
`<N>` came from the same `@next` snapshot. `@next` publishes nothing when the
workspace has no staged changes. See
[Next pre-release versioning](#next-pre-release-versioning) for the full rules.

There is no long-lived "next" branch. There are no cross-branch merges. The set of
breaking changes that will be in the next major is exactly the set of patch files
currently in `main`, which is easy to read, review, list, and reason about.

### Promoting staged changes

Every workspace has one persistent, bot-maintained pull request titled
`Promote staged (<workspace>)`. The PR represents what the next release of the
workspace would look like if it were cut right now.

On every push to `main` that affects a workspace, CI rebuilds the PR for that
workspace from scratch:

1. Apply every staged change from `workspaces/<name>/.staged/` in file-name order.
2. For each staged change, synthesize a regular changeset under `.changeset/` from
   its front-matter `packages` map and its markdown body (with the trailing patch
   code block stripped), so the changeset bot produces the right version bumps
   when the PR is merged.
3. Delete the staged change files from `.staged/`.
4. Commit the result and force-push to the PR branch.

The PR is created and kept open even when the workspace has no staged changes. In
that state it carries a single empty changeset and the description "no staged
changes queued"; this avoids the noise of creating and closing the PR repeatedly as
staged changes come and go.

The Promote staged PR is opened as a regular pull request — the same shape as a Version
Packages PR — and the regular review-and-merge process is the one that applies.
Merging the PR is the signal to ship: it triggers the release through the same
mainline flow the workspace uses for every other release, with no separate publish
path. In the typical case the staged set contains breaking changes that bump the
affected packages' majors. For the `framework` workspace the named release
identifier always advances to a new `YYNN` regardless of which packages bumped (see
[Framework versioning and the release lifecycle](#framework-versioning-and-the-release-lifecycle)).
For every other workspace the per-package bumps come straight from the staged set;
if every staged change happens to be non-breaking, the resulting bumps are just
minor or patch.

Maintainers may manually convert the PR to draft at any time, for example to signal
that the staged set is not yet ready for review or to defer the release. The bot
respects that state and does not convert the PR back from draft to ready on
subsequent updates; the only thing it does is keep the branch up to date by
force-pushing on every relevant change to `main`.

Because the PR is force-pushed on every relevant change to `main`, the branch
protection on the PR's base branch must enable "Dismiss stale pull request
approvals when new commits are pushed", so that an approval cast before a
force-push does not carry over to the post-force-push branch. This is the standard
branch-protection setting Backstage already uses elsewhere; we just want to make
sure it stays on.

### Patch releases

The existing patch-release flow stays mostly as it is today, adapted to multiple
workspaces. The exact tooling is evolving in parallel to this BEP and the details
are out of scope here. The parts that touch the workspace structure are:

- **Branch naming.** Patch branches use the prefix `patch/`, followed by either
  the framework workspace and release identifier (e.g. `patch/framework/2604`)
  or a workspace and package major-version line
  (e.g. `patch/catalog/@backstage/plugin-catalog@2`).
- **Branch protection.** Every `patch/**` branch is protected with the same shape
  as `main`: required reviews, CODEOWNERS-restricted push, all required status
  checks. The published source of an old release line cannot be retroactively
  rewritten.
- **Eligibility.** Back-ports are only accepted for packages at `1.0.0` or above.
  Packages still in the `0.x` range ride the mainline flow; their adopters
  upgrade to the current published version rather than pin to a back-ported
  line. The semver semantics of `0.x` ("anything can change") do not match a
  multi-line support model.

As a potential future direction, back-ports could be authored as structured
artifacts in `main` — for example by extending the staged-change file format
with metadata that points the patch at a past release line — so that the same
authoring, validation, and review surface is shared by both forward-looking
staged changes and backward-looking patches. That evolution is intentionally
out of scope for this BEP; the design above only commits to the branch naming,
the protection model, and the `1.0.0` eligibility rule.

## Design Details

### Repository layout

```
workspaces/
  <workspace-name>/
    package.json            # workspace root
    yarn.lock
    tsconfig.json
    backstage.json
    .changeset/
      config.json
      *.md
    .staged/
      <slug>.md             # YAML front-matter + body + trailing patch code block
    packages/
      <package>/...
    plugins/
      <plugin>/...
```

The repository root keeps:

- A minimal `package.json` at the root with no `workspaces` field — the root is not
  itself a Yarn workspace. It carries only repository-wide metadata and developer
  scripts that delegate into the per-workspace setups.
- `beps/`, `docs/`, `OWNERS.md`, `CONTRIBUTING.md`, etc.
- `.github/workflows/` that fan out per-workspace jobs.

Each per-workspace `package.json` declares the Node engine range it supports, which is
how the CI matrix is computed (the same approach used in community-plugins).

### Staged change file format

A staged change is a single markdown file under `<workspace>/.staged/<slug>.md`. The
slug starts with a UTC timestamp of the form `YYYYMMDD-HHMMSS` recorded when the
entry is created, so that lexicographic file-name sort puts entries in the order
they were authored. The file has two parts:

1. **YAML front-matter** with a `packages` map and any additional metadata keys.
2. **A markdown body** with the human-readable description, followed by a fenced
   code block tagged `patch` (or `diff`) that holds the git diff. The patch block
   is required to be the **last** fenced code block in the file; tooling extracts
   it from the end and treats whatever comes before it as the description.

```
workspaces/catalog/.staged/
  20260518-143012-remove-deprecated-entity-ref-link-props.md
```

````markdown
---
packages:
  '@backstage/plugin-catalog': major
  '@backstage/plugin-catalog-react': major
relatedPrs: [12345, 12678]
notBefore:
  # ISO date — exclude this staged change from @next until at least this date
  date: 2026-09-01
  # OR: depend on other staged changes being shipped first. References can point to
  # entries in the same workspace or in a different workspace; the gate is satisfied
  # once the referenced entry has been merged into main.
  staged:
    - framework/20260301-091500-remove-config-mode-flag
    - auth/20260415-152230-rotate-token-format
---

Removed the deprecated `EntityRefLink` props `defaultKind` and `defaultNamespace`.
Pass these as part of the `entityRef` instead.

```patch
diff --git a/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx b/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
--- a/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
+++ b/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
@@ ... @@

- defaultKind, defaultNamespace,
- ...
```
````

Apply order is determined by file-name sort within the `.staged/` directory of a
workspace. The timestamp prefix is `YYYYMMDD-HHMMSS` in UTC (e.g.
`20260518-143012-`), which makes lexicographic sort identical to chronological
sort and removes the need to renumber entries when a new one is inserted between
two existing ones. The timestamp is filled in by the staging tooling at the time
the entry is created and is not edited afterwards (refreshes keep the original
timestamp). Slugs must be unique within a workspace.

The front-matter is intentionally _not_ a Changesets file as-is: the `packages` map
is nested under a single top-level key so that tooling can read it without having
to know which top-level keys are package names and which are metadata. When the
tooling synthesizes a real changeset for downstream consumption (e.g. for the
Promote staged PR or for `dispatch-next`), it lifts the `packages` map to the top-level of
the generated changeset and uses the markdown body — minus the trailing patch code
block — as the changeset description.

Supported top-level front-matter keys:

- `packages` (required): a map of package name to bump level, using the same syntax
  Changesets uses (`major`, `minor`, `patch`; with the usual Backstage convention
  that `minor` is the breaking bump for `0.x` packages).
- `relatedPrs` (optional): pointers to the PRs that authored or refreshed the
  staged change.
- `notBefore.date` (optional): ISO date before which the staged change must not be
  included in `@next`. Useful for honoring deprecation windows ("won't remove this
  until at least N months after deprecation").
- `notBefore.staged` (optional): list of `<workspace>/<slug>` references to other
  staged changes that must ship to `@latest` (i.e. be promoted into a major
  release) before this staged change is eligible for `@next`. This is how a staged
  change in one workspace can wait on a prerequisite in another workspace, even
  though the workspaces publish independently. Cross-workspace gates are checked
  when computing the set of staged changes to apply for a `@next` release: if a
  referenced entry is still present in any `.staged/` directory, the dependent one
  is skipped.

  This is a constraint, not a trigger. Promoting the staged changes of one
  workspace never automatically promotes the staged changes of another; each
  workspace decides when to cut its own major release. The constraint only affects
  which dependent staged changes become eligible for inclusion in the next major
  of the depending workspace when its maintainers do decide to cut it.

- `experimental` (optional, boolean): when `true`, the staged change is treated as
  experimental. It still participates in `@next` previews — adopters using `@next`
  can install and try it — but it is **never** automatically included in the
  `Promote staged` PR. The entry stays in `.staged/` indefinitely until a
  maintainer either:

  - **Drops the experiment**: removes the staged entry without ever shipping it.
    This is a legitimate end-state — staging something as experimental does not
    commit the project to ever promoting it.
  - **Graduates the experiment**: opens a separate PR that lands the feature
    directly in `main` (typically with a regular changeset for the appropriate
    semver bump) and deletes the staged entry as part of the same PR. The
    feature then ships to `@latest` through the normal Version Packages PR flow,
    independent of any future `Promote staged` PR merge.

  Experimental entries are otherwise subject to all the same validation as
  regular staged changes — their patch is applied on every PR to verify it still
  applies cleanly, the description must be valid, and so on. They just don't
  participate in promotion.

The patch payload is a normal `git` diff. We use `git apply` with `--3way` so that
trivial textual conflicts caused by unrelated edits to the same file can be
resolved automatically; non-trivial conflicts fail CI and require the author of
the conflicting PR to update the staged change.

### Author workflow

1. **Non-breaking change.** Author edits code, runs `yarn changeset` inside the
   workspace, commits. Same as today, scoped to one workspace.

2. **Breaking change with same-PR deprecation.** Author:

   1. Edits code to add the deprecated alias and a runtime warning.
   2. Runs `yarn changeset` for the deprecation (regular `minor`/`patch`).
   3. Runs `yarn release stage create <slug>`. The tool snapshots the
      current workspace, drops the author into a scratch state where they apply the
      removal, then captures the diff and prompts for a description, writing both
      into a single `.staged/<timestamp>-<slug>.md` file with the description as
      the markdown body and the diff as a trailing `patch` fenced code block.
   4. Commits. CI verifies the staged change applies cleanly on top of `main`.

3. **Updating an existing staged change.** When a PR conflicts with a queued staged
   change, CI fails with a pointer to the failing entry. The author runs
   `yarn release stage refresh <slug>`, which re-runs the
   apply/edit/capture loop and produces an updated staged change. The PR is required
   to include the refreshed entry.

4. **Promoting staged changes to a major.** No author action required. The
   bot-maintained `Promote staged (<workspace>)` PR already contains the result of
   applying every queued staged change (see
   [Promoting staged changes](#promoting-staged-changes)). To ship the release, a
   workspace maintainer follows the normal review-and-merge process for the
   workspace on that PR.

### Release workflow

The CI workflow follows the pattern established by community-plugins, extended with
two additions specific to this BEP: a per-workspace `Promote staged` PR that is
rebuilt on every push, and a per-workspace `@next` publish that runs whenever the
staged changes change.

```
on push to main:

  find-changed-workspaces
        │
        ├── matrix per workspace
        │
        └── release-workspace.yml
              ├── job: changeset-pr     (always — opens/updates the
              │                           "Version Packages (workspace)" PR)
              ├── job: promote-pr       (always — rebuilds the
              │                           "Promote staged (workspace)" PR by
              │                           applying every entry in .staged/)
              ├── job: dispatch-latest  (when a release commit is detected on main,
              │                           dispatches @latest publish to the
              │                           publishing repo)
              └── job: dispatch-next    (when the staged changes would produce a new
                                         @next version, dispatches @next publish
                                         to the publishing repo)
```

`find-changed-workspaces` is a direct port of the community-plugins script: it diffs
the push against its base and emits the list of workspaces with changes plus a node
version matrix.

`release-workspace.yml` is parameterized by `workspace`. Inside the job:

- `check-if-release` looks for `package.json` version bumps in the workspace between
  the previous and current commits (same as community-plugins).
- `promote-pr` always runs. It applies every staged change in a temporary checkout,
  synthesizes a changeset from each entry's front-matter and markdown body, deletes
  the entries from `.staged/`, and force-pushes the result onto the
  `Promote staged (<workspace>)` PR branch (see
  [Promoting staged changes](#promoting-staged-changes)).
- `dispatch-next` runs whenever (a) the staged changes set has changed for the
  workspace, or (b) a regular `@latest` release has just shipped for the workspace,
  and only when the workspace has at least one staged change in either case. It
  applies the staged entries to `main` in a temporary checkout, synthesizes a
  changeset from each entry's front-matter and markdown body, runs `yarn changeset version`
  against **only** that synthesized set (regular pending changesets in
  `.changeset/` are excluded), suffixes the resulting versions with `-next.<N>`
  from the shared workspace counter, and dispatches a publish with `tag: next`.
  Only packages directly affected by a staged change are bumped, at whatever
  semver bump the staged changesets declare. See
  [Next pre-release versioning](#next-pre-release-versioning) for the exact rules.

#### Triggering publishing in the private repo

The actual `npm publish` step never runs inside `backstage/backstage`. Instead, when a
release for a workspace is determined to be needed, the workflow sends a
[`repository_dispatch`](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event)
event to the private publishing repository with a `event_type` of
`backstage-release` and a payload of:

```json
{
  "event_type": "backstage-release",
  "client_payload": {
    "workspace": "catalog",
    "sha": "<git sha to publish>",
    "branch": "main",
    "tag": "latest"
  }
}
```

`tag` is a closed set. The only accepted values are `latest` and `next`; the
publishing repo treats the dispatch payload as input from a non-trusted source
and rejects any other value before doing any other work. Adding a new dist-tag
(e.g. `alpha`) requires an explicit change to the publishing repo's allow-list,
which is its own reviewed, separately-merged change.

`branch` tells the publishing repo which protected branch the SHA should be
reachable from. For mainline `@latest` and `@next` releases, the value is `main`.
For back-ported patch releases, the value is the specific `patch/<workspace>/...`
branch the dispatch was triggered from. The publishing repo validates that the
branch is either `main` or matches the protected `patch/**` pattern listed in
[Patch releases](#patch-releases) before doing any other work; any other value
is rejected.

The publishing repo applies the same safeguards regardless of which accepted
value is in the dispatch (see
[Publish-time safeguards](#publish-time-safeguards)).

`repository_dispatch` is chosen over `workflow_dispatch` because the trigger token only
needs the `repo` scope, not the `actions` scope, and because the dispatch event is
self-describing and easy to log. The dispatch is sent using a GitHub App or a
fine-grained PAT with permission to dispatch on the publishing repository and nothing
else.

The publishing repo is then responsible for:

- Validating the dispatch (see [Publish-time safeguards](#publish-time-safeguards)
  below).
- Checking out `backstage/backstage` at the supplied SHA.
- Running `yarn install` and `yarn build` for the workspace.
- Publishing to npm with provenance and an OIDC-bound npm token.
- Pushing back per-package git tags (e.g. `@backstage/plugin-catalog@2.3.0`),
  matching the convention `backstage/community-plugins` uses today.
- Pushing or moving a per-workspace `<workspace>@latest` tag to the commit that
  was just published, but **only** when the publish targets the current
  `@latest` of the workspace. Back-ports to older release lines do not move the
  tag. This gives every consumer of the repo a single stable reference for "the
  most recent published state" of each workspace — see for example
  [Documentation and microsite](#documentation-and-microsite), which uses these
  tags as the source for its build.
- The `framework` workspace additionally pushes an immutable tag carrying its
  named release identifier (e.g. `framework@2604`) on every Promote staged PR
  merge, so the date-based identifier can be looked up in git. No other
  workspace publishes a named-release tag.

This preserves the current security boundary: `backstage/backstage` never has an npm
token, and a compromised workflow run cannot publish a package.

#### Publish-time safeguards

The dispatch itself is not trusted. A compromised workflow run in
`backstage/backstage`, a leaked dispatch token, or a hijacked GitHub App installation
must never result in published code that did not go through code review on a
protected branch. The publishing repo enforces two independent checks:

1. **Ancestor check (all releases).** Before doing any work, the publishing workflow
   resolves the dispatch to the branch the SHA is expected to live on, and calls
   `GET /repos/backstage/backstage/compare/{sha}...{branch}` to refuse to continue
   unless the comparison status is `identical` or `ahead`. The expected branch is
   determined by the dispatch payload:

   - Releases from `main` (mainline `@latest` and `@next`): the expected branch is
     `main`.
   - Releases from a patch branch (back-ports): the expected branch is the
     `patch/<workspace>/...` branch the dispatch claims to be from. The publishing
     workflow first validates that the claimed branch name matches the protected
     `patch/**` pattern as listed in [Patch releases](#patch-releases); anything
     that doesn't match is rejected without a compare call.

   Because both `main` and `patch/**` branches enforce branch protection with code
   review and required status checks, "the SHA is on the expected protected
   branch" is equivalent to "the commit was reviewed and merged on a protected
   branch".

2. **OIDC binding (all releases).** Rather than trusting the `repository_dispatch`
   payload, the dispatching workflow in `backstage/backstage` first mints a GitHub
   Actions OIDC token and includes it in the dispatch payload (or hands it to a small
   broker that re-dispatches with the token attached). The publishing workflow
   validates the OIDC JWT and requires:

   - `repository == "backstage/backstage"`
   - `ref` matches the same branch the ancestor check above resolved (either
     `refs/heads/main` or the specific `refs/heads/patch/<workspace>/...` from the
     dispatch). A mismatch between the dispatched branch and the OIDC `ref`
     rejects the publish.
   - `event_name == "push"`
   - `workflow_ref` matches an allow-listed workflow file in `backstage/backstage`
     (`.github/workflows/release_workspace.yml` and any other release entry points).

   This cryptographically ties the dispatched SHA to a workflow run that GitHub itself
   agrees executed on the expected protected branch, defending against forged
   dispatches even if the token that sends them is compromised.

The current "nightly snapshot" release flow is expected to be removed as part of
this rollout.

### Framework versioning and the release lifecycle

The way the framework workspace versions its packages is one of the more
consequential decisions in this BEP, both for adopters (who pin Backstage releases by
the framework identifier) and for maintainers (who reason about what's safe to ship
between releases). This section spells out the scheme end to end.

#### Identifier format

The `framework` workspace adopts a date-based version line of the form `YYNN`,
where `YY` is the two-digit calendar year and `NN` is a two-digit slot number that
identifies which release in the project's cadence this is. The first release of
the scheme is whichever year we land it in.

`NN` reflects the **cadence slot**, not the calendar month the release happened
to ship in. The project's cadence is "two releases per year, in April and
October" (see [Expected cadence](#expected-cadence) below); under that cadence
the slot numbers are `04` and `10`, so the regular releases are `2604`, `2610`,
`2704`, `2710`, and so on. Picking slot numbers that match the planned calendar
months means adopters can read the version at a glance and know roughly when it
shipped, without having to chase exactly which week it landed.

Two situations move `NN` away from a cadence slot:

- **Extra releases off the cadence.** If we ever need to ship more than the
  planned number of releases in a year (an emergency major, a one-off coordinated
  push), the extra release takes a slot number that does not collide with the
  cadence. The simplest rule is "use the current calendar month if it is free,
  otherwise increment past the highest `NN` already shipped this year". For
  example, with a `2604`/`2610` cadence, an extra release in July 2026 is `2607`;
  if a second extra release happens later that same month, it is `2608`.
- **Cadence changes.** If we change the cadence (e.g. switch to "once a year in
  August"), new releases adopt the new slot numbers (`<YY>08`). The previous
  numbers stand as the historical record of the old cadence; nothing about
  earlier releases is renamed.

Overflow does not carry across calendar years: even if 2026 ends with an
overflow release `2613`, the first 2027 release picks up at `<27>` followed by
its cadence slot (e.g. `2704` for an April release), not `2614`. A January 2027
off-cadence release after a `2613` is therefore `2701`.

The rationale for "year plus cadence slot" rather than a pure sequence or a
quarterly scheme is:

- The version number tells adopters roughly when the release shipped at a glance.
  `2604` reads as "the April 2026 release", which is the most useful information
  a single identifier can carry.
- The number is tied to the cadence rather than the exact ship date, so a release
  that slips by a few weeks still ships under the slot number adopters were
  expecting. Adopters do not have to learn that a planned `2604` shipped as
  `2605` because of a slip.
- It tolerates extra releases inside the same year by stepping outside the
  cadence slots into a different month number.
- The `NN` range can stretch up to 99 if overflow ever stacks up, giving plenty
  of headroom past the 12 normal monthly slots.

The identifier is a workspace-level label only. It is the name the Backstage
release goes by, it is what `framework@<YYNN>` tags in git, and it keys the
release manifest. It does **not** determine the semver of any individual
package — see
[Framework packages keep independent semver](#framework-packages-keep-independent-semver)
below.

#### Expected cadence

The project targets two framework releases per year, in April and October. Both
windows are timed to coincide with the KubeCon events: KubeCon EU lands in April
most years (occasionally in March), and KubeCon NA lands in November. Under the
`YYNN` scheme that produces `<YY>04` and `<YY>10` as the cadence slot numbers —
for example `2604` and `2610` in 2026, then `2704` and `2710` in 2027, and so on.

The dates are guidelines rather than commitments. A release planned for April
that ends up shipping in May still publishes as `2604`, not `2605`, because the
slot number tracks the cadence rather than the ship month. The cadence is what
adopters plan around, so sticking to its slot numbers is more important than
being precise about the month. Off-cadence releases (an emergency major, a
one-off coordinated push) use a non-cadence slot per the
[Identifier format](#identifier-format) rules.

#### Framework packages keep independent semver

The framework release identifier is **only an identifier**. It does not determine
the semver of any individual package in the `framework` workspace. Every framework
package keeps its own independent semver and carries that version across framework
releases.

The reason is cadence. Framework releases happen roughly every six months (see
[Expected cadence](#expected-cadence)). If every release bumped every framework
package's major, individual packages would churn through several majors a year
regardless of whether their actual API had changed — and adopters would be forced
into busywork upgrades they don't need. We want the option for a stable framework
package to sit at `1.x.y` for two or three years before its next breaking change.
The semver of each framework package therefore reflects _actual_ API stability of
that package, not the calendar position of the framework release.

So while framework release `2604` is the name the Backstage release goes by,
adopters who look at any individual framework package see version numbers like:

- `@backstage/core-plugin-api@2.4.7`
- `@backstage/backend-plugin-api@3.1.0`
- `@backstage/types@1.0.5`

These versions move at each package's own pace. A staged change for the framework
workspace can bump specific packages' majors; packages without staged changes keep
their existing semver across the release.

#### How versions evolve through a release cycle

A framework release like `2604` is the named state of the workspace at a moment in
time. Between one framework release and the next, the workspace continues to ship
non-breaking changes through the Version Packages PR — patches and minors per the
usual semver rules:

- **Patch** bumps when a release contains only bug fixes. Example:
  `core-plugin-api` goes from `2.4.7` to `2.4.8`.
- **Minor** bumps when a release introduces new non-breaking features. Example:
  `core-plugin-api` goes from `2.4.8` to `2.5.0`.
- **Major** bumps only when the package's own API breaks. That happens when a
  staged change for the framework workspace declares a major bump for the package
  and the `Promote staged` PR is merged. Most framework releases will not bump
  every package's major; many releases will not bump any framework package's
  major.

The framework release identifier (`2604`, `2610`, …) advances on every framework
release regardless of whether any packages broke. Adopters use it to track the
named Backstage release; the per-package semver tells them which packages actually
moved.

Breaking changes to framework packages are not shipped via the regular Version
Packages PR. They are authored as staged changes (see
[Staged changes](#staged-changes)) and accumulate in `.staged/` until the next
framework release is cut.

#### What happens when a new framework release ships

When the `Promote staged (framework)` PR is merged and the next framework release
publishes, three things happen:

1. The framework release identifier advances (e.g. `2604` → `2610`). The new
   identifier is tagged in git (`framework@2610`) and becomes the key for the new
   release manifest.
2. Each staged change in `framework/.staged/` is applied. Affected packages bump
   per the bump levels declared in their staged-change front-matter — typically
   `major` for packages with API breakage, occasionally `minor`/`patch` for
   experimental features held back from `@latest`.
3. Framework packages that are not affected by any staged change keep their
   existing versions. They show up in the new release's manifest at the version
   they were already on.

For example, on the `2604` → `2610` transition, a typical mix might look like:

- `@backstage/core-plugin-api@2.4.8` → `@backstage/core-plugin-api@3.0.0`
  (had a staged major change)
- `@backstage/backend-plugin-api@3.1.0` → unchanged (no staged change)
- `@backstage/types@1.0.5` → unchanged (no staged change)

Crucially, **a new framework release does not have to contain any breaking
changes**, and it does not force any package version bump just because the release
identifier advanced. The release identifier is the calendar marker; the per-package
versions tell the actual story of what changed.

For adopters who use the Backstage Yarn plugin to pin a Backstage release in
`backstage.json` (see [Backstage release manifest](#backstage-release-manifest)
for the plugin's resolution model), this means three useful properties:

- A floating pin (`release: "2604"`) keeps them on the current line. When they
  next run `yarn install` and let the lockfile update, the plugin picks up new
  minor and patch versions of Backstage packages within the line. There is no
  possibility of an unexpected breaking change.
- A frozen pin (`release: "2604.1.3"`) locks resolution to a specific manifest;
  the plugin won't move package versions forward even on a lockfile refresh.
  Reproducibility of any one install still comes from the lockfile, as usual —
  the frozen pin just controls whether a deliberate lockfile update would drift
  forward inside the line or stay put.
- Moving to the next named release (`release: "2604"` → `release: "2610"`) is an
  intentional action. Adopters opt into it on their own schedule, and they know that
  _if_ anything is going to change about Backstage's APIs, this is the boundary at
  which it happens — never inside a release line.

#### Promotion trigger

There is no fixed calendar for when framework releases ship. The trigger is the same
as for every other workspace: a maintainer reviewing and merging the
`Promote staged (framework)` PR (see
[Promoting staged changes](#promoting-staged-changes)). The
calendar-driven behavior is in the identifier itself: `YY` is the current two-digit
year and `NN` is whichever is larger of the current calendar month and one greater
than the highest `NN` shipped so far this year. The counter restarts at the new
year. The CLI computes the next identifier deterministically from the current date
and the highest `NN` already published in the year.

The framework release identifier doubles as the Backstage release identifier;
see [Backstage release manifest](#backstage-release-manifest) for how non-framework
workspace versions are recorded alongside it so that the Backstage Yarn plugin can
resolve a pinned Backstage release into a concrete set of package versions.

### Repository tooling

The root of the repository must remain dependency-free: no `node_modules` directly at
the repository root, no top-level `yarn install` step. This makes the root cheap to
clone, lets every workspace own its own dependency tree without contention, and keeps
the root scripts easy to read without having to reason about transitive packages.

We satisfy that constraint while still running real automation in GitHub Actions —
and while still being able to share the same tooling with other repositories — by
introducing a dedicated `workspaces/tooling/` workspace with stricter rules than the
other workspaces.

#### The `tooling` workspace

`workspaces/tooling/` hosts every script that the repository's own workflows invoke
during release automation: the staged-change validator, the script that rebuilds the
Promote staged PR, the manifest updater, the OIDC dispatch helper, and so on. It
also hosts
the standalone CLI that ships that same automation to `backstage/community-plugins`
and any other repository adopting this structure.

The workspace is constrained in four ways that make this dual role possible:

1. **Zero runtime dependencies, not even transitively.** Every TypeScript file
   under `workspaces/tooling/<package>/src/` may import only from Node built-ins.
   No third-party runtime imports, and no reaching into the `node_modules` of
   another workspace either. (For example, the Node-based TypeScript transformer
   in `@backstage/cli` would be tempting, but it requires `swc` as a transitive
   dependency, and assuming `swc` is installed inside any particular workspace
   is not safe.) CLI argument parsing uses Node's built-in
   `node:util` `parseArgs`, which is enough for the subcommand shapes we need;
   shelling out to `gh` and `git` via `child_process` covers the rest. If a
   runtime dependency genuinely cannot be avoided at some point in the future,
   `bundleDependencies` is the escape hatch we would consider before relaxing
   the rule.

2. **Not a Backstage CLI module.** The published artifact is a standalone CLI, not
   a `@backstage/cli`-loaded module. CLI modules inherit the host CLI's dependency
   graph, which would defeat the zero-runtime-dependency constraint. Consumers in
   other repositories install the standalone CLI directly.

3. **No build step is required for in-repo use.** CI workflows in this repository
   invoke scripts directly with `node --experimental-strip-types path/to/script.ts`
   (or the stable successor flag once available). Node strips the type annotations
   at load time, and because the runtime code has no third-party imports, the
   script runs without ever calling `yarn install` inside `workspaces/tooling/`.
   This keeps the dependency-free promise for the repository's own automation.

4. **Built when published.** The workspace has a regular build step that compiles
   the TypeScript sources to JavaScript using TypeScript pinned as a dev
   dependency. The build runs in CI on changes to the workspace (so we always
   know the source builds cleanly), and the resulting `dist/` directory is what
   gets shipped to npm — consumers in other repositories get a normal JS package
   that runs on any Node version, without needing the type-stripping flag. The
   build is **not** required for in-repo use; constraint 3 still applies.

Despite the runtime constraints, the `tooling` workspace is still a regular Yarn
workspace from a developer's point of view. It has a `package.json` with
`devDependencies` (TypeScript, ESLint, the build runner, test dependencies if
needed), and contributors working _on_ the tooling workspace itself
`yarn install` it and use the usual tools — type-checking, linting, running
tests, building locally — exactly the way they would in any other workspace. The
dev dependencies are the normal Backstage versions of those tools.

The zero-runtime-dependency rule only kicks in when scripts _from_ the tooling
workspace are being executed _by other workflows_ to do release automation for
other workspaces. Those invocations never `yarn install` the tooling workspace;
they just `node --experimental-strip-types` the script. So:

- Working on the tooling workspace itself: dependencies installed, full
  TypeScript + ESLint experience.
- Running tooling-workspace scripts from a release workflow targeting some
  other workspace: no install, no dependencies, scripts execute directly from
  source via Node type-stripping.

The `tooling` workspace is also intentionally outside the standard Backstage
monorepo layout for the runtime code. It does not use the `@backstage/cli`-driven
build, does not follow the package layout conventions of the other workspaces,
and has its own minimal `tsconfig.json` and build script. In that sense it is
closer to `microsite` (which is also a Docusaurus-driven workspace with its own
setup) than to a plugin workspace. This is a deliberate choice: keeping the
runtime layout minimal makes the zero-runtime-dependency rule easy to enforce
and audit.

#### Verifying `tooling/` in CI

Any PR that touches `workspaces/tooling/` triggers a job that installs the
workspace dependencies (`yarn install` inside `workspaces/tooling/`) and runs
the usual checks — `tsc --noEmit`, `eslint`, tests, and the build — across the
workspace. These confirm that the TypeScript that in-repo invocations rely on is
valid, well-typed, and continues to build cleanly.

The repository's other CI jobs that _use_ the tooling never install its
dependencies; they just `node --experimental-strip-types` the relevant script.

#### What this gives us

- A dependency-free root that any contributor can clone and inspect without
  installing anything.
- A single shared home for the release automation, with the same source of truth
  feeding both in-repo workflows and the npm-published packages that other
  repositories consume.
- Real lint and type-check coverage of the automation scripts.
- A clean boundary: any change to release tooling lives inside one workspace, with
  one set of dev dependencies and one set of CI jobs.

### Tooling consolidation with backstage-community-plugins

The release scripts in `backstage/community-plugins/scripts/ci/` (`check-if-release.js`,
`list-workspaces-with-changes.js`, `create-tag.js`, etc.) are CLI scripts duplicated
in each consuming repository. We propose to publish them as a standalone CLI from the
new `tooling` workspace (see [Repository tooling](#repository-tooling)) so that
`backstage/backstage`, `backstage/community-plugins`, and any other repository
adopting this structure all consume the same implementation. The standalone CLI is
not a Backstage CLI module, because the zero-runtime-dependency rule rules that out;
consumers install it directly.

Concretely:

- Create a new standalone CLI package inside `workspaces/tooling/`. The package name
  is left to implementation.
- Move and refactor the community-plugins scripts into subcommands of that CLI
  (e.g. `list-changed-workspaces`, `check-needs-release`, `create-tag`).
- Add the new subcommands needed by this BEP: `stage create|refresh|apply` (for
  authoring and validating staged changes) and `next-version` (for computing the
  next `@next` identifier; see
  [Next pre-release versioning](#next-pre-release-versioning)).
- Update both repositories' workflows to invoke the CLI instead of duplicated
  scripts.

This consolidation has the additional benefit that community-plugins gains the
staged-change mechanism for free if it ever wants to adopt it.

### Documentation and microsite

The repository's `docs/` directory and the Docusaurus site under `microsite/` need a
clear home in the new layout. The model below splits the source layout and reads
from the published state of each workspace at build time, so the docs site always
reflects what adopters actually have installed when they pin to the current
Backstage release.

#### Source layout

- The `microsite/` directory becomes its own non-published workspace at
  `workspaces/microsite/`. It is migrated to the new layout early in the rollout,
  alongside the `cli` workspace, because it has no runtime dependencies on the
  framework and can validate the workspace tooling cheaply.
- The top-level `docs/` directory stays at the repository root and keeps content
  that is cross-cutting: `architecture-decisions/`, `contribute/`,
  `getting-started/`, `tutorials/`, `releases/`, `overview/`, `faq/`, etc. It is
  owned by the repository rather than by any workspace.
- Plugin-area documentation (`docs/auth`, `docs/permissions`, `docs/notifications`,
  `docs/features/search`, `docs/features/techdocs`, `docs/integrations`,
  `docs/frontend-system`, `docs/backend-system`, …) moves into the corresponding
  workspace under `workspaces/<name>/docs/`.

#### Build model

The microsite build does not assemble pages from the current state of `main`.
Instead it reads the published state of each workspace and builds against that:

- For each workspace, the build resolves the commit of the most recent
  `@latest` publish — i.e. the commit referenced by the per-workspace
  `<workspace>@latest` git tag (see
  [Triggering publishing in the private repo](#triggering-publishing-in-the-private-repo)).
- It then pulls `workspaces/<name>/docs/` from that commit and feeds it into the
  Docusaurus build.
- The cross-cutting top-level `/docs/` content is taken from the current `main`
  directly, since it does not belong to any single workspace and does not have a
  release of its own.

The result is that the published microsite always reflects the docs of the latest
released state of every workspace, not whatever is sitting in `main`. Adopters
reading the site see documentation that matches the packages they have installed
when they pin to the current Backstage release.

The published site retains a single sidebar that interleaves cross-cutting and
workspace-specific docs; the source layout is the only thing that changes.

#### Triggers

The docs site rebuilds on a schedule only — a workflow runs every 30 minutes
inside `workspaces/microsite/` using its own built-in `GITHUB_TOKEN`. No
cross-repo dispatch from the publishing repo is needed.

The schedule cadence is generous because the docs site has no urgency
requirement: docs catch up to a published release within at most half an hour,
which is fine in practice. The workflow could be supplemented later with a
direct dispatch from the publishing flow if that latency ever becomes a problem.

#### Short-circuiting unchanged rebuilds

A scheduled rebuild that has nothing to do should exit immediately. The docs
input has a finite, deterministic shape:

- The cross-cutting top-level `/docs/` content at the current `main`.
- For each workspace, the `workspaces/<name>/docs/` content at the commit
  referenced by the `<workspace>@latest` tag.

Each of those inputs has a stable identifier: a git **tree hash** for the docs
directory at the relevant commit (e.g. `git rev-parse <sha>:workspaces/<name>/docs`).
Combining the tree hashes of every input into a single fingerprint gives a
deterministic key that changes if and only if any docs content has changed.

The build workflow:

1. Computes the fingerprint above.
2. Looks up the fingerprint in the GitHub Actions cache (keyed by fingerprint).
3. If the cache hit indicates a successful previous build at this fingerprint,
   exits immediately — there is nothing new to publish.
4. Otherwise, runs the full build and publish, then writes the fingerprint to
   the cache on success.

Step 1 is cheap (it only needs `git ls-tree` reads at the `<workspace>@latest`
tags on a shallow clone, no checkout of the workspaces themselves), so a no-op
scheduled run finishes in seconds.

#### Trade-off: cross-workspace doc edits

Documentation changes that span multiple workspaces (e.g. a new framework
capability that the catalog docs also discuss) edit the docs in each affected
workspace independently. Those edits become visible on the site only after each
workspace next publishes, and if the workspaces ship at different times the site
will briefly show a mix of new and old. The same is true of any cross-workspace
behavior in this proposal; we accept it because it keeps the docs of each
workspace co-located with its code, and because the alternative — coordinated
docs releases — gives up the per-workspace independence that the rest of the BEP
is built around.

### Backstage release manifest

The release identifier of the framework workspace (`YYNN`) doubles as the Backstage
release identifier. Adopters already pin Backstage releases via the
`@backstage/release-manifests` package and the Backstage Yarn plugin; this section
defines how that manifest survives — and benefits from — the per-workspace release
model.

#### Where the manifests live

Manifests are published from the existing `backstage/versions` repository, which
already serves the Backstage release manifests today via GitHub Pages and has the
operational tooling, security boundary, and DNS for that purpose. The publishing
repo writes manifests into `backstage/versions` as part of every successful
publish; `backstage/backstage` does not write manifests directly.

A few reasons keeping `backstage/versions` separate is the right call:

- It already exists and is wired up to a dedicated GitHub Pages site for serving
  manifests. Rather than introduce a second Pages target on `backstage/backstage`
  (which would compete with the microsite), we reuse the one that already
  exists.
- The repo is small and focused, so consumers (the Yarn plugin, in particular)
  do not have to clone the entire monorepo to read manifests.
- Write access to `backstage/versions` is already restricted to the publishing
  workflow, which keeps the security boundary intact for who can mint manifests.

#### Data shape

A Backstage release is identified by the framework release line — for example,
`2604`. Within that line, individual manifests are numbered using a semver-style
`<minor>.<patch>` suffix that follows real semver semantics across the workspace
as a whole:

- A new line opens at `<line>.0.0` when the framework `Promote staged` PR
  merges.
- A subsequent publish into the line that contains at least one `minor` package
  bump advances the line's `<minor>` segment and resets `<patch>` to `0` (e.g.
  `2604.0.5` → `2604.1.0`).
- A publish that contains only `patch` bumps advances the `<patch>` segment
  (e.g. `2604.1.0` → `2604.1.1`).
- `<major>` is never bumped inside a line; cross-line transitions advance
  `<line>` itself (e.g. `2604` → `2610`).

The release identifier shipped to adopters is therefore `<line>.<minor>.<patch>`,
e.g. `2604.0.0`, `2604.1.3`, `2604.5.7`. This applies to the framework's
back-port lines too: a back-port to the `2603` line that contains only patch
bumps moves it from e.g. `2603.5.2` to `2603.5.3`.

Each manifest is a JSON document of the form:

```json
{
  "releaseVersion": "2604.1.3",
  "releaseLine": "2604",
  "packages": [
    {
      "name": "@backstage/core-plugin-api",
      "workspace": "framework",
      "version": "2.4.7"
    },
    {
      "name": "@backstage/plugin-catalog",
      "workspace": "catalog",
      "version": "2.3.0"
    },
    {
      "name": "@backstage/plugin-catalog-react",
      "workspace": "catalog",
      "version": "1.18.4"
    },
    {
      "name": "@backstage/ui",
      "workspace": "ui",
      "version": "1.2.0"
    }
  ]
}
```

Every published package appears in the manifest exactly once. There is no "no target"
distinction at the data layer — workspaces such as `ui` that have no runtime
dependency on `framework` still have their current `@latest` version captured. The
manifest is purely descriptive: it answers "if I pin Backstage `2604.1.3`, what
versions of every Backstage package do I get?".

#### How the manifest is maintained

Manifests are immutable. Every successful non-pre-release publish from
the publishing repo produces a new manifest under a content-addressed URL of the
form `release-<line>.<minor>.<patch>.json` in `backstage/versions` — for
example, `release-2604.1.3.json`. A pointer file
(`release-<line>/latest.json`) is updated to reference the newest manifest in
the line; that pointer is the only mutable artifact the publishing repo writes.

The body of each manifest is built by:

1. Copying the most recent manifest for the same Backstage release line.
2. Replacing the version entry for every package that was just published.
3. Computing the new `<minor>.<patch>` suffix from the highest bump level in
   the publish — minor publishes advance `<minor>` and reset `<patch>` to `0`,
   patch publishes advance `<patch>` — and writing the result to a new immutable
   URL.

This means an adopter using the Backstage Yarn plugin (which reads
`backstage.json`'s `release` field and resolves Backstage package versions through
it) can pin a Backstage release in two ways:

- **Floating pin** (`release: "2604"` in `backstage.json`): the Yarn plugin reads
  `release-2604/latest.json` on each resolve, picks up the most recent manifest
  in that release line, and resolves Backstage package versions accordingly.
  When the adopter next refreshes their lockfile they get the latest known
  compatible versions across every workspace without changing the pin.
  Reproducibility of any single install still comes from the `yarn.lock` file,
  as usual; the floating pin only governs how resolution moves on a future
  refresh.
- **Frozen pin** (`release: "2604.1.3"` in `backstage.json`): the Yarn plugin
  reads the immutable `release-2604.1.3.json` directly. A future lockfile
  refresh does not move Backstage package versions forward inside the line; the
  resolution stays at exactly the manifest the pin names.

When the framework workspace cuts a new named release (`2604` → `2610`), the
publishing workflow stops updating the `release-2604/latest.json` pointer (the
line is closed) and starts a new line headed by `release-2610.0.0.json`, seeded
from the last manifest of the previous line. Packages affected by staged
changes that shipped with the new release move to their new versions; every
other package keeps its existing version.

This gives us a few useful properties:

- Every published manifest is immutable and content-addressed. Reproducible builds
  are trivially possible by pinning the counter.
- Adopters who prefer a moving target follow the pointer file and get bug fixes
  and new non-breaking features for free as the line's `<minor>.<patch>`
  advances.
- A workspace can publish on its own cadence without any coordination with other
  workspaces; its publish simply produces a new manifest in the current release line.
- The previous-release pointer never changes after the next release line opens, so
  adopters on older releases keep resolving to the same frozen set of versions.

#### Yarn plugin integration

The Backstage Yarn plugin already reads release manifests from `backstage/versions`
to resolve a pinned release to a concrete set of versions. The schema change above is
additive (the `workspace` field is new, everything else is shaped identically to
today), and the resolution flow gains a small new step (read `release-<line>/latest.json`
to find the current immutable manifest URL, then read that). Packages whose workspace
was not yet published into the current release line fall through to the previous
release line's manifest, and finally to `@latest` if no manifest knows about them.

### OIDC binding mechanics

[Publish-time safeguards](#publish-time-safeguards) above requires the publishing
workflow to validate a GitHub Actions OIDC token bound to the dispatching workflow
run. `repository_dispatch` does not carry an OIDC token natively, so we need a small
amount of additional machinery to get it from one side to the other.

The design is intentionally minimal:

1. The release workflow in `backstage/backstage` runs on `push: [main]`. Before
   sending its dispatch, it mints a GitHub Actions OIDC token for the configured
   audience scoped to the publishing repo (e.g. `backstage-release`) using the
   built-in
   `ACTIONS_ID_TOKEN_REQUEST_TOKEN` / `ACTIONS_ID_TOKEN_REQUEST_URL` pair.
2. The release workflow puts the resulting JWT into the `client_payload.oidc_token`
   field of the `repository_dispatch` event. Tokens are valid for a few minutes,
   which is more than enough headroom for the publishing repo to act on the event.
3. The publishing workflow validates the JWT against GitHub's public OIDC keys and
   the claims listed in
   [Publish-time safeguards](#publish-time-safeguards) before doing any other work.
   It then runs the ancestor check, the required-reviewer environment gate (if the
   target tag is `latest`), and finally the actual publish.

A few details worth being explicit about:

- We do not need a separate broker service. The OIDC token is just a string the
  dispatcher includes in the dispatch payload, and the validator is plain code in
  the publishing repo's workflow. We keep the design fully on GitHub Actions.
- A leaked dispatch token (PAT or GitHub App credential) cannot publish on its own.
  It can send dispatches, but without a fresh OIDC token from a workflow run on
  `main` it cannot pass validation. Forging an OIDC token requires compromising
  GitHub's signing key, which is outside our threat model.
- Tokens are single-use as far as the publishing repo is concerned: each dispatch
  carries a fresh token, and validation includes a check that the token has not been
  seen before (a small replay-protection cache).
- A workflow re-run of the dispatching workflow on the same SHA does mint a new
  OIDC token, so legitimate re-runs work without manual intervention.

### Next pre-release versioning

`@next` is the dist-tag for "what the next coordinated release of the workspace
would look like if it were cut right now". It exists to give adopters a
continuously-updated preview of everything that is currently staged — both
breaking changes and experimental non-breaking changes — so that organizations can
validate their integrations long before the next batch actually ships.

In practice this is usually the next major of the workspace, because the staging
mechanism is primarily used to batch breaking changes. But because a staged change
can declare any bump level (see [Staged changes](#staged-changes)), the actual
version that `@next` previews follows from the bumps declared by the staged set,
not from a fixed "always next major" rule.

#### When `@next` ships

`@next` is produced **only** when the workspace has at least one staged change in
`.staged/`. Without staged changes there is no pending batch to preview, and
`@next` publishes nothing.

When the workspace does have staged changes, an `@next` publish is dispatched in
two situations:

1. **A staged change is added, refreshed, or removed** by a merged PR. The set of
   queued changes has changed, so the preview needs a new snapshot.
2. **A regular `@latest` release ships** for the workspace (a Version Packages PR
   is merged). The underlying state has moved forward, and we republish the `@next`
   preview on top of the new `@latest` so that adopters always see an `@next` that
   reflects the most recent baseline.

Both situations route through the same `dispatch-next` job (see
[Release workflow](#release-workflow)); each dispatch increments the shared
workspace counter and publishes a new `@next` snapshot.

#### Which packages are published as `@next`

The same rule applies to every workspace, including `framework`: only packages
directly affected by at least one staged change are bumped and published as
`@next`. Packages that are not touched stay at their `@latest` version; adopters
resolve them through the normal `@latest` dist-tag.

#### Base version per package

For each package that is published as `@next`, the base version (the portion
before `-next.`) is what `yarn changeset version` would produce when given **only
the changesets synthesized from every staged change** — regular pending changesets
in `.changeset/` are deliberately excluded. Those regular
changesets ship through the Version Packages PR flow and their bumps appear in a
future `@latest` release; `@next` does not preview them. This keeps the meaning of
the `@next` version stable: it reflects exactly the staged batch and nothing else.

The published code that ships as `@next` is the result of applying every staged
change to the current `main` (so the runtime behavior matches what the next
coordinated release would actually contain), but the published _version_ is
derived only from the staged changes.

In practice the base is whatever `yarn changeset version` would pick when fed only
the synthesized changesets — i.e. the highest bump declared across the staged set
for that package, applied to its current `@latest` version. That is typically the
next semver-major (e.g. `2.3.0` → `3.0.0`, or `0.7.5` → `0.8.0` for `0.x` packages
where minor is the breaking bump). When every staged change for a package is
non-breaking the base is the corresponding minor or patch bump instead.

#### Shared workspace counter

The `-next.<N>` suffix is shared across every package in a single `@next` publish
for the workspace, so that any two packages with `-next.5` came from the same
snapshot. The counter is:

- Recorded in the root `package.json` of the workspace under
  `backstage.release.nextCounter`. The `backstage.release` key is the natural place
  for additional release-management state we accumulate over time.
- Incremented by exactly `1` on every `@next` publish for the workspace,
  regardless of how many packages that publish includes.
- **Never reset.** The counter grows monotonically across the lifetime of the
  workspace.

  The reason is that resetting on `Promote staged` merges introduces a
  collision risk for packages whose previous `@next` publishes never made it to
  `@latest`. Consider a staged change marked `experimental` that publishes
  `plugin-foo@2.0.0-next.5` to `@next` and then gets dropped without ever
  promoting: `plugin-foo` stays at `1.x.y` on `@latest`, but
  `plugin-foo@2.0.0-next.0..5` are already on npm. If the counter then reset
  and a future staged change targeted `plugin-foo@2.0.0` again, the next
  publish would land at `2.0.0-next.0`, which collides with what's already
  published. Letting the counter grow monotonically across rounds avoids the
  entire class of collisions. Adopters do not see a clean `-next.0` for a new
  round, but they keep the snapshot identifier property (all packages with the
  same `-next.<N>` came from the same publish), which is what they actually
  rely on.

The updated `package.json` is committed to `main` by the same workflow that runs the
publish, so the counter survives across runners.

#### Worked example: `catalog`

Initial state: `@backstage/plugin-catalog@2.3.0`, `@backstage/plugin-catalog-react@1.8.0`,
`@backstage/plugin-catalog-graph@0.7.5`, all on `@latest`.

1. Staged change `001` is merged. It declares `plugin-catalog: major` and
   `plugin-catalog-react: major`.
2. `dispatch-next` computes: `plugin-catalog@3.0.0-next.0`,
   `plugin-catalog-react@2.0.0-next.0`. `plugin-catalog-graph` is untouched and
   stays at `0.7.5` on `@latest`.
3. Adopters can preview the upcoming major by installing
   `plugin-catalog@next plugin-catalog-react@next`. They continue to receive
   `plugin-catalog-graph` from `@latest`.
4. Staged change `002` is merged later. It declares `plugin-catalog-graph: major`
   (which for a `0.x` package becomes a minor bump).
5. `dispatch-next` republishes: `plugin-catalog@3.0.0-next.1`,
   `plugin-catalog-react@2.0.0-next.1`, `plugin-catalog-graph@0.8.0-next.1`. All
   three share `-next.1`, marking them as a coherent snapshot.
6. The `Promote staged (catalog)` PR is eventually reviewed and merged. The
   release ships to `@latest`. The shared counter does not reset; the next
   `@next` publish for the workspace picks up from `<N+1>`.

#### Worked example: `framework`

Initial state: framework is on release line `2604`. Each framework package is at
its own current semver — for example, `@backstage/core-plugin-api@2.4.7`,
`@backstage/backend-plugin-api@3.1.0`, `@backstage/types@1.0.5`.

1. A staged change in `framework/.staged/` is merged. It declares
   `core-plugin-api: major`.
2. `dispatch-next` computes: `@backstage/core-plugin-api@3.0.0-next.0`. Other
   framework packages are not touched and stay at their `@latest` versions.
3. A second staged change later declares `backend-plugin-api: minor`.
   `dispatch-next` republishes `core-plugin-api@3.0.0-next.1` and
   `backend-plugin-api@3.2.0-next.1` together with the shared `-next.1` suffix.
   `types` remains at `1.0.5` on `@latest`.
4. The `Promote staged (framework)` PR is eventually merged. The named release
   advances from `2604` to the next framework identifier (e.g. `2610`), the new
   manifest line opens, the two affected packages publish at `3.0.0` and `3.2.0`
   on `@latest`, every other framework package keeps its previous version, and
   the shared workspace counter keeps advancing — the next `@next` publish for
   the workspace will be `-next.<N+1>`.

#### Local previewing

The `next-version` subcommand of the standalone release CLI computes the next
`@next` identifier deterministically from `main`, the staged changes for the
workspace, and `backstage.release.nextCounter`. Running it locally produces the exact version
strings a real `@next` publish would produce, which makes it easy to inspect what
the next `@next` would look like without dispatching it.

## Release Plan

The migration is staged so that no single PR has to move the entire repository.

1. **BEP approval & tool scaffolding.** Land the BEP, then carve out the new
   `workspaces/tooling/` workspace (see
   [Repository tooling](#repository-tooling)) and bootstrap the standalone
   release-automation CLI inside it with the existing community-plugins commands in
   their current form. Vendor the new `stage create|refresh|apply` subcommands
   behind a flag while the format stabilizes.

2. **Migrate `cli` first.** Move all CLI and developer-tooling packages into
   `workspaces/cli/`. This is intentionally early so that the rest of the migration
   can exercise the new release tooling, and because the CLI has no runtime
   dependencies on `framework`.

3. **Migrate `ui` and `microsite`.** Both are conceptually independent from the
   framework runtime. `ui` enables BUI to ship breakage on its own schedule. `microsite`
   validates the per-workspace docs flow described in
   [Documentation and microsite](#documentation-and-microsite).

4. **Migrate leaf and standalone plugin workspaces.** In rough order:
   `api-docs`, `devtools`, `kubernetes`, `techdocs`, `search`, `notifications`,
   `home`, `org`, `user-settings`, `proxy`, `mcp`. Each move is a single PR per
   workspace. By the end of this step the surrounding tooling, CI, and publishing
   flow are exercised by many workspaces.

5. **Migrate the larger plugin workspaces.** `auth`, `scaffolder`, `catalog`. These
   are larger and more interconnected, but at this point the migration mechanics are
   well-understood.

6. **Migrate `framework` last.** This is the most invasive move because it touches
   the most root packages and because almost every other workspace depends on it.
   Doing it last means it inherits a fully-validated workspace tooling chain.

7. **Fold the demo repository in as `workspaces/demo/`.** Move the contents of the
   external `backstage/demo` repository into `workspaces/demo/` and wire its Yarn
   workspace links so it builds from source against every other workspace. Drop the
   legacy `packages/app`, `packages/app-legacy`, `packages/backend`,
   `packages/app-example-plugin`, and `plugins/example-todo-list*` from this
   repository as part of the same step.

8. **Roll out staged changes.** Once `framework` is migrated and stable, enable the
   staged-change flow. The first end-to-end exercise is a real deprecation PR: file
   the deprecation and the staged removal together, verify the `@next` release picks
   the staged removal up, then merge the `Promote staged` PR to ship the release.

9. **Adopt date-based versioning for `framework`.** The first major of `framework`
   after the staged-change flow lands uses the `YYNN` scheme.

Throughout the migration the existing weekly release flow continues to work for any
workspace that has not been migrated yet. There is no flag day.

## Dependencies

- The (private) publishing repository needs a generalized publish workflow
  that accepts `(workspace, sha, tag)` rather than the current monolithic publish job.
- Cooperation with `backstage/community-plugins` maintainers to extract shared
  tooling into the standalone CLI in `workspaces/tooling/`. This BEP assumes their
  consent in principle and proposes that the extraction happens in their repo as
  well, by replacing their duplicated scripts with the published CLI.
- No new external dependencies are required.

## Alternatives

- **Keep a single workspace, just slow down releases.** Does not solve the
  faster-fixes vs. slower-breaks tension; both audiences are still coupled.
- **Long-lived `next` branch kept in sync with `main`.** Operationally expensive, breaks down
  at scale, and provides no structured representation of queued breaking changes.
- **Treat breaking changes as regular changesets that pile up until the next
  major.** This is essentially today's model. It does not solve deprecation lag
  and does not let us merge breaking changes while also publishing incremental
  non-breaking `@latest` releases from the same branch — once a major-bump
  changeset lands on `main`, the next Version Packages release of that workspace
  ships the major, which is exactly the coupling this BEP exists to break.
- **Use a separate repository per workspace.** Closer to a true multi-repo layout.
  Rejected on
  grounds of cross-workspace refactoring cost, contributor experience, and CI
  duplication. The community-plugins pattern (one repo, many workspaces) gives us
  almost all the benefits without those costs.
- **Use `npm` workspaces or `pnpm` instead of Yarn.** Out of scope; we already use
  Yarn workspaces in both this repo and community-plugins.
- **Add a required-reviewer environment gate for `@latest` publishes as a future
  hardening step.** The publishing workflow could run inside a GitHub Environment
  configured with required reviewers from `@backstage/maintainers`, so that every
  publish to the `latest` dist-tag pauses until a maintainer clicks "Approve and
  deploy" — covering both mainline `@latest` from `main` and back-ported
  `@latest` from `patch/**` branches. `@next` publishes would skip the gate and
  continue to ship without human intervention. The ancestor check and OIDC
  binding in [Publish-time safeguards](#publish-time-safeguards) already make
  the dispatch flow safe; the reviewer gate would be a second-layer defense
  against a maintainer accidentally merging something they shouldn't have. It is
  intentionally left out of the initial design to keep the publish flow
  frictionless, and called out here as something we may add later if the threat
  model warrants it.
- **Keep `framework` strictly the framework, and pull the bundled plugins out.**
  As currently planned, `framework` is more than just the plugin/app/backend APIs
  and defaults — it also contains the `events`, `signals`, `permission`, and
  `gateway` plugin families (and their modules), plus `theme`, `core-components`,
  the `integration` packages, `bitbucket-cloud-common`, `filter-predicates`, and
  the `app` plugin family. An alternative would be to keep `framework` strictly
  scoped to the API contract and defaults, and split each plugin family out into
  its own workspace (`events`, `signals`, `permission`, `gateway`, …), the same
  way `catalog`, `scaffolder`, and `auth` are split today.

  The argument for the split is conceptual cleanliness — a workspace called
  `framework` should arguably only contain the framework itself, and each plugin
  family would then be free to ship breaking changes independently.

  The argument against — and the reason this BEP keeps them in `framework` — is
  that these plugins are essentially extensions of the framework's runtime surface
  rather than independent products. They depend on core APIs, ship with the
  defaults, and in practice would need to re-synchronize their majors with the
  framework whenever the underlying APIs change. Pulling them into separate
  workspaces would inflate the workspace count without giving them genuinely
  independent release cadences. Their `@latest` releases also rarely need to ship
  faster than the framework's continuous patch/minor cadence already allows
  through the Version Packages PR. We can revisit this if any of them grows enough
  module surface area to warrant a dedicated workspace, the same way `events` would
  have, if we hadn't folded the events modules back in.
