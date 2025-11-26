---
'@techdocs/cli': patch
'@backstage/repo-tools': patch
'@backstage/cli-node': patch
'@backstage/codemods': patch
'@backstage/cli': patch
---

Switched out use of spawn with `shell: true` for using `cross-spawn`.
