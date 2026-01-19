---
'@backstage/ui': minor
---

**BREAKING (CSS)**: Changed CSS selectors for `ButtonIcon` and `ButtonLink` components. Custom styles targeting `.bui-Button` to style these components must be updated to use `.bui-ButtonIcon` or `.bui-ButtonLink` respectively.

```diff
-/* This no longer styles ButtonIcon or ButtonLink */
-.bui-Button[data-variant="primary"] { ... }
+/* Use component-specific selectors */
+.bui-ButtonIcon[data-variant="primary"] { ... }
+.bui-ButtonLink[data-variant="primary"] { ... }
```

Affected components: ButtonIcon, ButtonLink
