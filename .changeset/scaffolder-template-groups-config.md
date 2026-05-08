---
'@backstage/plugin-scaffolder': minor
---

The `sub-page:scaffolder/templates` extension now accepts a `groups` config
field that lets you define template groups on the template list page. Each group
has a `title` and a `filter` predicate. Templates not matched by any
configured group fall into an automatically appended "Other Templates" group.
With no groups configured, the page renders a single "Templates" group as
before.

Example:

```yaml
app:
  extensions:
    - sub-page:scaffolder/templates:
        config:
          groups:
            - title: Recommended Services
              filter:
                spec.type: service
            - title: Documentation
              filter:
                spec.type: documentation
```
