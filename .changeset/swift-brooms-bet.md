---
'@backstage/plugin-scaffolder-backend': patch
---

Enable usage of secrets within 'each' step of software templates. For example, you can now structure your `each` step like this:

```
each:
  [
    { name: "Service1", token: "${{ secrets.token1 }}" },
    { name: "Service2", token: "${{ secrets.token2 }}" },
  ]
```
