---
'@backstage/plugin-splunk-on-call': minor
---

Updates the Splunk On-Call plugin for the [composability system
migration](https://backstage.io/docs/plugins/composability#porting-existing-plugins).

To upgrade, modify your `EntityPage` to use the updated export names. The
`EntitySplunkOnCallCard` should be wrapped in an `<EntitySwitch>` condition as
shown in the plugin README, which you may already have in place.

```diff
import {
- isPluginApplicableToEntity as isSplunkOnCallAvailable,
+  isSplunkOnCallAvailable,
- SplunkOnCallCard
+  EntitySplunkOnCallCard,
} from '@backstage/plugin-splunk-on-call';

...
-  <SplunkOnCallCard entity={entity}>
+  <EntitySplunkOnCallCard />
```
