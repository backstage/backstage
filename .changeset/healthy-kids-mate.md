---
'@backstage/create-app': patch
---

Create backstage.json file

`@backstage/create-app` will create a new `backstage.json` file. At this point, the file will contain a `version` property, representing the version of `@backstage/create-app` used for creating the application. If the backstage's application has been bootstrapped using an older version of `@backstage/create-app`, the `backstage.json` file can be created and kept in sync, together with all the changes of the latest version of backstage, by running the following script:

```bash
yarn backstage-cli versions:bump
```
