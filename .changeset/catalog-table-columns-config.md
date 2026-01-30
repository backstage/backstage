---
'@backstage/plugin-catalog': minor
---

Added support for customizing catalog table columns via `app-config.yaml` in the New Frontend System.

This feature allows platform engineers to configure which columns are displayed in the catalog table without code changes. The configuration supports:

- **Include mode**: Show only specific columns by listing them
- **Exclude mode**: Hide specific columns from the defaults
- **Custom columns**: Add columns from entity metadata (annotations, labels, spec fields)

Example configuration:

```yaml
app:
  extensions:
    - page:catalog:
        config:
          columns:
            exclude:
              - namespace
              - tags
            custom:
              - title: "Security Tier"
                field: "metadata.annotations['security/tier']"
                width: 120
                defaultValue: "Not Set"
              - title: "Cost Center"
                field: "metadata.labels['cost-center']"
                kind:
                  - Component
                  - Resource
```

Available built-in column IDs: `name`, `owner`, `type`, `lifecycle`, `description`, `tags`, `namespace`, `system`, `targets`.

Custom columns support:
- Dot notation for field paths (e.g., `spec.type`)
- Bracket notation for annotations/labels (e.g., `metadata.annotations['key']`)
- Optional width, sortable, defaultValue, and kind filtering
