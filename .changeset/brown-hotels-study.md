---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': patch
---

Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
