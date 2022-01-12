---
'@backstage/integration': minor
'@backstage/plugin-catalog-backend': minor
---

The Bitbucket config now accepts a `baseUrl` property for organization servers. When provided, processors will now be able to make use of the config for url evaluations. If the config is not specified, it will be automatically inferred from the `host` config property. With this change, the config reader will also enforce the formatting of the `baseUrl` and `apiBaseUrl` properties to ensure that they are proper URL's.

For it's initial usage, the `baseUrl` config property is being used by the Bitbucket Discovery Processor to evaluate project and repo terms from a target repository url. When the `baseUrl` is not specified, this logic will fallback to using the previous pattern of indexing the `/project/` term from the target url.
