---
'@backstage/plugin-catalog-backend': patch
---

Request body validation errors now include the individual validation issues in the response, with the path to each invalid value as a list of keys, following the Standard Schema issue format, such as `['body', 'location']`, and a standard `code`. The error message is unchanged.
