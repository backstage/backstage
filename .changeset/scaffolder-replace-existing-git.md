---
'@backstage/plugin-scaffolder-node': patch
---

The `fetchContents` helper used behind `fetch:plain` and `fetch:template` now rejects fetched trees that contain a `.git` directory, matched case-insensitively. The repository initialization used by scaffolder publish actions now replaces any pre-existing `.git` directory in the source path instead of reusing it.
