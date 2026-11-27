---
'@backstage/plugin-scaffolder-react': minor
---

Newly visible Scaffolder steps must be visited and pass frontend validation before review. Changing a step definition or its order also requires a new visit.

Previously visited steps are checked automatically before review when their inputs or the form context change; failed checks return to the page that needs correction and keep review and creation blocked. Changes during asynchronous validation ask the user to check their changes and continue again.

Step labels are now buttons. Their accessible names include the visible title and step number. Tests that select wizard buttons by position may need to select them by accessible name instead.
