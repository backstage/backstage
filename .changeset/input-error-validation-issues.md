---
'@backstage/errors': minor
---

`InputError` now accepts an optional list of validation issues through a new `issues` option. Each issue follows the Standard Schema issue format, with a human readable `message` and an optional `path` to the invalid value as a list of keys, such as `['body', 'location']`, which is left out when the issue refers to the whole input. Each issue also has an optional `code` from a fixed list that follows the issue codes of zod v4, such as `invalid_type` or `too_small`. The list is included when the error is serialized and restored by `deserializeError`, so clients can see which values were invalid without parsing the message. The new `validationIssuesFromZod` function converts a zod error into this list, mapping zod v3 codes to their v4 names.
