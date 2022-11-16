---
'@backstage/plugin-techdocs-module-addons-contrib': patch
---

Refactored Report issue body in the tech-doc addons by getting the app title from `appconfig.yml` using `configApiRef`, In case `appTitle` not mentioned app Tile `new const` will default to `Backstage`
