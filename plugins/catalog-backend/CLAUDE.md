# Catalog Backend

## Database query performance

A query performance battery lives in
`src/tests/performance/query-battery/`. It contains scenarios
(`queries.md`) and a baseline (`baseline.md`) for detecting regressions
in the catalog database layer.

When changing database queries, indexes, or schema in this plugin:

1. Run `/catalog-db-performance` before and after your change
2. If your change alters the shape of a query tested by the battery,
   update the reference SQL in `queries.md` to match
3. Update `baseline.md` with the new results if the change is intentional
