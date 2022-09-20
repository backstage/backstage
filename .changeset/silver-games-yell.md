---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-catalog-backend': patch
---

Added a set of default Prometheus metrics around scaffolding. See below for a list of metrics and an explanation of their labels:
 
 - `scaffolder_task_success_count`: Tracks successful task runs.

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `user`: The entity ref of the user that invoked the template run

 - scaffolder_task_error_count: a count that track how many task runs error out

    Labels:

    - `template`: The entity ref of the scaffolded template
    - `user`: The entity ref of the user that invoked the template run

 - scaffolder_task_duration: a histogram which tracks the duration of a task run
 
    Labels:

    - `template`: The entity ref of the scaffolded template
    - `result`: A boolean describing whether the task ran successfully

 - scaffolder_step_success_count: a count that tracks each step run

    Labels:

    - `name`: The name of the step that was run

 - scaffolder_step_error_count: a count that tracks how many steps error out

    Labels:

    - `name`: The name of the step that was run

 - scaffolder_step_duration: a histogram which tracks the duration of each step run


    Labels:

    - `name`: The name of the step that was run
    - `result`: A boolean describing whether the task ran successfully

You can find a guide for running Prometheus metrics here: https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/prometheus-metrics.md
