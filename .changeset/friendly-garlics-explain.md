---
'@backstage/plugin-catalog-react': minor
---

Add a new `defaultGroup` parameter to the `EntityContentBlueprint`, here are usage examples:

Set a default group while creating the extension:

```diff
const entityKubernetesContent = EntityContentBlueprint.make({
  name: 'kubernetes',
  params: {
    defaultPath: '/kubernetes',
    defaultTitle: 'Kubernetes',
+   defaultGroup: 'deployment',
    filter: 'kind:component,resource',
    loader: () =>
      import('./KubernetesContentPage').then(m =>
        compatWrapper(<m.KubernetesContentPage />),
      ),
  },
});
```

Disassociate an entity content from a default group:

```diff
# app-config.yaml
app:
  extensions:
    # Entity page content
-   - entity-content:kubernetes/kubernetes
+   - entity-content:kubernetes/kubernetes:
+       config:
+         group: false
```

Associate an entity content with a different default or custom group than the one defined in code when the extension was created:

```diff
# app-config.yaml
app:
  extensions:
    # Entity page content
-   - entity-content:kubernetes/kubernetes
+   - entity-content:kubernetes/kubernetes:
+       config:
+         group: custom # associating this extension with a custom group id, the group should have previously been created via entity page configuration

```
