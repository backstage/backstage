---
'@backstage/repo-tools': patch
---

The OpenAPI `generate` commands no longer run Prettier on generated code, so the output stays as emitted by the generator. Add `**/src/schema/openapi/generated/**` to your `.prettierignore` to keep your formatter from rewriting it.
