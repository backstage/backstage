---
'@backstage/backend-openapi-utils': patch
---

Request validation failures from OpenAPI routers now include the individual validation issues on the `InputError`. Each issue's `path` is a JSON Pointer to the invalid value, such as `/body/name` or `/query/limit`, with property names escaped as needed, and each `code` is one of the standard validation issue codes, such as `invalid_type` or `unrecognized_keys`. Errors that are not schema failures, such as an unsupported media type, use `custom`. The error message is unchanged.

Validation errors reported by the OpenAPI test utilities now carry the same list of issues, for both requests and responses.
