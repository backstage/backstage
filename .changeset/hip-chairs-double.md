---
'@backstage/plugin-tech-radar': minor
---

Deprecate `RadarEntry.url` - use `RadarEntry.links` instead

```diff
- url: 'https://www.javascript.com/',
+ url: '#',
  key: 'javascript',
  id: 'javascript',
  title: 'JavaScript',
  quadrant: 'languages',
  links: [
+    {
+      url: 'https://www.javascript.com/',
+      title: 'Learn more',
+    },
  ],
```
