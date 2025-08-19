---
'@backstage/backend-test-utils': minor
---

Switched out `mockServices.scheduler` to use a mocked implementation instead of the default scheduler implementation. This implementation runs any scheduled tasks immediately on startup, as long as they don't have an initial delay or a manual trigger. After the initial run, the tasks are never run again unless manually triggered.
