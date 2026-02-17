---
'@backstage/plugin-techdocs': minor
---

Add two config values to the `page:techdocs/reader` extension that configure default layout, `withoutSearch` and `withoutHeader`. Default are unchanged to `false`.

E.g. to disable the search and header on the Techdocs Reader Page:

```yaml
app:
  extensions:
    - page:techdocs/reader:
        config:
          withoutSearch: true
          withoutHeader: true
```
