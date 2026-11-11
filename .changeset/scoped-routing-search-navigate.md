---
'@backstage/plugin-search': patch
---

Submitting a search from the search modal now encodes the search term into the query string. A term containing a URL, such as `https://example.com`, previously produced a malformed link to the results page. It is now searched for like any other term.
