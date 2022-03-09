---
'@backstage/plugin-airbrake': patch
---

Fix a bug where API calls were being made and errors were being added to the snack bar when no project ID was present. This is a common use case for components that haven't added the Airbrake plugin annotation to their `catalog-info.yaml`.
