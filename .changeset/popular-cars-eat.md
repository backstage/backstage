---
'@backstage/plugin-jenkins': patch
---

Migrate to new composability API, exporting the plugin instance as `jenkinsPlugin`, the entity content as `EntityJenkinsContent`, the entity conditional as `isJenkinsAvailable`, and the entity card as `EntityLatestJenkinsRunCard`.
