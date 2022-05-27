---
'@backstage/plugin-pagerduty': minor
---

Introduces a new annotation `pagerduty.com/service-id` that can be used instead of the `pagerduty.com/integration-key` annotation.
_Note: If both annotations are specified on a given Entity, then the `pagerduty.com/integration-key` annotation will be prefered_

**BREAKING** The `PagerDutyClient.fromConfig` static method now expects a `FetchApi` compatible object as a third argument.
The `PagerDutyClient` now relies on a `fetchApi` being available to execute `fetch` requests.

In addition, various enhancements/bug fixes were introduced:

- The `PagerDutyCard` component now wraps error and loading messages with an `InfoCard` to contain errors/messages. This enforces a consistent experience on the EntityPage
- If no service can be found for the provided integration key, a new Error Message Empty State component will be shown instead of an error alert
- Introduces the `fetchApi` to replace standard `window.fetch`
  - ensures that Identity Authorization is respected and provided in API requests
