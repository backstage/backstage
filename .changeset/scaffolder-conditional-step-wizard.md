---
'@backstage/plugin-scaffolder-react': minor
---

The scaffolder wizard now shows or hides parameter steps based on their `when` condition, and values from hidden steps are left out of the submitted parameters. Navigation stays on the current step when visibility changes.

Newly visible steps must be visited and pass frontend validation before review, including steps hidden after an earlier validation. Changing a step definition or its order also requires a new visit.

Previously visited steps are checked automatically before review when their inputs, effective constraints, or custom validation context change. Successful checks continue to the next pending step or review without another visit. Failed checks clear earlier successful validation and return to the page that needs correction. Full JSON Schema constraints are checked again when the form context changes, even when the values declared by that page stay the same.

Users can reach previously visited visible steps using the mouse or keyboard to correct values on another page.

Changes during asynchronous validation preserve the latest input and ask the user to continue again. Field synchronization without an effective change does not interrupt validation. Review and creation remain blocked until the necessary checks pass.

Step labels are now buttons. Tests that select wizard buttons by position may need to select them by accessible name instead.
