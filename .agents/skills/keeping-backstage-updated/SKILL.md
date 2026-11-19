---
name: keeping-backstage-updated
description: Upgrade a Backstage repository to a newer Backstage release. Use this skill when bumping @backstage/* package versions, running versions:bump or versions:migrate, applying create-app template changes or codemod recipes during an upgrade, or fixing code that broke after a Backstage version change.
---

# Keeping Backstage Updated

This skill moves a Backstage repository — an app, a plugin workspace, or both —
from one Backstage release to another. It covers the whole upgrade: choosing the
target release, bumping dependencies, migrating moved packages, applying
create-app template changes, running codemod recipes, fixing breaking changes,
and verifying the result.

Start here, then read only the reference you need:

- `references/determine-target.md`: find the current Backstage version and choose the target release
- `references/bump-dependencies.md`: run `versions:bump`, handle third-party plugin scopes and the Backstage yarn plugin, audit resolutions and overrides
- `references/migrate-packages.md`: move dependencies and imports off renamed or relocated packages with `versions:migrate`
- `references/template-changes.md`: apply `create-app` template changes to app and backend packages
- `references/codemods.md`: run the versioned codemod recipe for the target release
- `references/fix-breaking-changes.md`: work through the release changelogs and fix affected code
- `references/verify-upgrade.md`: run the repository's checks and confirm the upgrade is complete

## Before you start

1. Check that the git working tree is clean. If it isn't, ask the user whether
   to commit or stash first. An upgrade touches many files, and mixing it with
   other changes makes the diff impossible to review.
2. Read `backstage.json` at the repository root for the current Backstage
   version. If there is no `backstage.json`, read the `@backstage/*` versions
   from the workspace `package.json` files.
3. Load `references/determine-target.md`, choose the target release, and report
   the current version and the target to the user before changing anything.

Keep each upgrade in its own commit or pull request. If the repository is
several releases behind, upgrade one release at a time rather than jumping
straight to the newest, so the changelogs and codemod recipes apply cleanly.

## Upgrade order

Follow these steps in order, each deferring to its reference:

1. **Choose the target release** — `references/determine-target.md`
2. **Bump dependencies** — `references/bump-dependencies.md`. This runs
   `versions:bump`, installs, and runs `versions:migrate` unless skipped.
3. **Apply template changes** — `references/template-changes.md`, for
   repositories with app or backend packages
4. **Run the codemod recipe** — `references/codemods.md`
5. **Fix breaking changes** — `references/fix-breaking-changes.md`
6. **Verify** — `references/verify-upgrade.md`

If a step fails, stop and fix it before moving on. Do not use build errors from
a partial install as guidance for later steps.

## The Backstage yarn plugin

If the repository's `package.json` files use `"backstage:^"` as the version of
`@backstage/*` dependencies, the Backstage yarn plugin is installed and resolves
those versions from `backstage.json`. The plugin requires yarn 4.1.1 or greater,
and `backstage.json` must reach CI and container builds, since that is where
versions get resolved. `versions:bump` detects the plugin and migrates
dependency declarations across the workspace to `backstage:^`. See
`references/bump-dependencies.md` for adopting it during an upgrade.

## Rules

- Never leave `@backstage/*` packages on mixed releases. The packages are
  versioned together per release, and mixed versions cause subtle runtime
  errors.
- Read the changelog for every release between the current and target version.
  Do not assume a version range is breaking-change free.
- Only pass an exact `X.Y.Z` version or the literal `main` or `next` to
  `--release`. Resolve wording like "latest stable" to an exact version first.
- Review the `package.json` and lockfile diffs after installing, before editing
  source code. Never delete a committed lockfile to hide a conflict.
- Do not stage, commit, or push unless the user asks. An upgrade is complete
  when the checks in `references/verify-upgrade.md` pass.

## Related Skills

The references link to these skills from their steps. If they aren't installed,
install them with `npx skills add https://backstage.io`, or follow the
documentation links in each reference instead.

- `new-frontend-system-migration`: moving an app or plugins to the new frontend system, often scheduled right after an upgrade
- `mui-to-bui-migration`: moving page components from Material UI to Backstage UI, a larger migration with its own misc codemod recipe
- `frontend-plugin-development` and `backend-plugin-development`: what working plugin code looks like on the current systems, useful when fixing breaking changes
