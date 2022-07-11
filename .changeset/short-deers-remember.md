---
'@backstage/backend-common': patch
'@backstage/integration': patch
'@backstage/plugin-adr': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-module-addons-contrib': patch
'@backstage/plugin-techdocs-node': patch
---

Upgrade git-url-parse to 12.0.0.

Motivation for upgrade is transitively upgrading parse-url which is vulnerable
to several CVEs detected by Snyk.

- SNYK-JS-PARSEURL-2935944
- SNYK-JS-PARSEURL-2935947
- SNYK-JS-PARSEURL-2936249
