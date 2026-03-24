---
'@backstage/plugin-scaffolder-backend': patch
---

Added step-level approval gates to scaffolder templates. Steps with an `approval` block will pause execution and wait for an authorized user to approve before continuing. New API endpoints: `POST /v2/tasks/:taskId/approve`, `POST /v2/tasks/:taskId/reject`, `GET /v2/tasks/:taskId/approvals`. Configurable approval timeout via `scaffolder.approvalTimeoutMinutes`.
