---
'@backstage/cli': patch
---

Updated the plugin template to install version 14 of `@testing-library/user-event`.

To apply this change to your own project, update the `devDependencies` section in your `package.json` files:

```diff
 "devDependencies": {
   ... omitted dev dependencies ...
-   "@testing-library/user-event": "^13.1.8",
+   "@testing-library/user-event": "^14.0.0",
    ... omitted dev dependencies ...
 }
```
