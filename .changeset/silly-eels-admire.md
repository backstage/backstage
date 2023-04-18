---
'@backstage/plugin-scaffolder-backend': minor
---

Added the possibility to authorize actions

It is now possible to decide who should be able to execute certain actions or who should be able to pass specific input to specified actions.

Some of the existing utility functions for creating conditional decisions have been renamed:

- `createScaffolderConditionalDecision` has been renamed to `createScaffolderActionConditionalDecision`
- `scaffolderConditions` has been renamed to `scaffolderTemplateConditions`
