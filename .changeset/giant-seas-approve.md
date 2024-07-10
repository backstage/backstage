---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

fix action github:environment:create - some octokit calls missing mandatory params in actions (lack of owner and repo in createEnvironmentVariable).
