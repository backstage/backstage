---
'@backstage/plugin-tech-insights': patch
'@backstage/plugin-tech-insights-backend-module-jsonfc': patch
---

RunChecks endpoint now handles missing retriever data in checks. Instead of
showing server errors, the checks will be shown for checks whose retrievers have
data, and a warning will be shown if no checks are returned.
