---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING**: Updated `TemplateAction` and related types to have its type parameter extend `JsonObject` instead of `InputBase`. The `createTemplateAction` has also been updated to pass through the `TInput` type parameter to the return type, meaning the `TemplateAction` retains its type. This can lead to breakages during type checking especially within tests.
