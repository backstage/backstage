# @backstage/plugin-scaffolder-backend-module-gcp

The GCP bucket module for [@backstage/plugin-scaffolder-backend](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend).

When used as the `gcpBucket` task recovery workspace provider, the module saves
each workspace snapshot as a separate object under the task's prefix in the
configured bucket. This avoids the per-object write rate limit when template
steps finish in quick succession. Recovery restores the latest snapshot, including
snapshots saved by older versions of the provider.

Older snapshots are deleted after a successful save. If that cleanup fails, the
module logs a warning and keeps the saved workspace available for recovery.
Task cleanup removes all snapshots for the task. The backend's Google Cloud
credentials need permissions to list, create, read, and delete objects in the
bucket.
