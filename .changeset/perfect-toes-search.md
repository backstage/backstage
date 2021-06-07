---
'@backstage/create-app': patch
'@backstage/plugin-scaffolder-backend': patch
---

Migrating old `backstage.io/v1alpha1` templates to `backstage.io/v1beta2`

Deprecating the `create-react-app` Template. We're planning on removing the `create-react-app` templater, as it's been a little tricky to support and takes 15mins to run in a container. We've currently cached a copy of the output for `create-react-app` and ship that under our sample templates folder. If you want to continue using it, we suggest copying the template out of there and putting it in your own repository as it will be removed in upcoming releases.

We also recommend removing this entry from your `app-config.yaml` if it exists:

```diff
-    - type: url
-      target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/create-react-app/template.yaml
-      rules:
-        - allow: [Template]
```
