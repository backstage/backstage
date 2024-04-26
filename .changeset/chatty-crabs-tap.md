---
'@backstage/repo-tools': minor
---

Adds a lint rule to `repo schema openapi lint` to enforce `allowReserved` for all parameters. To fix this, simply add `allowReserved: true` to your parameters, like so

```diff
/v1/todos:
    get:
      operationId: ListTodos
      # ...
      parameters:
        - name: entity
          in: query
+         allowReserved: true
          schema:
            type: string
```
