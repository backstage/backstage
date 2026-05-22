---
'@backstage/plugin-catalog': minor
---

Added an opt-in v2 implementation of the catalog index page that uses the `@backstage/ui` table and supports columns contributed by frontend plugins and modules through `CatalogColumnBlueprint`. Enable it in your app config:

```yaml
app:
  extensions:
    - page:catalog:
        config:
          version: 'v2'
```

Default columns ship out of the box. Each column can be disabled, hidden, or filtered:

```yaml
app:
  extensions:
    # Disable a column entirely
    - catalog-column:catalog/tags: false
    # Hide a column but keep it contributing to search
    - catalog-column:catalog/description:
        config:
          hidden: true
    # Show a column only for specific entity kinds
    - catalog-column:catalog/lifecycle:
        config:
          filter:
            kind: Component
```

The legacy v1 page remains the default and is unchanged.
