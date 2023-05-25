---
'@backstage/plugin-catalog-backend': minor
---

Introduce a new optional config parameter `catalog.stitchingStrategy.mode`,
which can have the values `'immediate'` (default) and `'deferred'`. The default
is for stitching to work as it did before this change, which means that it
happens "in-band" (blocking) immediately when each processing task finishes.
When set to `'deferred'`, stitching is instead deferred to happen on a separate
asynchronous worker queue just like processing.

Deferred stitching should make performance smoother when ingesting large amounts
of entities, and reduce p99 processing times and repeated over-stitching of
hot spot entities when fan-out/fan-in in terms of relations is very large. It
does however also come with some performance cost due to the queuing with how
much wall-clock time some types of task take.
