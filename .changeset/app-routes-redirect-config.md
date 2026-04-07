---
'@backstage/plugin-app': patch
---

Added support for configuring URL redirects on the `app/routes` extension. Redirects can be configured through `app-config` as an array of `{from, to}` path pairs, which will cause navigation to the `from` path to be redirected to the `to` path.

For example:

```yaml
app:
  extensions:
    - app/routes:
        config:
          redirects:
            - from: /old-path
              to: /new-path
```
