---
'@backstage/plugin-scaffolder-react': minor
---

The scaffolder wizard now shows or hides parameter steps based on their `when` condition, and values from hidden steps are left out of the submitted parameters. Newly visible steps must be visited and pass frontend validation before review, including steps hidden after an earlier validation or affected by a changed step definition or order.

Previously visited steps are checked automatically before review when their inputs or the form context change; failed checks return to the page that needs correction and keep review and creation blocked. Changes during asynchronous validation ask the user to check their changes and continue again.

Step labels are now buttons. Their accessible names include the visible title and step number. Tests that select wizard buttons by position may need to select them by accessible name instead.
