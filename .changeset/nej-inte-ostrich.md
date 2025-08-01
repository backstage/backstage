---
'@backstage/plugin-app': patch
---

The default implementation of the Analytics API now collects and instantiates analytics implementations exposed via `AnalyticsImplementationBlueprint` extensions. If no such extensions are discovered, the API continues to do nothing with analytics events fired within Backstage. If multiple such extensions are discovered, every discovered implementation automatically receives analytics events.
