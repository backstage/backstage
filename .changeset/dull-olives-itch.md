---
'@backstage/plugin-scaffolder-node': minor
---

This change introduces a new way to define template actions using Zod schemas for type safety. The existing `createTemplateAction` function is now renamed to `createTemplateActionV1` to maintain backwards compatibility. A new `createTemplateAction` function is introduced which acts as an overload, supporting both the old style (using JSON Schema or string schemas) via `createTemplateActionV1` and the new style (using Zod schemas) via `createTemplateActionV2`. This new function, `createTemplateActionV2`, provides direct support for Zod, simplifying action definition and enhancing type checking.
