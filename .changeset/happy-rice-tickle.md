---
'@backstage/backend-common': patch
---

Add support for distributed mutexes and scheduled tasks, through the `TaskManager` class. This class can be particularly useful for coordinating things across many deployed instances of a given backend plugin. An example of this is catalog entity providers - with this facility you can register tasks similar to a cron job, and make sure that only one host at a time tries to execute the job, and that the timing (call frequency, timeouts etc) are retained as a global concern, letting you scale your workload safely without affecting the task behavior.
