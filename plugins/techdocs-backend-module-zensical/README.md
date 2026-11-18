# @backstage/plugin-techdocs-backend-module-zensical

A module for the TechDocs backend that adds [Zensical](https://zensical.org) as a documentation engine alongside MkDocs.

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@backstage/plugin-techdocs-backend-module-zensical'));
```

See [Zensical Engine](https://backstage.io/docs/features/techdocs/engines-zensical) for setup, configuration and how builds differ from MkDocs.
