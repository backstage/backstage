---
'@backstage/create-app': patch
'@backstage/plugin-scaffolder-backend': patch
---

Moved sample software templates to the [backstage/software-templates](https://github.com/backstage/software-templates) repository. If you previously referenced the sample templates straight from `scaffolder-backend` plugin in the main [backstage/backstage](https://github.com/backstage/backstage) repository in your `app-config.yaml`, these references will need to be updated.

See https://github.com/backstage/software-templates
