---
'@backstage/plugin-search-backend-node': patch
---

Enhance the search results of `LunrSearchEngine` to support a more natural
search experience. This is done by allowing typos (by using fuzzy search) and
supporting typeahead search (using wildcard queries to match incomplete words).
