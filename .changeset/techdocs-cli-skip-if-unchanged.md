---
'@techdocs/cli': minor
---

The `generate` command now automatically computes a sha256 content hash of the generated site output and stores it as the etag in `techdocs_metadata.json` when no `--etag` value is explicitly provided.

Added `--skip-if-unchanged` flag to `publish` that compares the local etag against the remote etag before uploading. When they match, the publish step is skipped entirely. This avoids redundant uploads in CI pipelines when docs haven't changed between builds.
