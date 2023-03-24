---
'@backstage/plugin-catalog-react': minor
---

Reverted the check if selectedOptions is different than queryParameters before invoking setSelectedOptions. This was preventing updating list items when a query string was already present in the URL when loading the page.
