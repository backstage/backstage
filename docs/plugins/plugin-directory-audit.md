---
id: plugin-directory-audit
title: Plugin Directory Audit
description: Details about the process for auditing plugins in the directory
---

:::caution Legacy Documentation

This section is part of the legacy plugins documentation. The audit process
described here is still current.

:::

## Commands

Run a read-only audit from the repository root:

```shell
GITHUB_TOKEN="$(gh auth token)" yarn --cwd microsite plugins:audit:check
```

The command fetches current npm and GitHub data, prints one table row for every
manifest, and reports remote-data warnings without changing manifest files.

Run a write audit from the repository root:

```shell
GITHUB_TOKEN="$(gh auth token)" yarn --cwd microsite plugins:audit
```

The write audit performs the same inspection, prints status transitions and an
aggregated warning list, and serializes changed manifests. Do not hand-edit
generated fields. Review every warning and all generated changes before
submitting them.

The token is optional for public repositories. Supplying it avoids the lower
unauthenticated GitHub API rate limit. The audit sends it only in the
`Authorization` header of GitHub API requests.

## Field ownership

The audit owns these top-level manifest fields:

| Field        | Values                              | Behavior                                                                                                                    |
| ------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `status`     | `active`, `inactive`, or `archived` | A new contributor sets the initial value to `active`; audits maintain later values.                                         |
| `staleSince` | `YYYY-MM-DD`                        | Set when an `active` plugin becomes `inactive`, preserved when it becomes `archived`, and removed when it becomes `active`. |
| `snapshot`   | object                              | Generated npm and Backstage source data. New entries may omit this field.                                                   |

Contributors own `title`, `author`, `authorUrl`, `category`, `description`,
`documentation`, `iconUrl`, `npmPackageName`, `addedDate`, `order`,
`capabilities`, and `setup`. The audit preserves those fields.

## Status transitions

The audit calculates package age from the publication timestamp of the npm
version selected by the `latest` distribution tag.

| Current state            | Package age and metadata                      | Result                                          |
| ------------------------ | --------------------------------------------- | ----------------------------------------------- |
| `active`                 | More than 365 days                            | `inactive`; set `staleSince` to the audit date. |
| `inactive`               | More than 365 days; `staleSince` is not today | `archived`; preserve `staleSince`.              |
| `inactive`               | More than 365 days; `staleSince` is today     | No transition.                                  |
| `inactive` or `archived` | Less than 365 days                            | `active`; remove `staleSince`.                  |
| Any state                | Exactly 365 days                              | No transition.                                  |

Only a fresh npm snapshot can cause a status transition. A failed npm fetch
does not change the top-level plugin status.

An `inactive` plugin appears in the inactive section at the bottom of the
Plugin Directory. An `archived` plugin does not appear in the directory.

## Snapshot schema

The `snapshot` object contains independent `npm` and `backstage` objects. Each
source uses one of these status values:

| Status        | Meaning                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fresh`       | The current audit fetched and validated the source data.                                                                                                      |
| `stale`       | The current fetch failed. The snapshot retains values and `checkedAt` from the last successful fetch, records the current `lastAttemptAt`, and adds `reason`. |
| `unavailable` | No successful values are available. The snapshot contains `status`, `lastAttemptAt`, and `reason` only.                                                       |

All timestamps are ISO 8601 timestamps with an offset. All reason values are
stable lowercase kebab-case codes.

### npm snapshot

| Field                  | Fresh    | Stale    | Unavailable | Description                                                         |
| ---------------------- | -------- | -------- | ----------- | ------------------------------------------------------------------- |
| `status`               | Required | Required | Required    | Snapshot status.                                                    |
| `lastAttemptAt`        | Required | Required | Required    | Time of the current fetch attempt.                                  |
| `reason`               | No       | Required | Required    | Stable failure reason code.                                         |
| `checkedAt`            | Required | Required | No          | Time of the last successful fetch.                                  |
| `latestVersion`        | Required | Required | No          | Version selected by npm's `latest` distribution tag.                |
| `lastPublishedAt`      | Required | Required | No          | Publication time for `latestVersion`.                               |
| `repository.url`       | Optional | Optional | No          | Normalized GitHub repository URL from npm metadata, when supported. |
| `repository.directory` | Optional | Optional | No          | Package directory from npm metadata.                                |

### Backstage snapshot

| Field           | Fresh    | Stale    | Unavailable | Description                                                |
| --------------- | -------- | -------- | ----------- | ---------------------------------------------------------- |
| `status`        | Required | Required | Required    | Snapshot status.                                           |
| `lastAttemptAt` | Required | Required | Required    | Time of the current fetch attempt.                         |
| `reason`        | No       | Required | Required    | Stable failure reason code.                                |
| `checkedAt`     | Required | Required | No          | Time of the last successful fetch.                         |
| `version`       | Required | Required | No          | Backstage version read from `backstage.json`.              |
| `sourceUrl`     | Required | Required | No          | GitHub URL for the selected `backstage.json`.              |
| `sourcePath`    | Required | Required | No          | Repository-relative path of the selected `backstage.json`. |

For a package in a GitHub monorepo, the audit starts at
`repository.directory` and searches each ancestor for `backstage.json`. It
uses the closest match and then falls back to the repository root. Within one
audit, packages from the same repository reuse in-flight and completed
repository metadata and recursive tree requests.

## Warning reason codes

The audit prints warnings after processing all manifests. A warning records the
plugin, source, and reason code. Valid remote failures remain warnings and are
stored in the snapshot.

| Source    | Reason                         | Condition                                                                                            |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| npm       | `npm-not-found`                | The npm registry returns `404`.                                                                      |
| npm       | `npm-invalid-response`         | The registry request fails, the response is malformed, or required `latest` release data is missing. |
| npm       | `npm-request-failed`           | The npm source operation throws before returning a snapshot.                                         |
| Backstage | `npm-data-unavailable`         | No valid npm release data or previous Backstage snapshot is available.                               |
| Backstage | `repository-unsupported`       | npm metadata does not contain a supported GitHub repository location.                                |
| Backstage | `repository-directory-invalid` | The npm package directory is absolute or contains a parent traversal.                                |
| Backstage | `github-invalid-response`      | GitHub repository metadata, tree data, or file content cannot be fetched completely.                 |
| Backstage | `github-request-failed`        | The GitHub source operation throws before returning a snapshot.                                      |
| Backstage | `backstage-json-not-found`     | No applicable `backstage.json` exists.                                                               |
| Backstage | `backstage-json-invalid`       | The selected file is not valid JSON with a nonempty string `version`.                                |
