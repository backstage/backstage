---
'@backstage/plugin-catalog-backend-module-gitlab': patch
'@backstage/backend-defaults': patch
---

Fixed GitLab catalog discovery for branches containing slashes by escaping the branch name in generated catalog-file locations. The GitLab URL reader now supports tree reads and wildcard searches with encoded slash-containing branches, including TechDocs directory reads from those locations.
