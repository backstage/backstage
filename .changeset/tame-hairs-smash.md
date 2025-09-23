---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-bitbucket-cloud-common': patch
---

Allow for passing a `pagelen` parameter to configure the `pagelength` property of the `BitbucketCloudEntityProvider` `searchCode` pagination to resolve [bug](https://jira.atlassian.com/browse/BCLOUD-23644) pertaining to duplicate results being returned.
