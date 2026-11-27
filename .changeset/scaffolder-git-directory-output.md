---
'@backstage/plugin-scaffolder-backend': patch
---

Scaffolder template, fetch and rename actions no longer place their output inside a `.git` directory of the task workspace, matched case-insensitively, so repository metadata there is always provided by the scaffolder's own git operations.
