---
'@backstage/plugin-search-react': minor
'@backstage/plugin-search': minor
---

The SearchPage component can now be configured via app-config.yaml with an initial state to define how it behaves when it is first loaded or reset. Check out the following example:

```yaml
app:
  search:
    initialState:
      pageLimit: 50
```
