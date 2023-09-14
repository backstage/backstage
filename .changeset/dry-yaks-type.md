---
'@backstage/backend-tasks': patch
---

When starting a task that existed before, with a faster schedule than it
previously had, the task will now correctly obey the faster schedule
immediately. Before this fix, the new schedule was only obeyed after the next
pending (according to the old schedule) run had completed.
