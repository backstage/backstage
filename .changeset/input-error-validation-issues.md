---
'@backstage/errors': minor
---

`InputError` now accepts an optional list of validation issues through a new `issues` option. Each issue has a JSON Pointer `pointer` to the invalid value, a human readable `detail`, and an optional `code`. The list is included when the error is serialized, so clients can see which values were invalid without parsing the message. The new `validationIssuesFromZod` function converts a zod error into this list.
