---
'@backstage/config-loader': patch
---

Added support for environment variable substitutions in string configuration values using a `${VAR}` placeholder. All environment variables much be available, or the entire expression will be evaluated to `undefined`. To escape a substitution, use `$${...}`, which will end up as `${...}`.

For example:

```yaml
app:
  baseUrl: https://${BASE_HOST}
```
