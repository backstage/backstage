---
'@backstage/plugin-search-backend': minor
---

The query received by search engines now contains a property called `pageLimit`, it specifies how many results to return per page when sending a query request to the search backend.

Example:
_Returns up to 30 results per page_

```
GET /query?pageLimit=30
```

The search backend validates the page limit and this value must not exceed 100, but it doesn't set a default value for the page limit parameter, it leaves it up to each search engine to set this, so Lunr, Postgres and Elastic Search set 25 results per page as a default value.
