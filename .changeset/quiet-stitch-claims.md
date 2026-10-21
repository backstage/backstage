---
'@backstage/plugin-catalog-backend': patch
---

Improved the reliability of deferred stitching. Pending stitching work is no longer lost when entities are deleted and re-added, and updated instances prevent timed-out stitching attempts from overwriting or removing work taken over by another updated instance. During rolling upgrades from older versions, instances may still perform redundant stitching. On MySQL, protection against overlapping writes remains best-effort.
