---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed a memory leak in the task event stream endpoint. If a client disconnected before the stream was opened, the backend kept polling the task events and writing them to the closed connection. For tasks that use `EXPERIMENTAL_recovery`, this continued for the lifetime of the process and memory grew until the backend ran out of memory.
