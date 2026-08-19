---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
---

The `generate` command now automatically computes a sha256 content hash of the generated site output and stores it as the etag in `techdocs_metadata.json` when no `--etag` value is explicitly provided.

Added `--skip-if-unchanged` flag to `publish` that compares the local etag against the remote etag before uploading. When they match, the publish step is skipped entirely. This avoids redundant uploads in CI pipelines when docs haven't changed between builds.

**Breaking behavior change in `@backstage/plugin-techdocs-node`:** The `publish()` method on all cloud storage publishers now writes a `publish_timestamp` field into `techdocs_metadata.json` and uploads the metadata file twice per publish (once at the start without the marker, once at the end with it). This enables the CLI's `--skip-if-unchanged` flag to distinguish between a completed publish and one that was interrupted mid-upload.
