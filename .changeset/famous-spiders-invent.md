---
'@backstage/plugin-api-docs-module-protoc-gen-doc': patch
---

Fix a transitive dependency to a wrong `gendocu-plugin-apis` dependency, in order to prefer the NpmJS `gendocu-public-apis` package instead of the `https`-based dependency which sometimes leads to `yarn install` errors when the `git.gendocu.com` site certificate expires.
