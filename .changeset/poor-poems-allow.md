---
'@backstage/plugin-cloudbuild': patch
---

Fixed bug in the CloudbuildClient reRunWorkflow fetch call. The method in the fetch request was not specified and defaulted to a GET. Method is now explicitly set to POST with this change.
