---
'@backstage/plugin-code-climate': patch
---

Send Authorization headers in fetch requests in Code Climate plugin to fix unauthorized requests to Backstage backends with authentication enabled as per https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md.
