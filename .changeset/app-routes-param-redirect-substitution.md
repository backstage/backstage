---
'@backstage/plugin-app': patch
---

The `app/routes` redirect config now supports path parameter substitution in the `to` target. Named params (`:userId`) and splat params (`*`) captured by the `from` path are replaced in the `to` string before navigating, making it possible to express redirects like:

```yaml
app:
  extensions:
    - app/routes:
        config:
          redirects:
            - from: /users/:userId
              to: /profile/:userId
            - from: /old-docs
              to: /docs/*
```
