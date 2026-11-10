---
'@backstage/errors': minor
---

`InputError` now accepts an optional list of validation issues through a new `issues` option. Each issue has a `path` to the invalid value as a JSON Pointer string, a human readable `message`, and an optional `code`. The list is included when the error is serialized and restored by `deserializeError`, so clients can see which values were invalid without parsing the message. The new `validationIssuesFromZod` function converts a zod error into this list.
