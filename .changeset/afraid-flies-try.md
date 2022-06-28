---
'@backstage/plugin-cost-insights': patch
---

Move cost-insights data specific API types (non react) into an @backstage/plugin-cost-insights-common
isomorphic package. This allows these types to be shared in any backend packages or other cost-insight
modules.
