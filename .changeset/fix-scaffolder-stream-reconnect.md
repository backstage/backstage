---
'@backstage/plugin-scaffolder-react': patch
---

Fixed several issues with scaffolder task event stream reconnection: retry timers are now properly cancelled on cleanup, concurrent reconnect attempts are guarded against, and tab visibility changes reconnect the stream using the last seen event cursor without re-fetching the task.
