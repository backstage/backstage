---
'@backstage/plugin-catalog-backend-module-openapi': patch
---

Add an `$openapi` placeholder resolver that supports more use cases for resolving `$ref` instances. This means that the quite recently added `OpenApiRefProcessor` has been deprecated in favor of the `openApiPlaceholderResolver`.

An example of how to use it can be seen below.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: example
  description: Example API
spec:
  type: openapi
  lifecycle: production
  owner: team
  definition:
    $openapi: ./spec/openapi.yaml # by using $openapi Backstage will now resolve all $ref instances
```
