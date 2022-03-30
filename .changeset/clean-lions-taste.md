---
'@backstage/create-app': patch
---

Made `User` and `Group` entity kinds not permitted by the default
`catalog.rules` config.

The effect of this is that after creating a new Backstage repository, its
catalog no longer permits regular users to register `User` or `Group` entities
using the Backstage interface. Additionally, if you have config locations that
result in `User` or `Group` entities, you need to add those kinds to its own
specific rules:

```yaml
catalog:
  locations:
    # This applies for example to url type locations
    - type: url
      target: https://example.com/org.yaml
      rules:
        - allow: [User, Group]
    # But also note that this applies to ALL org location types!
    - type: github-org
      target: https://github.com/my-org-name
      rules:
        - allow: [User, Group]
```

This rule change does NOT affect entity providers, only things that are emitted
by entity processors.

We recommend that this change is applied to your own Backstage repository, since
it makes it impossible for regular end users to affect your org data through
e.g. YAML files. To do so, remove the two kinds from the default rules in your config:

```diff
 catalog:
   rules:
-    - allow: [Component, System, API, Group, User, Resource, Location]
+    - allow: [Component, System, API, Resource, Location]
```

And for any location that in any way results in org data being ingested, add the corresponding rule to it:

```diff
 catalog:
   locations:
     - type: github-org
       target: https://github.com/my-org-name
+      rules:
+        - allow: [User, Group]
```
