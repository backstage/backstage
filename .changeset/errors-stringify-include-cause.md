---
'@backstage/errors': minor
---

Added an `includeCause` option to `stringifyError`. When enabled, the returned string includes the chain of underlying error causes, each separated by `'; caused by: '`, which makes it easier to log the full context behind a failure. The default behavior is unchanged and only stringifies the outermost error.
