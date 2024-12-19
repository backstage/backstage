---
'@backstage/plugin-scaffolder-node': minor
---

feat(scaffolder): add first class citizen support for zod

This change introduces a new way to define template actions using Zod schemas for type safety. The existing `createTemplateAction` function is now renamed to `oldCreateTemplateAction` to maintain backwards compatibility. A new `createTemplateAction` function is introduced which acts as an overload, supporting both the old style (using JSON Schema or string schemas) via `oldCreateTemplateAction` and the new style (using Zod schemas) via `newCreateTemplateAction`. This new function, `newCreateTemplateAction`, provides direct support for Zod, simplifying action definition and enhancing type checking.
