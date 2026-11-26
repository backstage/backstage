---
'@backstage/core-components': patch
---

Deprecated `Lifecycle`, `TrendLine`, `GaugeCard`, `FeatureCalloutCircular`, `SimpleStepper`, `SimpleStepperStep`, and their associated types. Existing behavior is unchanged.

Use `Text` or `Badge` from `@backstage/ui` for lifecycle labels, a suitable charting library for trend visualizations, and compose a gauge with a card. Compose application-specific onboarding and workflows in place of the callout and stepper components.
