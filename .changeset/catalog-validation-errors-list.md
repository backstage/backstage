---
'@backstage/plugin-catalog-backend': patch
---

Request body validation errors now include the individual validation errors in the response, with a JSON Pointer to each invalid value such as `/body/location`. The error message is unchanged.
