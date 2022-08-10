---
'@backstage/plugin-github-issues': patch
---

Moved communication with GitHub graphql API to the dedicated plugin API.
Fixes issue when no GitHub Issues are rendered when partial failure is returned from GitHub API.
