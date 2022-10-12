---
'@backstage/plugin-scaffolder-backend': minor
---

Added a set of default Prometheus metrics around scaffolding. See below for a list of metrics and an explanation of their labels:

- `scaffolder_task_count`: Tracks successful task runs.

  Labels:

  - `template`: The entity ref of the scaffolded template
  - `user`: The entity ref of the user that invoked the template run
  - `result`: A string describing whether the task ran successfully, failed, or was skipped

- `scaffolder_task_duration`: a histogram which tracks the duration of a task run

  Labels:

  - `template`: The entity ref of the scaffolded template
  - `result`: A boolean describing whether the task ran successfully

- `scaffolder_step_count`: a count that tracks each step run

  Labels:

  - `template`: The entity ref of the scaffolded template
  - `step`: The name of the step that was run
  - `result`: A string describing whether the task ran successfully, failed, or was skipped

- `scaffolder_step_duration`: a histogram which tracks the duration of each step run

  Labels:

  - `template`: The entity ref of the scaffolded template
  - `step`: The name of the step that was run
  - `result`: A string describing whether the task ran successfully, failed, or was skipped

You can find a guide for running Prometheus metrics here: https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/prometheus-metrics.md
