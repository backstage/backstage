---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `gitlab:group:access` action to use the correct `GroupMembers.add` call signature for `@gitbeaker/rest` v43, passing `userId` via the options object instead of as a positional argument.
