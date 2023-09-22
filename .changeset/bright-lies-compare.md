---
'@backstage/integration': patch
'@backstage/plugin-techdocs-node': patch
---

Fixed the method `resolveEditUrl` of `BitbucketServerIntegration` to return the entire url instead of cutting the query parameters.
`mkdocsPatcher` removes query params from the `edit_uri` in bitbucket server integration in order not to break the edit button in tech docs
