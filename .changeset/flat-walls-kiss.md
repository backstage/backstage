---
'@backstage/create-app': patch
---

Updated the entity page routes to use relative routes rather than absolute ones. This change is required to be able to upgrade to `react-router` v6 stable in the future.

To apply this change to an existing app, update the path prop of `EntityLayout.Route`s to be relative. For example:

```diff
   <EntityLayoutWrapper>
-    <EntityLayout.Route path="/" title="Overview">
+    <EntityLayout.Route path="." title="Overview">
       {overviewContent}
     </EntityLayout.Route>

-    <EntityLayout.Route path="/ci-cd" title="CI/CD">
+    <EntityLayout.Route path="ci-cd" title="CI/CD">
       {cicdContent}
     </EntityLayout.Route>

-    <EntityLayout.Route path="/errors" title="Errors">
+    <EntityLayout.Route path="errors" title="Errors">
       {errorsContent}
     </EntityLayout.Route>
```

This change should also be applied to any other usage of `TabbedLayout`.
