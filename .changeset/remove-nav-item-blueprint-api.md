---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the deprecated `NavItemBlueprint`. Navigation items are now discovered from `PageBlueprint` extensions based on their `title` and `icon` params.

If you were still using `NavItemBlueprint`, migrate by moving `title` and `icon` to your `PageBlueprint` instead:

```diff
-const navItem = NavItemBlueprint.make({
-  params: { title: 'Example', icon: ExampleIcon, routeRef },
-});
 const page = PageBlueprint.make({
   params: {
+    title: 'Example',
+    icon: <ExampleIcon fontSize="inherit" />,
     routeRef,
     path: '/example',
     loader: () => import('./Page').then(m => <m.Page />),
   },
 });
```

`PageBlueprint` expects an `IconElement` rather than a Material UI `IconComponent`, so this is also a good time to switch to [Remix Icon](https://remixicon.com/) if you were using Material UI icons only for the nav item:

```diff
-import ExampleIcon from '@material-ui/icons/Extension';
+import { RiPuzzleLine } from '@remixicon/react';
 ...
-    icon: ExampleIcon,
+    icon: <RiPuzzleLine />,
```
