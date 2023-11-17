---
'@backstage/plugin-cloudbuild': minor
---

Changed build list view to automatically filter repositories based on component-info's metadata.name.
Added `google.com/cloudbuild-repo-name` annotation which allows you to specify a different repository to filter on.
Added `google.com/cloudbuild-trigger-name` annotation which allows you to filter based on a trigger name instead of a repo name.
Updated the ReadMe with information about the filtering and some other minor verbiage updates.
Changed `substitutions.BRANCH_NAME` to `substitutions.REF_NAME` so that the Ref field is populated properly.
