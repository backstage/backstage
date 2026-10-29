---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed `scaffolder.task.count` (and the deprecated `scaffolder_task_count` Prometheus counter) incrementing once per **failing step** instead of once per **failed task run**. A task with multiple steps that continue running after a failure (via `if: ${{ always() }}` or `if: ${{ failure() }}`) previously recorded one `result: 'failed'` count for every failing step in that single run, inflating the metric relative to `result: 'ok'`, which is recorded exactly once per successful task. The task-level failure is now recorded once, after the workflow loop finishes, using the first error encountered — matching the existing log message semantics ("First error from step ..."). `scaffolder.step.count` is unaffected and still records one outcome per step.
