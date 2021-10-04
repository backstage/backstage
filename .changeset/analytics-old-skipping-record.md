---
'@backstage/core-plugin-api': patch
---

Introducing the Analytics API: a lightweight way for plugins to instrument key
events that could help inform a Backstage Integrator how their instance of
Backstage is being used. The API consists of the following:

- `useAnalytics()`, a hook to be used inside plugin components which retrieves
  an Analytics Tracker.
- `tracker.captureEvent()`, a method on the tracker used to instrument key
  events. The method expects an action (the event name) and a subject (a unique
  identifier of the object the action is being taken on).
- `<AnalyticsContext />`, a way to declaratively attach additional information
  to any/all events captured in the underlying React tree. There is also a
  `withAnalyticsContext()` HOC utility.
- The `tracker.captureEvent()` method also accepts an `attributes` option for
  providing additional run-time information about an event, as well as a
  `value` option for capturing a numeric/metric value.

By default, captured events are not sent anywhere. In order to collect and
redirect events to an analytics system, the `analyticsApi` will need to be
implemented and instantiated by an App Integrator.
