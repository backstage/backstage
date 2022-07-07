---
'@backstage/plugin-newrelic-dashboard': minor
---

Fix bug where the default time window/snapshot duration was supposed to be 30 days, but ended up being 43 weeks

**BREAKING**: Add a select input to change the time window of the snapshot displayed. This removes the duration prop from the `DashboardSnapshot` component.
