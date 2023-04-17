---
'@backstage/core-components': minor
---

**BREAKING:** Removing `Tabs` component from `core-components` as it is neither used in the core Backstage app nor in the monorepo plugins. If you are using this component in your instance please consider replacing it with the [Material UI `Tabs`](https://v4.mui.com/components/tabs/#tabs) component like the following:

```diff
- <Tabs
-    tabs={[{
-       icon: <AccessAlarmIcon />,
-       content: <div>Label</div>,
-    }]}
- />

+ <Tabs>
+    <Tab
+       label = "Label"
+       icon = { <AccessAlarmIcon /> }
+    />
+ </Tabs>
```
