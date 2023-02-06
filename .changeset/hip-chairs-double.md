---
'@backstage/plugin-tech-radar': patch
---

Deprecate `RadarEntry.url` - use `RadarEntry.links` instead

```diff
- url: 'https://www.javascript.com/',
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
