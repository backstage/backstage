---
'@backstage/plugin-techdocs': minor
---

Add two config values to the `page:techdocs/reader` extension that configure default layout, `withSearch` and `withHeader`. Default are unchanged to `true`.

E.g. to disable the search and header on the Techdocs Reader Page:

```yaml
app:
  extensions:
    - page:techdocs/reader:
        config:
          withSearch: false
          withHeader: false
```
