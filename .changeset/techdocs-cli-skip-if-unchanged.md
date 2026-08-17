---
'@techdocs/cli': minor
---

Added `--etag sha256` support to `techdocs-cli generate` that auto-computes a content hash of the source directory, removing the need for callers to compute and pass an etag value.

Added `--skip-if-unchanged` flag to `techdocs-cli publish` that compares local and remote etags before uploading. When the etag in the local `techdocs_metadata.json` matches the remote, the publish step is skipped entirely. This avoids redundant uploads in CI pipelines when docs haven't changed between builds.
