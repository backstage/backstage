---
'@backstage/plugin-catalog-backend': minor
---

Implemented handling of events from the newly introduced alpha
`catalogScmEventsServiceRef` service, in the builtin entity providers. This
allows entities to get refreshed, and locations updated or removed, as a
response to incoming events. In its first iteration, only the GitHub module
implements such event handling however.

This is not yet enabled by default, but this fact may change in a future
release. To try it out, ensure that you have the latest catalog GitHub module
installed, and set the following in your app-config:

```yaml
catalog:
  scmEvents: true
```

Or if you want to pick and choose from the various features:

```yaml
catalog:
  scmEvents:
    # refresh (reprocess) upon events?
    refresh: true
    # automatically unregister locations based on events? (files deleted, repos archived, etc)
    unregister: true
    # automatically move locations based on events? (repo transferred, file renamed, etc)
    move: true
```
