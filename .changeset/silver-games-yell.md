---
'@backstage/plugin-scaffolder-backend': patch
---

Added a set of default Prometheus metrics around scaffolding. See below for a list of metrics and an explanation of their labels:
scaffolder_task_success_count: a count that tracks task runs (an full scaffolder run)

- template

- invoker

scaffolder_task_error_count: a count that track how many task runs error out

- template

- invoker

scaffolder_task_duration: a histogram which tracks the duration of a task run

- template

- result

scaffolder_step_success_count: a count that tracks each step run

- name

scaffolder_step_error_count: a count that tracks how many steps error out

- name

scaffolder_step_duration: a histogram which tracks the duration of each step run

- name

- result

label explanations:

template: the name of the template which was scaffolded

invoker: the user which kicked the scaffolding off

name: the name of the step that was run

result: whether the task was OK or failed with an error

You can find a guide for running Prometheus metrics here: https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/prometheus-metrics.md 

---
'@backstage/plugin-catalog-backend': patch
---
Exported Metrics initializers in order to use prometheus metrics in other packages. 