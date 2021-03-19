---
'@backstage/plugin-catalog-backend': patch
---

Introduce pagination in the /entities catalog endpoint.

Pagination is requested using query parameters. Currently supported parameters, all optional, are:

- `limit` - an integer number of entities to return, at most
- `offset` - an integer number of entities to skip over at the start
- `after` - an opaque string cursor as returned by a previous paginated request

Example request:

`GET /entities?limit=100`

Example response:

```
200 OK
Content-Type: application/json; charset=utf-8
Link: </entities?limit=100&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D>; rel="next"
<more headers>

[{"metadata":{...
```

Note the Link header. It contains the URL (path and query part, relative to the catalog root) to use for requesting the next page.
It uses the `after` cursor to point out the end of the previous page. If the Link header is not present, there is no more data to read.

The current implementation is naive and encodes offset/limit in the cursor implementation, so it is not robust in the face of overlapping
changes to the catalog. This can be improved separately in the future without having to change the calling patterns.
