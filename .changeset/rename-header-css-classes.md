---
'@backstage/ui': minor
---

**BREAKING**: Renamed internal CSS classes to match the `Header` component name.

**Migration:**: If you are targeting these classes directly in your styles, update the following:

- `bui-HeaderPage` → `bui-Header`
- `bui-HeaderPageContent` → `bui-HeaderContent`
- `bui-HeaderPageBreadcrumbs` → `bui-HeaderBreadcrumbs`
- `bui-HeaderPageTabsWrapper` → `bui-HeaderTabsWrapper`
- `bui-HeaderPageControls` → `bui-HeaderControls`

**Affected components:**: Header
