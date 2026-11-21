# Fix Breaking Changes

## Find the relevant changelogs

List every Backstage release between the current and target version. For each
one, read:

- Release notes: `docs/releases/v<VERSION>.md` in the backstage/backstage
  repository, e.g.
  <https://github.com/backstage/backstage/blob/master/docs/releases/v1.52.0.md>
- Detailed changelog: `docs/releases/v<VERSION>-changelog.md` alongside it

Focus on the **Breaking changes** and **Minor changes** sections. Patch releases
rarely require code updates, but read them anyway when the jump spans many
releases.

## Work through each change

For each breaking change:

1. Read the description and understand what was renamed, removed, or
   restructured.
2. Search the repository for the affected API before editing anything:
   `git grep '<old API name>'`. Many changes won't apply to this repository at
   all.
3. Apply the fix following the migration guidance in the changelog.
4. Type-check after each fix, e.g. `yarn tsc`, to confirm it resolved.

## Common patterns

| Pattern                                | What to look for                                        | Fix                                                                           |
| -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Renamed export                         | `import { OldName }`                                    | Update the import                                                             |
| Moved package                          | `@backstage/plugin-x` → `@backstage-community/plugin-x` | `versions:migrate`                                                            |
| Removed API                            | imports of the removed symbol                           | Replace with the alternative the changelog recommends                         |
| Changed signature                      | type errors at call sites                               | Update the call site per the changelog                                        |
| New required field                     | missing-property errors                                 | Add the field                                                                 |
| New or renamed backend service factory | backend startup or type errors                          | Compare `@backstage/backend-defaults` exports and update service registration |

## Per-package changelogs

Every package in the Backstage repository has its own `CHANGELOG.md`. When the
type checker points at a specific package, read its changelog for detail the
release notes leave out:

```
https://github.com/backstage/backstage/blob/master/packages/<package>/CHANGELOG.md
https://github.com/backstage/backstage/blob/master/plugins/<plugin>/CHANGELOG.md
```

## When the fix is a migration

If the remaining work is a larger migration rather than a fix — moving a plugin
to the new frontend system, or Material UI components to Backstage UI — keep
this upgrade limited to the version bump and hand the migration to the matching
skill, `new-frontend-system-migration` or `mui-to-bui-migration`.
