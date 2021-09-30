---
'@backstage/plugin-techdocs': minor
---

Adds support for being able to customize and compose your TechDocs reader page in the App.

You can likely upgrade to this version without issue. If, however, you have
imported the `<Reader />` component in your custom code, the name of a property
has changed. You will need to make the following change anywhere you use it:

```diff
-<Reader entityId={value} />
+<Reader entityRef={value} />
```
