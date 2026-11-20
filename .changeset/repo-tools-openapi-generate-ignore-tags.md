---
'@backstage/repo-tools': patch
---

The `package schema openapi generate` command no longer produces duplicate imports, and code that then fails linting, when a model is referenced from operations with different tags. Operation tags are now ignored when generating code, so the generated output for specs that use tags may be reordered. Tags in the OpenAPI spec itself are left unchanged.
