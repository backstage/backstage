---
'@backstage/plugin-search-backend': minor
---

The query received by search engines now contains a property called `pageLimit`, it specifies how many results to return per page when sending a query request to the search backend.

Example:
_Returns up to 30 results per page_

```
GET /query?pageLimit=30
```

It is worth mentioning that only the Lunr and Elastic Search engines currently use this new property in their implementations. So that means you can't use it with Postgres for now. The search backend doesn't set a default value for the page limit parameter, it leaves it up to each search engine to set this, so Lunr and Elastic Search set 25 results per page as a default value.
