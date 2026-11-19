---
'@backstage/plugin-catalog-backend-module-gitlab-org': patch
---

Added `setGroupNameTransformer` to `gitlabOrgEntityProviderTransformsExtensionPoint`, so the names of the ingested Group entities can be customized without replacing the module. The transformer is used for the Group names, their parents and the `memberOf` of the Users.
