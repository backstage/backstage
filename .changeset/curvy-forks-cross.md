---
'@backstage/create-app': patch
---

Removed the `cookiecutter-golang` template from the default `create-app` install as we no longer provide `cookiecutter` action out of the box.

You can remove the template by removing the following lines from your `app-config.yaml` under `catalog.locations`:

```diff
-    - type: url
-      target: https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml
-      rules:
-        - allow: [Template]
```
