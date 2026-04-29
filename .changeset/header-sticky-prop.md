---
'@backstage/ui': minor
---

Added a `sticky` prop to the `Header` component. When `true`, the title-and-actions bar stays fixed to the top of its scroll container while the rest of the header (tags, description, metadata) scrolls away. The sticky bar background color automatically matches the container surface using the bg-consumer system.

**BREAKING**: Removed the main header class from the `Header` component. Custom styles that target this class should be updated to target the component sections that remain.

**Affected components:** Header
