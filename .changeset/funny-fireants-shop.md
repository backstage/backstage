---
'@backstage/plugin-newrelic-dashboard': patch
---

- Fix bug where the default time window/snapshot duration was supposed to be 30 days, but ended up being 43 weeks
- Add the optional entity metadata annotation to change the time window of the data shown in the snapshot
