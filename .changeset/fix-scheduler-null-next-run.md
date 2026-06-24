---
'@backstage/backend-defaults': patch
---

Fixed a bug in the scheduler where tasks transitioning from manual trigger to a cadence-based schedule would become permanently unscheduled. The SQL CASE expression in `persistTask()` did not handle NULL `next_run_start_at` values, causing the comparison `value < NULL` to evaluate to NULL in SQL three-valued logic and always take the ELSE branch, preserving the existing NULL forever.
