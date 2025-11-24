---
'@backstage/backend-plugin-api': patch
'@backstage/backend-defaults': patch
---

Adds an alpha `MetricsService` to provide a unified interface for metrics instrumentation. It is designed to be used by plugins to create metrics instruments with well-defined namespaces and attributes, promoting consistency and reusability across the Backstage ecosystem.

Note, this is an alpha API and is subject to change. This release includes the service, but does not implement it anywhere in the framework. Early adopters should expect breaking changes and are encouraged to provide feedback and suggestions.
