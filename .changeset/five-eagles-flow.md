---
'@backstage/create-app': patch
---

Adds plugin-org and more capability to the default EntityPage to display Users, Groups and Systems.

To update an existing application, add the org plugin:

```shell
cd packages/app
yarn add @backstage/plugin-org
```

Then add the example systems locations to your `app-config.yaml`:

```diff
catalog:
  rules:
-    - allow: [Component, API, Group, User, Template, Location]
+    - allow: [Component, System, API, Group, User, Template, Location]
  locations:
    # Backstage example components
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-components.yaml

+    # Backstage example systems
+    - type: url
+      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-systems.yaml
+
    # Backstage example APIs
```

Additionally, the default app sidebar was updated to parity with the Backstage
repo. You can see these changes in the template
[App.tsx](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/packages/app/src/App.tsx)
referencing a new `Root` component.

Finally, compare your `packages/app/src/components/catalog/EntityPage.tsx` to
[EntityPage](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx)
from the `@backstage/create-app` default template to pick up additional
changes there.
