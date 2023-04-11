---
'@backstage/plugin-catalog-react': patch
---

Reverted the check if the selected options list is different than the query parameters list before invoking `setSelectedOptions` method. This was preventing updating list items when a query string was already present in the URL when loading the page.
