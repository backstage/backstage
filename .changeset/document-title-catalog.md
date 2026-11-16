---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog': patch
---

In the new frontend system, the entity page now sets the browser's document title through the app's document title support instead of `react-helmet`. The title shows the selected entity content tab, the entity name, and the app title.
