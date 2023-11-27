---
'@backstage/plugin-cloudbuild': minor
---

Changed build list view to automatically filter builds based on repository name matching component-info's metadata.name.
Added optional `google.com/cloudbuild-repo-name` annotation which allows you to specify a different repository to filter on.
Added optional `google.com/cloudbuild-trigger-name` annotation which allows you to filter based on a trigger name instead of a repo name.
Updated the ReadMe with information about the filtering and some other minor verbiage updates.
Changed `substitutions.BRANCH_NAME` to `substitutions.REF_NAME` so that the Ref field is populated properly.
Added optional `google.com/cloudbuild-location` annotation which allows you to specify the Cloud Build location of your builds. Default is global scope.
Changed build list view to show builds in a specific location if the location annotation is used.
Updated ReadMe with information about the use of the location filtering.
