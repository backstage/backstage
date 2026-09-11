---
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-devtools': patch
'@backstage/plugin-org': patch
---

Screenshots in the README now load when it is rendered outside the repository, such as on the API reference site and on the npm package page. They were linked with repository-relative paths, which only resolve when browsing the repository on GitHub.
