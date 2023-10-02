---
'@backstage/backend-tasks': patch
---

Instrument `backend-tasks` with some counters and histograms for duration.

`backend_task_runs_total`: Counter with the total number of times a task has been run.
`backend_task_run_duration`: Histogram with the run durations for each task.

Both these metrics have come with `result` `taskId` and `scope` labels for finer grained grouping andd
