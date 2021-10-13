---
'@backstage/core-components': patch
---

Change the Table search field placeholder to "Filter" and change icon accordingly

We had feedback that users expected the catalog table search field to have more sophisticated behaviour
than simple filtering. This change sets the search field placeholder to read "Filter"
to avoid confusion with the search feature. The icon is updated to match. This change is applied
generally in core-components so this change is made consistently across the app given the search
field is present on all pages via the sidebar.
