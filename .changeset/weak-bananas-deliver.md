---
'@backstage/plugin-pagerduty': minor
---

Introduces a new annotation `pagerduty.com/service-id` that can be used instead of the `pagerduty.com/integration-key` annotation.
_Note: If both annotations are specified on a given Entity, then the `pagerduty.com/integration-key` annotation will be prefered_

**BREAKING** The `PagerDutyClient.fromConfig` static method now expects a `FetchApi` compatible object and has been refactored to
accept 2 arguments: config and ClientApiDependencies
The `PagerDutyClient` now relies on a `fetchApi` being available to execute `fetch` requests.

**BREAKING** A new query method `getServiceByEntity` that is used to query for Services by either the `integrationKey` or `serviceId`
annotation values if they are defined. The `integrationKey` value is preferred currently over `serviceId`. As such, the previous
`getServiceByIntegrationKey` method has been removed.

**BREAKING** The return values for each Client query method has been changed to return an object instead of raw values.
For example, the `getIncidentsByServiceId` query method now returns an object in the shape of `{ incidents: Incident[] }`
instead of just `Incident[]`.
This same pattern goes for `getChangeEventsByServiceId` and `getOnCallByPolicyId` functions.

**BREAKING** All public exported types that relate to entities within PagerDuty have been prefixed with `PagerDuty` (e.g. `ServicesResponse` is now `PagerDutyServicesResponse` and `User` is now `PagerDutyUser`)

In addition, various enhancements/bug fixes were introduced:

- The `PagerDutyCard` component now wraps error and loading messages with an `InfoCard` to contain errors/messages. This enforces a consistent experience on the EntityPage
- If no service can be found for the provided integration key, a new Error Message Empty State component will be shown instead of an error alert
- Introduces the `fetchApi` to replace standard `window.fetch`
  - ensures that Identity Authorization is respected and provided in API requests
