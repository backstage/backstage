---
'@backstage/plugin-devtools': patch
---

Fixed an issue in `ScheduledTasksContent` where actual backend error messages (such as network or authorization errors) were discarded in favor of a hardcoded "No scheduled tasks found" message, and ensured the loading indicator is displayed while switching plugins.
