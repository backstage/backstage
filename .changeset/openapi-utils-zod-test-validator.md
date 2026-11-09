---
'@backstage/backend-openapi-utils': patch
---

The request and response validation used by `wrapServer` in `@backstage/backend-openapi-utils/testUtils` is now powered by `zod` instead of `ajv`. Recursive schemas in your OpenAPI spec are now supported. String `format` values such as `date-time`, `uuid`, and `email` are now validated, where they were previously not checked. Tests that send or return placeholder values for formatted fields, for example `"now"` for a `date-time` field, may now fail and need realistic values. The `uri-reference` format is not checked, so relative references such as `/foo` are accepted. Some validation error messages in failing tests have changed wording.
