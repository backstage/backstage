---
'@backstage/plugin-catalog-backend': patch
---

GithubDiscoveryProcessor outputs locations as optional to avoid outputting errors for missing locations (see https://github.com/backstage/backstage/issues/4730).
