---
'@backstage/errors': minor
---

`InputError` now accepts an optional list of validation errors through a new `errors` option. Each item has a JSON Pointer `pointer` to the invalid value, a human readable `detail`, and an optional `code`, following the naming used by RFC 9457 and JSON:API. The list is included when the error is serialized, so clients can see which values were invalid without parsing the message. The new `validationErrorItemsFromZod` function converts a zod error into this list.
