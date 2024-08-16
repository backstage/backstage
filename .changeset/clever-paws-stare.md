---
'@backstage/cli-node': patch
'@backstage/cli': patch
---

Added a new step to the `backstage-cli repo fix --publish` command that will annotate default export features to the 'backstage' metadata within plugin package.json. This is to help with identifying the declarative integration points for plugins without needing to fetch or run the plugins first.
