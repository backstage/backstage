---
'@backstage/plugin-techdocs': minor
---

Adjust the Tech Docs page theme as a side effect of the `mkdocs-material` theme update.

If you use the `spofify/techdocs` image to build your documentation, make sure you use version `spotify/techdocs:v0.3.7`.

**Breaking**: The `PyMdown` extensions have also been updated and some syntax may have changed, so it is recommended that you check the extension's documentation if something stops working.
For example, the syntax of tags below was deprecated in `PyMdown` extensions `v.7.0` and in `v.8.0.0` it has been removed. This means that the old syntax specified below no longer works.

````markdown
```markdown tab="tab"
This is some markdown
```

```markdown tab="tab 2"
This is some markdown in tab 2
```
````
