---
'@backstage/plugin-catalog-backend-module-github': minor
---

Added the ability for the GitHub discovery provider to validate that catalog files exist before emitting them.

Users can now set the `validateLocationsExist` property to `true` in their GitHub discovery configuration to opt in to this feature.
This feature only works with `catalogPath`s that do not contain wildcards.

When `validateLocationsExist` is set to `true`, the GitHub discovery provider will retrieve the object from the
repository at the provided `catalogPath`.
If this file exists and is non-empty, then it will be emitted as a location for further processing.
If this file does not exist or is empty, then it will not be emitted.
Not emitting locations that do not exist allows for far fewer calls to the GitHub API to validate locations that do not exist.
