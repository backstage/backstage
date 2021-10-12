---
'@backstage/plugin-catalog': patch
---

Set the search field placeholder on the catalog table to "Filter" to differentiate it from the search feature

We had feedback that users expected the catalog table search field to have more sophisticated behaviour
than simple filtering. This change better sets expectations by setting the placeholder to "Filter" to
differentiate it from components which are part of the search plugin.
