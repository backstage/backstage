---
'@backstage/plugin-scaffolder-node': minor
---

Adds an action context suspension API with manual and event triggers and a
`waiting` task status. Actions must checkpoint side effects before a suspension
because the handler is replayed when the task resumes. Custom action context
implementations must supply the new suspension method.
