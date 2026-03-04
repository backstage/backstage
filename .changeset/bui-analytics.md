---
'@backstage/ui': patch
---

Added analytics capabilities to the component library. Components with navigation behavior (Link, ButtonLink, Tab, MenuItem, Tag, Row) now fire analytics events on click when an `AnalyticsProvider` is present.

New exports: `AnalyticsProvider`, `useAnalytics`, `getNodeText`, and associated types (`AnalyticsTracker`, `UseAnalyticsFn`, `AnalyticsProviderProps`, `AnalyticsEventAttributes`).

Components with analytics support now accept a `noTrack` prop to suppress event firing.

**Affected components:** Link, ButtonLink, Tab, MenuItem, Tag, Row
