---
'@backstage/plugin-splunk-on-call': minor
---

Use the routing key if it's available instead of team name when triggering incidents.

BREAKING CHANGE:
Before, the team name was used even if the routing key (with or without team) was used.
Now, the routing key defined for the component will be used instead of the team name.
