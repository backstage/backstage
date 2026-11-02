---
'@backstage/cli-node': minor
---

**BREAKING**: `GitUtils.listChangedFiles` now only lists files inside the workspace root, with paths relative to it, and `GitUtils.readFileAtRef` reads paths relative to the workspace root. Both previously used paths relative to the root of the git repository, which made the `--since` option of `repo build`, `repo test`, and `repo lint` miss all changes when the workspace root is in a subdirectory of the repository. Nothing changes when the workspace root is the root of the repository.
