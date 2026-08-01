---
'@backstage/plugin-search': patch
---

Navigation to the search results page now goes through the app's own navigation when one is available, and falls back to React Router when it is not, so the same plugin code works under scoped plugin routing as well as in the old frontend system.

Submitting a search from the search modal now encodes the search term into the query string. A term containing a URL, such as `https://example.com`, previously produced a malformed link to the results page; it is now searched for like any other term.
