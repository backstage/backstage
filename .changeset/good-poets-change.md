---
'@backstage/plugin-search': minor
---

Forwarding classes to HomePageSearchBar instead of using className prop. For custom styles of the HomePageSearchBar, use classes prop instead:

```diff
<HomePageSearchBar
-  className={searchBar}
+  classes={{ root: classes.searchBar }}
  placeholder="Search"
/>
```
