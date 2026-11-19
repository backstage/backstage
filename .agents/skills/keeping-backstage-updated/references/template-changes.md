# Apply create-app Template Changes

## Why template changes don't arrive with the bump

`@backstage/create-app` generates the initial `packages/app` and
`packages/backend` from a template in the Backstage repository. The template is
updated over time, but packages created from it don't receive those updates
automatically — a dependency bump updates libraries, not your own package
source. Skip this reference in repositories that have no app or backend package,
such as plugin-only workspaces.

## Find the changes

Two sources list template changes between releases:

- The [`@backstage/create-app` changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)
  documents each template change with upgrade instructions.
- The [Backstage Upgrade Helper](https://backstage.github.io/upgrade-helper/)
  shows a consolidated diff of the template between two versions. Select the
  current and target releases.

## Apply them

Work through the changes for every release between the current and target
version. For each change, check whether the repository's own code is affected —
apps accumulate local customizations, and a template change that renames or
relocates something may collide with them. When the local file has diverged from
the template, apply the underlying change rather than replacing the file with
the template version.

When the Upgrade Helper diff is large, focus on files under `packages/app` and
`packages/backend` that exist in both the template and the repository, and
ignore template scaffolding the repository doesn't have.
