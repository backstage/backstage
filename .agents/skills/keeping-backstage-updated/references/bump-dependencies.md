# Bump Dependencies

## Run the bump

From the repository root:

```bash
yarn backstage-cli versions:bump --release <version>
```

Use `npx backstage-cli` or `yarn dlx backstage-cli` in repositories that don't
have the CLI installed. If the repository wraps the command in a script, such as
a `versions:bump` script in the root `package.json`, prefer the wrapper: it may
enforce pinning or update generated files the CLI doesn't know about.

The command reads the release manifest for the target version, updates all
`@backstage/*` versions in `package.json`, writes the new release to
`backstage.json`, runs `yarn install` to update the lockfile, and runs
`versions:migrate` for moved packages unless `--skipMigrate` is set. It skips the
`backstage.json` update when a custom `--pattern` doesn't cover `@backstage/*`,
so check that file after using one.

### Flags

| Flag                                  | Effect                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `--release <version>`                 | Target a specific release: `main` (default), `next`, or an exact `X.Y.Z` |
| `--pattern '@{backstage,roadiehq}/*'` | Include additional package scopes                                        |
| `--skipInstall`                       | Skip `yarn install`, to review changes first                             |
| `--skipMigrate`                       | Skip the automatic `versions:migrate` run                                |

## Preserve the dependency range style

Before the bump, record whether the repository pins exact versions or uses
ranges like `^` or `~` for `@backstage/*` dependencies. If the bump rewrites
that style, restore the repository's convention and refresh the lockfile with
`yarn install`. The `backstage:^` style belongs to the Backstage yarn plugin and
should be left alone.

## The Backstage yarn plugin

If the repository uses `"backstage:^"` versions, the Backstage yarn plugin is
installed. It resolves `@backstage/*` versions from `backstage.json`, requires
yarn 4.1.1 or greater, and needs `backstage.json` to reach CI and container
builds. `versions:bump` detects the plugin, updates it to the target release with
`yarn plugin import`, and migrates dependency declarations across the workspace
to `backstage:^`. Expect plugin file changes in the diff.

To adopt the plugin during an upgrade, on yarn 4.1.1 or greater:

```bash
yarn plugin import https://versions.backstage.io/v1/tags/main/yarn-plugin
```

Commit the resulting changes, then run the bump.

## Audit resolutions and overrides

Inventory every `resolutions` and `overrides` entry before the bump. An
obsolete transitive pin may only become visible once the new dependency graph no
longer reaches it.

Before the bump:

1. Record each entry's field, selector, and replacement value.
2. Capture which dependency paths the entry affects, with
   `yarn why -R <package>` or `npm explain <package>`.
3. Trace the entry to the commit that introduced it, with
   `git log -S '<selector>'`, and note the condition it was meant to enforce —
   a security fix, a singleton requirement, a build workaround.

After the install, rerun the graph queries and compare. Classify each entry as
**keep**, **update**, or **remove**: keep or update it only while the original
condition still applies to the new graph, and remove it only after testing the
graph without it. A green install or build alone does not prove a pin is
obsolete.

## Review the diff

Read the full `package.json` and lockfile diff before editing source code.
Confirm every `@backstage/*` package moved to the target release, that the
dependency range style is intact, and that no unexpected dependency changed.

## Troubleshooting

**Could not fetch release manifest** — the CLI fetches from
`https://versions.backstage.io`; check network access, or point
`BACKSTAGE_MANIFEST_FILE` at a local manifest file.

**Version not found** — verify the release exists on the Backstage GitHub
releases page.

**Lockfile conflicts** — diagnose the conflicting dependency or resolution and
rerun the bump or install. Do not delete a committed lockfile to hide the
conflict.

**Workspace resolution errors** — in monorepos, run `yarn dedupe @backstage/*`
after the bump to collapse duplicate versions of shared packages.
