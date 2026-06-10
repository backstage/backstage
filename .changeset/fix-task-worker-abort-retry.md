---
'@backstage/backend-defaults': patch
---

Fixed the task worker retry loop to respect the abort signal. Previously, when a task worker encountered an unexpected error, the retry loop would continue indefinitely even after the worker was signaled to stop. The retry loop now checks the abort signal before retrying and passes it to the retry delay, allowing the worker to shut down gracefully.
