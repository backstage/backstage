---
'@backstage/plugin-kubernetes': minor
---

refactor kubernetes error detection to make way for proposed solutions

**BREAKING**: `DetectedError` now appears once per Kubernetes resource per error instead of for all resources which have that error, `namespace` and `name` fields are now in `sourceRef` object `message` is now a `string` instead of a `string[]`. `ErrorDetectableKind` has been removed.
