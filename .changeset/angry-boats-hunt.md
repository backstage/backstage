---
'@backstage/plugin-catalog-backend': patch
---

Add `AnnotateScmSlugEntityProcessor` that automatically adds the
`github.com/project-slug` annotation for components coming from GitHub.

The processor is optional and not automatically registered in the catalog
builder. To add it to your instance, add it to your `CatalogBuilder` using
`addProcessor()`:

```typescript
const builder = new CatalogBuilder(env);
builder.addProcessor(AnnotateScmSlugEntityProcessor.fromConfig(env.config));
```
