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
  - [Breaking-change patches](#breaking-change-patches)
  - [Mainline and next releases from the same branch](#mainline-and-next-releases-from-the-same-branch)
- [Design Details](#design-details)
  - [Repository layout](#repository-layout)
  - [Patch file format](#patch-file-format)
  - [Author workflow](#author-workflow)
  - [Release workflow](#release-workflow)
  - [Versioning of the core framework](#versioning-of-the-core-framework)
  - [Tooling consolidation with backstage-community-plugins](#tooling-consolidation-with-backstage-community-plugins)
  - [Documentation and microsite](#documentation-and-microsite)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)
- [Open Questions](#open-questions)

## Summary

This BEP proposes a restructure of how the `backstage/backstage` repository is organized
and released. Today the repository is a single Yarn workspace where every package shares
one release cadence, one changeset queue, and one set of breaking-change windows. We
propose to split the repository into multiple independent workspaces, modeled on the
`backstage/community-plugins` layout, where each workspace owns its own packages, its
own changesets, its own release cadence, and its own decision on when to ship breaking
changes.

In addition to the workspace split, this BEP introduces a new "breaking-change patch"
mechanism. A breaking change is no longer a regular changeset that bumps a major version
the next time the workspace releases. Instead it is encoded as a structured patch that
sits in the main branch alongside a `next`-flavored changeset. Mainline releases continue
to flow continuously from `main` without ever applying these patches, while `next`
releases are produced by applying all queued patches in order on top of `main` and
publishing under the `next` dist-tag. When a workspace is ready to ship its accumulated
breaking changes, the queued patches are merged into `main` as a single coordinated
major release.

The net effect is that small fixes and additive features ship faster, breaking changes
are durable, reviewable artifacts that cannot drift, and the core framework can move on
a slower, more predictable release cadence without holding back the rest of the
ecosystem.

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
  `app-defaults`) are gated on the core framework's slow major-version cadence.

The `backstage/community-plugins` repository already demonstrates that a per-workspace
release model works well for a multi-repository-like set of plugins inside a single git
repository. The remaining gap is a way to handle deprecations and breaking changes
cleanly, which is what the patch mechanism is designed to solve.

### Goals

- Allow each area of Backstage (framework, catalog, scaffolder, auth, ...) to release on
  its own cadence, with its own changeset queue.
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
- Share tooling with `backstage/community-plugins` so that improvements benefit both
  repositories.

### Non-Goals

- This BEP does not propose to physically split `backstage/backstage` into multiple git
  repositories. Everything still lives in one repo.
- This BEP does not propose changes to the public package names or import paths.
- This BEP does not change how adopters consume Backstage releases, beyond introducing
  more frequent `latest` releases and a more meaningful version scheme for the core
  framework.
- This BEP does not redesign the existing `.patches/`-based patch-release flow for
  shipping fixes back to stable release lines. That mechanism remains as-is.
- This BEP does not pre-commit to a specific set of breaking changes for any workspace.
  It only describes the mechanism by which they will be authored and released.

## Proposal

### Workspace layout

The repository moves from a single root Yarn workspace to a set of independent
workspaces under a top-level `workspaces/` directory, matching the layout used by
`backstage/community-plugins`:

```
workspaces/
  core/
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
- Has its own `.patches/` directory (described in
  [Breaking-change patches](#breaking-change-patches)) — distinct from the existing
  top-level `.patches/` used for stable-line patch releases.
- Is independently releasable and has an independent version line per package.

The repository root keeps repo-wide concerns: BEPs, docs, top-level scripts, the
`.github/` workflows, shared tooling configuration, and the CI workflow that fans out
to per-workspace jobs.

### Workspace map

Every currently-published package in `packages/` and `plugins/` is assigned a home in
the new layout. Examples and private packages (`packages/app`, `packages/backend`,
`packages/app-legacy`, `plugins/example-todo-list*`, `packages/e2e-test*`) remain at
the repository root as private development aids and do not belong to any workspace.

> **Note**: This mapping is a proposal for review. Many packages have plausible homes in
> more than one workspace, and the boundaries should be debated before we commit. Each
> debatable assignment is called out in [Open Questions](#open-questions).

#### `framework`

The slowly-evolving framework core: the plugin and app APIs, the backend system, the
defaults, plus the foundational cross-cutting features (events, signals, integrations)
that other plugins build on. Intended cadence: slow, on the order of months between
major releases.

Defaults packages (`app-defaults`, `backend-defaults`, `frontend-defaults`) are included
here because they are conceptually part of the framework. Whether they should be split
out for a faster cadence is left as an open question.

Packages from `packages/`:

- `@backstage/app-defaults`
- `@backstage/backend-app-api`
- `@backstage/backend-defaults`
- `@backstage/backend-dev-utils`
- `@backstage/backend-dynamic-feature-service`
- `@backstage/backend-openapi-utils`
- `@backstage/backend-plugin-api`
- `@backstage/backend-test-utils`
- `@backstage/config`
- `@backstage/config-loader`
- `@backstage/core-app-api`
- `@backstage/core-compat-api`
- `@backstage/core-plugin-api`
- `@backstage/errors`
- `@backstage/filter-predicates`
- `@backstage/frontend-app-api`
- `@backstage/frontend-defaults`
- `@backstage/frontend-dev-utils`
- `@backstage/frontend-dynamic-feature-loader`
- `@backstage/frontend-plugin-api`
- `@backstage/frontend-test-utils`
- `@backstage/integration`
- `@backstage/integration-aws-node`
- `@backstage/integration-react`
- `@backstage/module-federation-common`
- `@backstage/opaque-internal`
- `@backstage/release-manifests`
- `@backstage/test-utils`
- `@backstage/types`
- `@backstage/version-bridge`

Plugins from `plugins/`:

- `@backstage/plugin-app`, `plugin-app-backend`, `plugin-app-node`, `plugin-app-react`, `plugin-app-visualizer`
- `@backstage/plugin-bitbucket-cloud-common`
- `@backstage/plugin-config-schema`
- `@backstage/plugin-events-backend`, `plugin-events-backend-test-utils`, `plugin-events-node`
- All `@backstage/plugin-events-backend-module-*` packages
- `@backstage/plugin-signals`, `plugin-signals-backend`, `plugin-signals-node`, `plugin-signals-react`

#### `ui`

The Backstage UI primitives, design system, and theme. Separated from `framework` so
that breakage in the UI surface can ship on its own schedule, which is expected to be
faster than the framework's.

- `@backstage/ui`
- `@backstage/theme`
- `@backstage/core-components`

#### `cli`

All CLI and tooling packages. Independent from `framework` so that CLI improvements can
ship continuously, and the first non-`framework` workspace to migrate so it can
exercise the new release tooling end to end.

- `@backstage/cli`, `@backstage/cli-common`, `@backstage/cli-defaults`, `@backstage/cli-node`
- All `@backstage/cli-module-*` packages
- `@backstage/codemods`
- `@backstage/create-app`
- `@backstage/dev-utils`
- `@backstage/eslint-plugin`
- `@backstage/repo-tools`
- `@backstage/yarn-plugin`
- `@backstage/plugin-mui-to-bui` (a migration aid)

#### `catalog`

The catalog plugin family.

- `@backstage/catalog-client`
- `@backstage/catalog-model`
- `@backstage/plugin-catalog`, `plugin-catalog-backend`, `plugin-catalog-common`, `plugin-catalog-graph`, `plugin-catalog-import`, `plugin-catalog-node`, `plugin-catalog-react`
- `@backstage/plugin-catalog-unprocessed-entities`, `plugin-catalog-unprocessed-entities-common`
- All `@backstage/plugin-catalog-backend-module-*` packages

#### `scaffolder`

- `@backstage/plugin-scaffolder`, `plugin-scaffolder-backend`, `plugin-scaffolder-common`, `plugin-scaffolder-node`, `plugin-scaffolder-node-test-utils`, `plugin-scaffolder-react`
- `@backstage/scaffolder-internal` (currently `packages/scaffolder-internal`)
- All `@backstage/plugin-scaffolder-backend-module-*` packages

#### `auth`

- `@backstage/plugin-auth`, `plugin-auth-backend`, `plugin-auth-node`, `plugin-auth-react`
- All `@backstage/plugin-auth-backend-module-*` packages

#### `techdocs`

- `@backstage/plugin-techdocs`, `plugin-techdocs-backend`, `plugin-techdocs-common`, `plugin-techdocs-node`, `plugin-techdocs-react`
- `@backstage/plugin-techdocs-addons-test-utils`, `plugin-techdocs-module-addons-contrib`
- `@backstage/techdocs-cli`, `@backstage/techdocs-cli-embedded-app`

#### `permission`

- `@backstage/plugin-permission-backend`, `plugin-permission-backend-module-policy-allow-all`, `plugin-permission-common`, `plugin-permission-node`, `plugin-permission-react`

#### `search`

- `@backstage/plugin-search`, `plugin-search-backend`, `plugin-search-backend-node`, `plugin-search-common`, `plugin-search-react`
- All `@backstage/plugin-search-backend-module-*` packages

#### `notifications`

The notifications plugin family is kept in its own workspace rather than folded into
`framework`, because we expect it to evolve at a different speed and have its own
module ecosystem.

- `@backstage/plugin-notifications`, `plugin-notifications-backend`, `plugin-notifications-common`, `plugin-notifications-node`
- All `@backstage/plugin-notifications-backend-module-*` packages

#### `kubernetes`

- `@backstage/plugin-kubernetes`, `plugin-kubernetes-backend`, `plugin-kubernetes-cluster`, `plugin-kubernetes-common`, `plugin-kubernetes-node`, `plugin-kubernetes-react`

#### `api-docs`

- `@backstage/plugin-api-docs`, `plugin-api-docs-module-protoc-gen-doc`

#### `devtools`

- `@backstage/plugin-devtools`, `plugin-devtools-backend`, `plugin-devtools-common`, `plugin-devtools-react`

#### `default-plugins`

The set of plugins that are commonly enabled in a default Backstage app but do not need
their own workspace boundary. Grouping them keeps the workspace count manageable while
still letting each plugin be versioned independently inside the workspace.

- `@backstage/plugin-home`, `plugin-home-react`
- `@backstage/plugin-org`, `plugin-org-react`
- `@backstage/plugin-user-settings`, `plugin-user-settings-backend`, `plugin-user-settings-common`
- `@backstage/plugin-proxy-backend`, `plugin-proxy-node`
- `@backstage/plugin-gateway-backend`
- `@backstage/plugin-mcp-actions-backend`

#### Packages that remain at the repository root (not released)

- `packages/app`, `packages/app-legacy`, `packages/backend`, `packages/app-example-plugin`
- `packages/e2e-test`, `packages/e2e-test-utils`
- `packages/frontend-internal`, `packages/backend-internal`, `packages/cli-internal` (private development tooling that we may consolidate into a single `packages/internal` workspace)
- `plugins/example-todo-list`, `plugins/example-todo-list-backend`, `plugins/example-todo-list-common`

### Release cadence per workspace

Each workspace selects its mainline-release cadence in its own `package.json`. The
following modes are supported; this BEP includes a recommendation for each workspace,
but the choice is up to the workspace maintainers:

1. **Immediate** — every push to `main` that contains merged changesets cuts a release
   for the affected workspace. No human in the loop. Suited to high-velocity plugin
   workspaces where a single bug fix should reach adopters within minutes.
   _Recommended for_: `default-plugins`, `kubernetes`, `api-docs`, `devtools`,
   `notifications`, leaf plugin workspaces in general.

2. **Version Packages PR** — the changesets bot maintains a "Version Packages
   (workspace)" PR that accumulates pending changesets and bumps versions. Merging that
   PR cuts the release. This is the model used by `backstage/community-plugins` today.
   Suited to workspaces that want a human checkpoint and changelog review before each
   release, but still want fast turnaround when they choose to merge.
   _Recommended for_: `catalog`, `scaffolder`, `auth`, `search`, `permission`,
   `techdocs`.

3. **Scheduled batch** — the "Version Packages" PR is opened and merged automatically
   on a fixed schedule (e.g. weekly, biweekly). Combines the predictability of the
   current weekly cadence with per-workspace independence.
   _Recommended for_: workspaces that want a predictable release calendar without the
   noise of immediate releases.

4. **Manual** — releases only run when a maintainer triggers them via
   `workflow_dispatch`. Suited to workspaces that release rarely and want full control
   over timing.
   _Recommended for_: `framework`.

The selection is encoded in `workspaces/<name>/package.json` under a
`backstage.release.cadence` field (e.g. `"immediate"`, `"version-packages"`,
`{ "type": "scheduled", "cron": "0 9 * * MON" }`, or `"manual"`), so the same release
workflow can act on it without per-workspace YAML duplication.

Independent of mainline cadence, every workspace also opts in or out of `@next`
releases. When opted in:

- **Next release** (`@next`): cut from `main` whenever queued breaking-change patches
  for that workspace produce a meaningful change, on the same trigger as the chosen
  mainline cadence. Applies the queued patches and publishes with the next major
  version.
- **Major release**: cut explicitly by the workspace maintainers when they decide to
  promote the queued breaking changes. This merges the patches into `main`, drops the
  `@next` line, and produces the next major `@latest` release.

### Breaking-change patches

A "breaking-change patch" is a self-contained record of a future breaking change that
lives in the `main` branch but is not yet applied to the released code. It consists of:

1. A human-readable description (the same content that would appear in a major-version
   changelog entry).
2. A git diff that, when applied to the current state of the workspace, transforms it
   into the form it will take after the breaking change ships.
3. Optional metadata: ordering hints, related issue/PR numbers, target removal window.

Patches live under each workspace under a `.patches/` directory, and are checked on every PR:
the CI applies them in order to verify that they still cleanly transform the workspace.
Any PR that mutates code touched by an open patch is required to update that patch as
part of the same PR; this is the property that guarantees the queue never rots.

A PR that introduces a deprecation can include the patch that removes the deprecation
in the same PR. Reviewers can read both the deprecation diff and the removal diff side
by side, the deprecation ships immediately to `@latest`, the removal ships to `@next`
on the same merge, and the eventual cleanup is no longer the responsibility of a
future contributor.

### Mainline and next releases from the same branch

This is the central operational property of the proposal. From a single linear `main`
branch:

```
                main HEAD
                     │
   ┌── apply zero patches ──> publish @latest (e.g. 1.42.0)
   │
   └── apply queued .patches/* in order ──> publish @next (e.g. 2.0.0-next.<N>)
```

There is no long-lived "next" branch. There are no cross-branch merges. The set of
breaking changes that will be in the next major is exactly the set of patch files
currently in `main`, which is easy to read, review, list, and reason about.

When the workspace decides to take the major:

1. Apply all queued patches into `main` as a normal merge commit.
2. Convert the patches' descriptions into proper changesets with a `major` bump.
3. Delete the patches.
4. Release in the normal flow — `@next` will simply be empty until new patches are
   filed, and `@latest` becomes the new major.

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
    .patches/
      <slug>/
        description.md      # frontmatter + body, in changeset format
        change.patch        # unified diff or git-formatted patch
        meta.yaml           # optional: order, related-prs, target-removal
    packages/
      <package>/...
    plugins/
      <plugin>/...
```

The repository root keeps:

- `package.json` for the root, declaring `workspaces/*/` (and any remaining root-level
  private packages) as Yarn workspaces. The root `package.json` does not publish
  anything.
- `beps/`, `docs/`, `OWNERS.md`, `CONTRIBUTING.md`, etc.
- A `scripts/` directory that hosts shared release tooling.
- `.github/workflows/` that fan out per-workspace jobs.

Each per-workspace `package.json` declares the Node engine range it supports, which is
how the CI matrix is computed (the same approach used in community-plugins).

### Patch file format

A patch is a directory under `<workspace>/.patches/<slug>/`. The slug carries the
ordering, prefixed with a numeric segment so that lexicographic file-name sort produces
the apply order:

```
workspaces/catalog/.patches/
  001-remove-deprecated-entity-ref-link-props/
    description.md
    change.patch
    meta.yaml          # optional
```

```yaml
# description.md (changeset-compatible)
---
'@backstage/plugin-catalog': major
'@backstage/plugin-catalog-react': major
---
Removed the deprecated `EntityRefLink` props `defaultKind` and `defaultNamespace`.
Pass these as part of the `entityRef` instead.
```

```diff
# change.patch
diff --git a/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx b/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
--- a/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
+++ b/plugins/catalog-react/src/components/EntityRefLink/EntityRefLink.tsx
@@ ... @@
- defaultKind, defaultNamespace,
- ...
```

```yaml
# meta.yaml (optional, only used when extra metadata is needed)
relatedPrs: [12345, 12678]
notBefore:
  # ISO date — exclude this patch from @next releases until at least this date
  date: 2026-09-01
  # OR: depend on another patch being shipped first. The referenced patch can live
  # in the same workspace or in a different workspace; the gate is satisfied once
  # the referenced patch has been merged into main (i.e. promoted to a major).
  patches:
    - framework/050-remove-config-mode-flag
    - auth/020-rotate-token-format
```

Patch apply order is determined by file-name sort within the `.patches/` directory of
a workspace. The numeric prefix (`001-`, `010-`, `200-`) is a convention to leave gaps
for inserting future patches without renumbering. Slugs must be unique within a
workspace.

`meta.yaml` is optional and only needed for richer metadata. The supported keys are:

- `relatedPrs`: pointers to the PRs that authored or refreshed the patch.
- `notBefore.date`: ISO date before which the patch must not be included in `@next`.
  Useful for honoring deprecation windows ("won't remove this until at least N months
  after deprecation").
- `notBefore.patches`: list of `<workspace>/<slug>` references to other patches that
  must ship to `@latest` (i.e. be promoted into a major release) before this patch is
  eligible for `@next`. This is how a staged breaking change in one workspace can wait
  on a prerequisite breaking change in another workspace, even though the workspaces
  publish independently. Cross-workspace gates are checked when computing the set of
  patches to apply for a `@next` release: if a referenced patch is still present in
  any `.patches/` directory, the dependent patch is skipped.

The patch payload is a normal `git` diff. We use `git apply` with `--3way` so that
trivial textual conflicts caused by unrelated edits to the same file can be resolved
automatically; non-trivial conflicts fail CI and require the author of the conflicting
PR to update the patch.

### Author workflow

1. **Non-breaking change.** Author edits code, runs `yarn changeset` inside the
   workspace, commits. Same as today, scoped to one workspace.

2. **Breaking change with same-PR deprecation.** Author:

   1. Edits code to add the deprecated alias and a runtime warning.
   2. Runs `yarn changeset` for the deprecation (regular `minor`/`patch`).
   3. Runs `yarn breaking-change <slug>`. The tool snapshots the current workspace,
      drops the author into a scratch state where they apply the removal, then captures
      the diff into `.patches/<slug>/change.patch` and prompts for a description that
      becomes `description.md`.
   4. Commits. CI verifies the patch applies cleanly on top of `main`.

3. **Updating an existing patch.** When a PR conflicts with a queued patch, CI fails
   with a pointer to the failing patch. The author runs
   `yarn breaking-change refresh <slug>`, which re-runs the apply/edit/capture loop and
   produces an updated patch. The PR is required to include the refreshed patch.

4. **Promoting patches to a major.** A workspace maintainer runs
   `yarn breaking-change promote`, which:
   1. Applies every patch under `.patches/` in order.
   2. Moves each `description.md` into `.changeset/`.
   3. Deletes the patches.
   4. Stages the result so it can be opened as a single PR.

### Release workflow

The CI workflow follows the pattern established by community-plugins, with additions
for `@next` releases and for triggering publishing in the private repository.

```
on push to main:

  find-changed-workspaces
        │
        ├── matrix per workspace
        │
        └── release-workspace.yml
              ├── job: changeset-pr        (opens "Version Packages" PR for workspace)
              ├── job: next-changeset-pr   (opens "Version Packages (next)" PR for workspace
              │                              after applying all .patches/ in order)
              ├── job: signal-publish      (when a Version Packages PR is merged, the
              │                              resulting commit needs publishing)
              └── job: notify              (notifies the private publishing repo)
```

`find-changed-workspaces` is a direct port of the community-plugins script: it diffs
the push against its base and emits the list of workspaces with changes plus a node
version matrix.

`release-workspace.yml` is parameterized by `workspace`. Inside the job:

- `check-if-release` looks for package.json version bumps in that workspace between the
  previous and current commits (same as community-plugins).
- `next-release-check` looks for `.patches/` entries in that workspace and, if present,
  prepares a separate "Version Packages (next)" PR by applying the patches and running
  `yarn changeset version` in a temporary checkout.

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
    "tag": "latest"
  }
}
```

(or `"tag": "next"` for `@next` releases).

`repository_dispatch` is chosen over `workflow_dispatch` because the trigger token only
needs the `repo` scope, not the `actions` scope, and because the dispatch event is
self-describing and easy to log. The dispatch is sent using a GitHub App or a fine-grained
PAT with permission to dispatch on the publishing repository and nothing else, so a
compromised workflow run in `backstage/backstage` cannot publish arbitrary code.

`backstage/publishing` is then responsible for:

- Checking out `backstage/backstage` at the supplied SHA.
- Running `yarn install` and `yarn build` for the workspace.
- Publishing to npm with provenance and an OIDC-bound npm token.
- Pushing back a per-workspace git tag (e.g. `catalog@2.3.0`, `framework@2026.4`) for
  traceability. Tags are workspace-scoped only; we do not tag individual packages.

This preserves the current security boundary: `backstage/backstage` never has an npm
token, and a compromised workflow run cannot publish a package.

### Versioning of the core framework

The `framework` workspace adopts an incrementing date-based version line of the form
`YYYY.N`, where `YYYY` is the calendar year and `N` is a per-year incrementing release
number that resets each January. Examples: `2026.1`, `2026.2`, `2026.3`, `2027.1`.

The rationale for "year plus incrementing number" rather than month- or quarter-based
encoding is:

- It does not lie about when the release shipped (a calendar-versioned `2026.04`
  release that actually shipped on May 3rd is mildly embarrassing).
- It does not over-promise a cadence (a `2026.Q2` release that slips to Q3 is worse).
- It tolerates multiple releases inside the same month without semantic weirdness;
  `2026.4` and `2026.5` can both ship in June if needed.
- It is short and easy to say.

Each individual package inside the workspace continues to use semver internally so that
consumers can still pin minor versions. What changes is only the workspace-level
release identifier, which is surfaced as a git tag (`framework@2026.4`) and as a
field in `workspaces/framework/package.json`. Other workspaces continue to use plain
semver (`catalog@2.3.0`).

### Tooling consolidation with backstage-community-plugins

The release scripts in `backstage/community-plugins/scripts/ci/` (`check-if-release.js`,
`list-workspaces-with-changes.js`, `create-tag.js`, etc.) are CLI scripts duplicated in
each consuming repository. We propose to publish them as a Backstage CLI module so that
both `backstage/backstage` and `backstage/community-plugins` consume the same
implementation.

Concretely:

- Create a new package `@backstage/cli-module-release` inside the `cli` workspace.
- Move and refactor the community-plugins scripts into commands under
  `backstage release …` (e.g. `backstage release list-changed-workspaces`,
  `backstage release check-needs-release`, `backstage release create-tag`).
- Add the new commands needed by this BEP:
  `backstage release breaking-change create|refresh|apply|promote` and
  `backstage release next-version`.
- Update both repositories' workflows to invoke the CLI instead of duplicated scripts.

This consolidation has the additional benefit that community-plugins gains the
breaking-change patch mechanism for free if it ever wants to adopt it.

### Documentation and microsite

The repository's `docs/` directory and the Docusaurus site under `microsite/` need a
clear home in the new layout. We propose:

- The `microsite/` directory becomes its own non-published workspace at
  `workspaces/microsite/`. It is migrated to the new layout early in the rollout,
  alongside the `cli` workspace, because it has no runtime dependencies on the
  framework and can validate the workspace tooling cheaply.
- The top-level `docs/` directory stays at the repository root and keeps content that
  is cross-cutting: `architecture-decisions/`, `contribute/`, `getting-started/`,
  `tutorials/`, `releases/`, `overview/`, `faq/`, etc. It is owned by the repository
  rather than by any workspace.
- Plugin-area documentation (`docs/auth`, `docs/permissions`, `docs/notifications`,
  `docs/features/search`, `docs/features/techdocs`, `docs/integrations`,
  `docs/frontend-system`, `docs/backend-system`, …) moves into the corresponding
  workspace under `workspaces/<name>/docs/`. The microsite build pulls those
  per-workspace docs in via a build-time index, so the published site URLs do not
  change.
- The published site retains a single sidebar that interleaves cross-cutting and
  workspace-specific docs; the source layout is the only thing that changes.

This makes documentation changes part of the same PR as the corresponding code change
in the workspace, which mirrors how changesets and breaking-change patches already
work in this proposal.

## Release Plan

The migration is staged so that no single PR has to move the entire repository.

1. **BEP approval & tool scaffolding.** Land the BEP, then add the new
   `@backstage/cli-module-release` package with the existing community-plugins commands
   in their current form. Vendor the new `breaking-change` commands behind a flag while
   the format stabilizes.

2. **Migrate `cli` first.** Move all CLI and tooling packages into `workspaces/cli/`.
   This is intentionally early so that the rest of the migration can exercise the new
   release tooling, and because the CLI has no runtime dependencies on `framework`.

3. **Migrate `ui` and `microsite`.** Both are conceptually independent from the
   framework runtime. `ui` enables BUI to ship breakage on its own schedule. `microsite`
   validates the per-workspace docs flow described in
   [Documentation and microsite](#documentation-and-microsite).

4. **Migrate leaf and standalone plugin workspaces.** In rough order:
   `api-docs`, `devtools`, `kubernetes`, `techdocs`, `permission`, `search`,
   `notifications`, `default-plugins`. Each move is a single PR per workspace. By the
   end of this step the surrounding tooling, CI, and publishing flow are exercised by
   many workspaces.

5. **Migrate the larger plugin workspaces.** `auth`, `scaffolder`, `catalog`. These
   are larger and more interconnected, but at this point the migration mechanics are
   well-understood.

6. **Migrate `framework` last.** This is the most invasive move because it touches the
   most root packages and because almost every other workspace depends on it. Doing it
   last means it inherits a fully-validated workspace tooling chain.

7. **Roll out breaking-change patches.** Once `framework` is migrated and stable,
   enable the patch flow. The first end-to-end exercise is a real deprecation PR: file
   the deprecation and the patch together, verify the `@next` release picks the patch
   up, then promote and ship the major.

8. **Adopt date-based versioning for `framework`.** The first major of `framework`
   after the patch flow lands uses the `YYYY.N` scheme.

Throughout the migration the existing weekly release flow continues to work for any
workspace that has not been migrated yet. There is no flag day.

## Dependencies

- The `backstage/publishing` (private) repository needs a generalized publish workflow
  that accepts `(workspace, sha, tag)` rather than the current monolithic publish job.
- Cooperation with `backstage/community-plugins` maintainers to extract shared tooling
  into `@backstage/cli-module-release`. This BEP assumes their consent in principle and
  proposes that the extraction happens in their repo as well, by replacing their
  duplicated scripts with the CLI.
- No new external dependencies are required.

## Alternatives

- **Keep a single workspace, just slow down releases.** Does not solve the
  faster-fixes vs. slower-breaks tension; both audiences are still coupled.
- **Long-lived `next` branch kept in sync with `main`.** Operationally expensive, breaks down
  at scale, and provides no structured representation of queued breaking changes.
- **Treat breaking changes as regular changesets that pile up until the next major.**
  This is essentially today's model. It does not solve deprecation lag and does not let
  us publish `@next` releases continuously without forking the branch.
- **Use a separate repository per workspace.** Closer to a true multi-repo layout.
  Rejected on
  grounds of cross-workspace refactoring cost, contributor experience, and CI
  duplication. The community-plugins pattern (one repo, many workspaces) gives us
  almost all the benefits without those costs.
- **Use `npm` workspaces or `pnpm` instead of Yarn.** Out of scope; we already use
  Yarn workspaces in both this repo and community-plugins.

## Open Questions

The following items are still open and should be resolved during the implementation
phase. Decisions made during BEP review are recorded in
[Workspace map](#workspace-map), [Release cadence per workspace](#release-cadence-per-workspace),
and [Versioning of the core framework](#versioning-of-the-core-framework).

1. **Defaults packages cadence.** `app-defaults`, `backend-defaults`, and
   `frontend-defaults` are currently grouped with the `framework` workspace. We may
   want them to ship breaking changes more often than the rest of the framework.
   Options:

   - (a) Keep them in `framework`, accept the slower cadence.
   - (b) Move them into a separate `defaults` workspace that releases independently.
   - (c) Keep them in `framework` but allow `defaults`-only majors that do not bump the
     framework release identifier.

2. **Events ecosystem placement.** The base `events` packages live in `framework`, but
   the third-party integration modules (`plugin-events-backend-module-aws-sqs`,
   `…-github`, `…-gitlab`, `…-kafka`, …) may want a faster cadence than the framework
   allows. Do we keep them in `framework`, split them into an `events-modules`
   workspace, or move events out of `framework` entirely once the framework moves
   towards a slow major cadence?

3. **"Linked patches" across workspaces.** Cross-workspace ordering is covered by
   `meta.yaml`'s `notBefore.patches` (see [Patch file format](#patch-file-format)).
   That covers the "this patch must wait for that one" case. Do we also need a
   "linked patch" concept where promoting one patch automatically promotes the others,
   even though they live in different workspaces? It is unclear whether this would ever
   be safe in practice, and the safer default may be to require each workspace to
   promote its own patches.
