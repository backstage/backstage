---
'@backstage/create-app': patch
---

Removed the `/` prefix in the catalog `SidebarItem` element, as it is no longer needed.

To apply this change to an existing app, remove the `/` prefix from the catalog and any other sidebar items in `packages/app/src/components/Root/Root.ts`:

```diff
-<SidebarItem icon={HomeIcon} to="/catalog" text="Home" />
+<SidebarItem icon={HomeIcon} to="catalog" text="Home" />
```
