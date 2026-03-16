---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Added optional `returnWorkflowRunDetails` input to `github:actions:dispatch` action. When true, exposes `workflowRunId`, `workflowRunUrl`, and `workflowRunHtmlUrl` as outputs using the GitHub API `return_run_details` parameter.
