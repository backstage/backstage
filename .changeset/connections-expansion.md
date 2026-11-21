---
'@backstage/connections': patch
---

Added Argo CD, Datadog, Jenkins, Jira, PagerDuty, Snyk and SonarQube connection types with provider-specific authentication and configuration/consumption guides.

Connections use an explicit instance URL for lookup and preserve installation context paths when resolving relative API requests. Independent API destinations can be configured where needed, including PagerDuty regional endpoints and Jira scoped-token gateways.
