---
'@backstage/plugin-scaffolder-backend': patch
---

Modified `createDryRunner` and corresponding route to include `templateMetaData` inside the `templateInfo`. This allows custom action writers to access things like `templateInfo.entity.metadata.name` via the action context while executing templates using the dry run framework.
