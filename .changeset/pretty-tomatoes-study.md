---
'@backstage/plugin-circleci': minor
---

Using CircleCI API v2 for displaying pipelines and workflows, and v1.1 for the build details.

**BREAKING**: API version has to be removed from the target url in the proxy configuration allowing the plugin to communicate with both APIs.

This change is **required** to `app-config.yaml` if you use the CircleCI plugin:

```diff
  proxy:
    endpoints:
      '/circleci/api':
-       target: https://circleci.com/api/v1.1
+       target: https://circleci.com/api
```
