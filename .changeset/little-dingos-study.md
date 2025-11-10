---
'@backstage/ui': minor
---

**BREAKING**: Removed central `componentDefinitions` object and related type utilities (`ComponentDefinitionName`, `ComponentClassNames`).

Component definitions are primarily intended for documenting the CSS class API for theming purposes, not for programmatic use in JavaScript/TypeScript.

**Migration Guide:**

If you were using component definitions or class names to build custom components, we recommend migrating to either:

- Use Backstage UI components directly as building blocks, or
- Duplicate the component CSS in your own stylesheets instead of relying on internal class names
