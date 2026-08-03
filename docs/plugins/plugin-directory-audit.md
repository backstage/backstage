---
id: plugin-directory-audit
title: Plugin Directory Audit
description: Details about the process for auditing plugins in the directory
---

:::caution Legacy Documentation

This section is part of the legacy plugins documentation. The audit process described here is still current.

:::

## Audit Process

Run a read-only inspection from the repository root:

```bash
yarn --cwd microsite plugins:audit:check
```

The check fetches the current npm and GitHub data, prints every plugin in a
table, and reports remote-data warnings without changing manifest files.

To update manifests during the quarterly audit, run:

```bash
GITHUB_TOKEN=your-token yarn --cwd microsite plugins:audit
```

`GITHUB_TOKEN` is optional for public repositories, but using one avoids the
low unauthenticated GitHub API rate limit. Review the changed manifests and
submit them in a pull request.

The audit determines package age from the publication time of the npm version
identified by the `latest` distribution tag. A package older than 365 days
moves from `active` to `inactive`, and an inactive package older than 365 days
moves to `archived`. A newer inactive or archived package moves back to
`active`. The audit sets `staleSince` when a plugin first becomes inactive,
preserves that date when it becomes archived, and removes it when the plugin
becomes active.

Each plugin manifest has an audit-owned `snapshot` key with independent `npm`
and `backstage` source data:

- `fresh` means the current audit fetched usable source data.
- `stale` means the current fetch failed, so the last successful values and
  their original `checkedAt` time were retained.
- `unavailable` means no successful values are available.

Remote-data failures do not change the plugin's top-level status. They are
recorded with stable reason codes in `snapshot` and shown as readable warnings
by the command.

For GitHub repositories containing multiple packages, the audit starts at the
npm repository's package directory and searches each ancestor for
`backstage.json`, falling back to the repository root. The closest matching
file supplies the Backstage version in the snapshot.

An `inactive` plugin appears in the inactive section at the bottom of the
Plugin Directory. An `archived` plugin does not appear in the Plugin Directory.

:::tip

If your plugin moved to `inactive` or `archived` and you publish a new release,
the next audit will restore it to `active`.

:::
