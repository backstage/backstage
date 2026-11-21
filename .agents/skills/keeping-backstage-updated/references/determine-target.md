# Determine the Target Backstage Release

## Find the current version

Read `backstage.json` at the repository root. Its `version` field is the
canonical Backstage release the repository is on:

```json
{
  "version": "1.45.3"
}
```

If there is no `backstage.json`, read the `@backstage/*` dependencies from the
workspace `package.json` files instead. A core package such as
`@backstage/core-plugin-api` is a good proxy for the release; cross-reference
its version against the release manifests at
[versions.backstage.io](https://versions.backstage.io).

Check `dependencies` and `devDependencies` in every workspace package, not just
the root. Note any `@backstage/*` package whose version doesn't match the rest,
and any `@backstage-community/*` packages, which were moved out of the
`@backstage/*` namespace.

## Mixed versions

If `@backstage/*` packages sit on different releases, flag it to the user. The
version bump resolves it, but mixed versions cause subtle runtime errors, so the
repository should not stay in that state.

## Choose the target

Ask the user which target they want, unless their request already answers it:

- **Latest stable** — resolve to the most recent release from
  [versions.backstage.io](https://versions.backstage.io) or the Backstage
  GitHub releases page, then use that exact version.
- **A specific version** — use the version they name, e.g. `1.45.3`.
- **`next`** — the weekly pre-release line; only when the user explicitly asks
  for it.

The `--release` flag of `backstage-cli versions:bump` accepts an exact `X.Y.Z`
version, or the literal `main` (the latest monthly release, and the default) or
`next`. Do not pass free-form text to `--release`.

## Check whether an upgrade is needed

Compare the current version with the target. If they match, tell the user the
repository is already on the target and stop.

If the target is older than the current version, warn the user: downgrading
across significant version gaps may leave packages mismatched, and is best
suited to small adjustments.

## Check for third-party plugin scopes

`versions:bump` only touches `@backstage/*` packages by default. If the
repository depends on plugins from other scopes that track Backstage releases,
such as `@roadiehq/*`, include them with `--pattern '@{backstage,roadiehq}/*'`.
Ask the user which scopes to include.
