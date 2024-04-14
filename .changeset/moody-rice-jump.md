---
'@backstage/plugin-catalog-react': patch
---

Change behavior in EntityAutoCompletePicker to only hide filter if there are no available options. Previously the filter was hidden if there were <= 1 available options.
