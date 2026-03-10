---
'@backstage/ui': patch
---

Added analytics capabilities to the component library. Components with navigation behavior (Link, ButtonLink, Tab, MenuItem, Tag, Row) now fire analytics events on click when a `BUIProvider` is present.

New exports: `BUIProvider`, `useAnalytics`, `getNodeText`, and associated types (`AnalyticsTracker`, `UseAnalyticsFn`, `BUIProviderProps`, `AnalyticsEventAttributes`).

Components with analytics support now accept a `noTrack` prop to suppress event firing.

**Affected components:** Link, ButtonLink, Tab, MenuItem, Tag, Row
