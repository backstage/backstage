---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `publish:gitlab:merge-request` failing with `The branch creation failed because the branch already exists at: ...` when a scaffolder task is retried with experimental task recovery enabled. A retried task now reuses the branch and the merge request that its first attempt created, instead of failing at a step that had already done its job, and it no longer tries to create a branch that was deleted in between. The step keeps the outputs of the original run, so the following steps still see the original merge request. A task that is not being retried is unaffected, including the error you get for a branch that the task did not create itself.
