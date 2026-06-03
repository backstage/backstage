---
'@backstage/plugin-catalog-backend-module-openapi': patch
---

Fixed resolution of relative `$ref` paths in OpenAPI and AsyncAPI specs by using the original reference string and parent document URL from the ref parser, instead of computing paths relative to the process working directory. This fixes a regression where cross-directory refs like `./../../common/specs/common.yaml` and nested refs at depth > 1 would resolve incorrectly.
