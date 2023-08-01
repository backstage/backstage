---
'@backstage/plugin-todo-backend': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-search-backend': minor
---

Now performs request validation based on OpenAPI schema through `@backstage/backend-openapi-utils`. Error responses for invalid input, like `"a"` instead of a number, may have changed.
