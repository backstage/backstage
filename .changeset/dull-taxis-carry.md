---
'@backstage/plugin-adr': minor
---

The ADR plugin can now work with sites other than GitHub. Expanded the ADR backend plugin to provide endpoints to facilitate this.

**BREAKING** The ADR plugin now requires the `@backstage/plugin-adr-backend` plugin to be installed by using the `createRouter` method to add into your `backend`. You read more in the [install instructions](https://github.com/backstage/backstage/blob/master/src/plugins/adr-backend/README.md#install)
