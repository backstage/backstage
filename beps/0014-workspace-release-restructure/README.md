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
  - [Major releases via the Promote PR](#major-releases-via-the-promote-pr)
- [Design Details](#design-details)
  - [Repository layout](#repository-layout)
  - [Patch file format](#patch-file-format)
  - [Author workflow](#author-workflow)
  - [Release workflow](#release-workflow)
    - [Triggering publishing in the private repo](#triggering-publishing-in-the-private-repo)
    - [Publish-time safeguards](#publish-time-safeguards)
  - [Versioning of the core framework](#versioning-of-the-core-framework)
  - [Tooling consolidation with backstage-community-plugins](#tooling-consolidation-with-backstage-community-plugins)
  - [Documentation and microsite](#documentation-and-microsite)
  - [Deferred work](#deferred-work)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

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
> more than one workspace, and the boundaries should be debated before we commit.

#### `framework`

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
- `@backstage/plugin-signals`, `plugin-signals-backend`, `plugin-signals-node`, `plugin-signals-react`

#### `modules`

Framework-level backend modules — modules that extend plugins owned by the `framework`
workspace and that integrate with external systems. Separated so they can ship on a
faster cadence than the framework itself, since the underlying integrations evolve
independently of the framework APIs.

By convention this workspace holds modules that do not belong to a single plugin
workspace; modules that extend a specific plugin (catalog, auth, scaffolder, …) stay
in their owning workspace.

- All `@backstage/plugin-events-backend-module-*` packages

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

#### `microsite`

The Docusaurus site that powers `backstage.io`. The workspace is private — it does not
publish any packages — and is included in the workspace map for completeness. See
[Documentation and microsite](#documentation-and-microsite) for how plugin docs are
pulled in at build time.

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

3. **Manual** — releases only run when a maintainer triggers them via
   `workflow_dispatch`. Suited to workspaces that release rarely and want full control
   over timing.
   _Recommended for_: `framework`.

The selection is encoded in `workspaces/<name>/package.json` under a
`backstage.release.cadence` field (e.g. `"immediate"`, `"version-packages"`, or
`"manual"`), so the same release workflow can act on it without per-workspace YAML
duplication.

The mainline cadence settings above apply only to `@latest` releases. Two adjacent
flows have their own triggers and are not affected by the mainline cadence choice:

- **Major releases** that promote queued breaking-change patches follow a separate,
  uniform flow described in
  [Major releases via the Promote PR](#major-releases-via-the-promote-pr). That flow
  is the same for every workspace; there is no per-workspace mode to pick.
- **`@next` pre-releases** are decoupled from the mainline cadence. Whenever queued
  breaking-change patches for a workspace produce a meaningful change, an `@next`
  publish is dispatched regardless of whether mainline is `immediate`,
  `version-packages`, or `manual`. This matters for workspaces like `framework` whose
  mainline cadence is `manual` but where adopters still want a continuous preview of
  what the next major will contain.

### Breaking-change patches

A "breaking-change patch" is a self-contained record of a future breaking change that
lives in the `main` branch but is not yet applied to the released code. It consists of:

1. A human-readable description (the same content that would appear in a major-version
   changelog entry).
2. A git diff that, when applied to the current state of the workspace, transforms it
   into the form it will take after the breaking change ships.
3. Optional metadata: related issue/PR numbers and `notBefore` constraints (see
   [Patch file format](#patch-file-format) for details). Apply order is encoded in the
   patch's slug, not in metadata.

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

The `<N>` suffix on `@next` releases is the standard Changesets pre-release counter,
incremented by `yarn changeset version` when run in pre-release mode against the
synthesized changeset set; we do not introduce a separate counter.

There is no long-lived "next" branch. There are no cross-branch merges. The set of
breaking changes that will be in the next major is exactly the set of patch files
currently in `main`, which is easy to read, review, list, and reason about.

### Major releases via the Promote PR

Every workspace has one persistent, bot-maintained pull request titled
`Promote major (<workspace>)`. The PR represents what the next major release of the
workspace would look like if it were cut right now.

On every push to `main` that affects a workspace, CI rebuilds the PR for that
workspace from scratch:

1. Apply every queued patch from `workspaces/<name>/.patches/` in file-name order.
2. Move each patch's `description.md` into `.changeset/` so the changeset bot will
   produce the right version bumps when the PR is merged.
3. Delete the patch directories.
4. Commit the result and force-push to the PR branch.

The PR is created and kept open even when the workspace has no queued patches. In
that state it carries a single empty changeset and the description "no breaking
changes queued"; this avoids the noise of creating and closing the PR repeatedly as
patches come and go.

The PR is held as a **draft** at all times. Flipping it to ready-for-review is the
explicit human signal that "this workspace is taking its next major now". A
maintainer flips the PR, the rest of the review policy for the workspace applies
(required reviewers, status checks, etc.), and merging the PR triggers the major
release through the same mainline cadence the workspace uses for every other
release — there is no separate publish path for majors.

Because the PR is force-pushed on every relevant change to `main`, reviewers are
expected to start a final review only after flipping the PR to ready, not while it is
still in draft. GitHub dismisses stale review approvals on force-push by default,
which is acceptable here — the only review that matters is the one cast after the PR
is marked ready and the branch is at the SHA that will actually be merged. The PR is
also marked auto-mergeable in the same way as any other PR; the draft-vs-ready toggle
is the gate.

This model has the properties we want:

- The decision to cut a major is always a manual human action — flipping the PR.
- Every workspace participates in the same flow with no per-workspace mode flag.
- There is always a live, viewable artifact answering "what would the next major of
  `<workspace>` look like right now?"
- Conflicting edits are caught at PR-build time, not at major time, because the same
  patch-apply path runs on every push regardless of whether anyone is about to merge.

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

  This is a constraint, not a trigger. Promoting the patches of one workspace never
  automatically promotes the patches of another; each workspace decides when to cut
  its own major release. The constraint only affects which dependent patches become
  eligible for inclusion in the next major of the depending workspace when its
  maintainers do decide to cut it.

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

4. **Promoting patches to a major.** No author action required. The bot-maintained
   `Promote major (<workspace>)` PR already contains the result of applying every
   queued patch (see
   [Major releases via the Promote PR](#major-releases-via-the-promote-pr)). To
   ship the major, a workspace maintainer flips that PR from draft to ready-for-review
   and follows the normal review-and-merge process for the workspace. The same
   `yarn breaking-change promote` CLI exists as a developer convenience — it produces
   the same output the bot would on the same commit — and is intended only for local
   inspection, not as part of any release pipeline.

### Release workflow

The CI workflow follows the pattern established by community-plugins, extended with
two additions specific to this BEP: a per-workspace `Promote major` PR that is
rebuilt on every push, and a per-workspace `@next` publish that runs whenever queued
patches change.

```
on push to main:

  find-changed-workspaces
        │
        ├── matrix per workspace
        │
        └── release-workspace.yml
              ├── job: changeset-pr     (mainline cadence "version-packages" only —
              │                           opens/updates "Version Packages" PR)
              ├── job: promote-pr       (always — rebuilds the draft
              │                           "Promote major (workspace)" PR by
              │                           applying every queued .patches/ entry)
              ├── job: dispatch-latest  (when a release commit is detected on main,
              │                           dispatches @latest publish to the
              │                           publishing repo)
              └── job: dispatch-next    (when applying queued patches would produce
                                         a new @next version, dispatches @next
                                         publish to the publishing repo)
```

`find-changed-workspaces` is a direct port of the community-plugins script: it diffs
the push against its base and emits the list of workspaces with changes plus a node
version matrix.

`release-workspace.yml` is parameterized by `workspace`. Inside the job:

- `check-if-release` looks for `package.json` version bumps in the workspace between
  the previous and current commits (same as community-plugins).
- `promote-pr` always runs. It applies every queued patch in a temporary checkout,
  converts each patch's `description.md` into a changeset, deletes the patches, and
  force-pushes the result onto the `Promote major (<workspace>)` PR branch. The PR is
  kept in draft (see
  [Major releases via the Promote PR](#major-releases-via-the-promote-pr)).
- `dispatch-next` runs whenever the queued patch set has changed for the workspace. It
  applies the patches in a temporary checkout, runs `yarn changeset version` to
  compute the next pre-release identifier, and dispatches a publish with `tag: next`.
  Because `@next` is decoupled from the mainline cadence, this fires even for
  workspaces in `cadence: manual` mode.

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

`tag` is an opaque string treated as the npm dist-tag for the publish. The dispatching
workflow uses `latest` for mainline releases, `next` for releases that include queued
breaking-change patches, and may use other identifiers (`alpha`, etc.) in the future.
The publishing repo applies the same safeguards regardless of value, with an extra
required-reviewer gate for `latest` (see
[Publish-time safeguards](#publish-time-safeguards)).

`repository_dispatch` is chosen over `workflow_dispatch` because the trigger token only
needs the `repo` scope, not the `actions` scope, and because the dispatch event is
self-describing and easy to log. The dispatch is sent using a GitHub App or a
fine-grained PAT with permission to dispatch on the publishing repository and nothing
else.

`backstage/publishing` is then responsible for:

- Validating the dispatch (see [Publish-time safeguards](#publish-time-safeguards)
  below).
- Checking out `backstage/backstage` at the supplied SHA.
- Running `yarn install` and `yarn build` for the workspace.
- Publishing to npm with provenance and an OIDC-bound npm token.
- Pushing back per-package git tags (e.g. `@backstage/plugin-catalog@2.3.0`), matching
  the convention `backstage/community-plugins` uses today. The `framework` workspace
  additionally pushes a workspace-level tag carrying its release identifier (e.g.
  `framework@2026.4`) on every major release, so the date-based identifier can be
  looked up in git. No other workspace publishes a workspace-level tag.

This preserves the current security boundary: `backstage/backstage` never has an npm
token, and a compromised workflow run cannot publish a package.

#### Publish-time safeguards

The dispatch itself is not trusted. A compromised workflow run in
`backstage/backstage`, a leaked dispatch token, or a hijacked GitHub App installation
must never result in published code that did not go through code review on the
protected `main` branch. The publishing repo enforces three independent checks:

1. **Ancestor check (all releases).** Before doing any work, the publishing workflow
   calls
   `GET /repos/backstage/backstage/compare/{sha}...main` and refuses to continue unless
   the comparison status is `identical` or `ahead`. Because `main` has branch
   protection that requires code review and a passing CI, "the SHA is on `main`" is
   equivalent to "the commit was reviewed and merged".

2. **OIDC binding (all releases).** Rather than trusting the `repository_dispatch`
   payload, the dispatching workflow in `backstage/backstage` first mints a GitHub
   Actions OIDC token and includes it in the dispatch payload (or hands it to a small
   broker that re-dispatches with the token attached). The publishing workflow
   validates the OIDC JWT and requires:

   - `repository == "backstage/backstage"`
   - `ref == "refs/heads/main"`
   - `event_name == "push"`
   - `workflow_ref` matches an allow-listed workflow file in `backstage/backstage`
     (`.github/workflows/release_workspace.yml` and any other release entry points).

   This cryptographically ties the dispatched SHA to a workflow run that GitHub itself
   agrees executed on `main`, defending against forged dispatches even if the token
   that sends them is compromised.

3. **Required reviewer (mainline `@latest` releases only).** The publishing workflow
   runs inside a GitHub Environment (e.g. `npm-publish-latest`) configured with
   required reviewers from `@backstage/maintainers`. Every publish to the `latest`
   dist-tag pauses until a maintainer clicks "Approve and deploy".

   Releases with any other dist-tag (`next`, `alpha`, and similar pre-release tags)
   skip the required-reviewer gate and use a separate environment without approval
   gates, so pre-releases continue to ship without human intervention. They are still
   subject to checks (1) and (2).

The current "nightly snapshot" release flow is expected to be removed as part of this
rollout. If it is kept in any form, it falls into the same "no required reviewer"
bucket as `@next`.

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

Each individual package inside the workspace continues to use semver internally so
that consumers can still pin minor versions. What changes is only the workspace-level
release identifier, which is surfaced as a git tag (`framework@2026.4`) and as a
field in `workspaces/framework/package.json`. Other workspaces continue to use plain
semver (`catalog@2.3.0`).

There is no fixed calendar for when framework majors ship. The trigger is the same as
for every other workspace: a maintainer flipping the `Promote major (framework)` PR
from draft to ready-for-review (see
[Major releases via the Promote PR](#major-releases-via-the-promote-pr)). The only
calendar-driven behavior is the year segment of the version number: the counter
resets to `1` on the first major shipped in a new calendar year. The CLI computes the
next identifier as "current year, plus one greater than the highest `N` that has
shipped in the current year, or `1` if no major has shipped yet this year".

The current Backstage release is identified by the framework's release identifier. We
also want to track, for every published workspace release, the framework release it
was built and tested against, so adopters using the Backstage Yarn plugin can pin a
Backstage release and have the plugin resolve the matching workspace versions. The exact shape
of that mapping (what gets recorded, where, and how the Yarn plugin consumes it) is
left to follow-up work — some workspaces will not target any framework release at all
(for example `ui`, which has no runtime dependency on `framework`), so the mapping
needs to model "no target" as a valid value.

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

### Deferred work

The following pieces are intentionally not designed in this BEP and will be addressed
in follow-up work before the corresponding migration step lands. They are collected
here so reviewers can see them as a single list rather than scattered through the
prose.

- **OIDC broker for publish dispatches.** `repository_dispatch` does not natively
  carry an OIDC token. Realizing the OIDC binding in
  [Publish-time safeguards](#publish-time-safeguards) requires either a small broker
  service that re-dispatches with the token attached, or moving to a different
  trigger mechanism that does carry OIDC. The broker has to be designed and reviewed
  before publish-time safeguards can be enforced end to end.
- **Backstage release ↔ workspace versions mapping.** The framework's release
  identifier (`YYYY.N`) becomes the Backstage release. We want every workspace
  release to record which Backstage release it was built and tested against, so the
  Backstage Yarn plugin can resolve a pinned Backstage release to a concrete set of
  workspace versions. The exact shape (where it lives, who writes it, what "no target"
  looks like for workspaces like `ui`) is deferred to a follow-up that lands together
  with or shortly after the `framework` migration.
- **Internal-packages consolidation.** Whether the `packages/*-internal` packages
  collapse into a single private `workspaces/internal/` workspace is left as an
  implementation detail of the `framework` and `cli` migrations.

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

6. **Migrate `modules` alongside `framework`.** The `modules` workspace and the
   `framework` workspace are split out together, because the modules depend on the
   `framework` packages and cannot be carved off until those packages have a stable
   home.

7. **Migrate `framework` last.** This is the most invasive move because it touches the
   most root packages and because almost every other workspace depends on it. Doing it
   last means it inherits a fully-validated workspace tooling chain.

8. **Roll out breaking-change patches.** Once `framework` is migrated and stable,
   enable the patch flow. The first end-to-end exercise is a real deprecation PR: file
   the deprecation and the patch together, verify the `@next` release picks the patch
   up, then flip the `Promote major` PR to ready-for-review and ship the major.

9. **Adopt date-based versioning for `framework`.** The first major of `framework`
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
