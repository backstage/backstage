---
name: catalog-db-performance
description: Run the catalog query performance battery against a database replica and compare to the previous baseline. Use when making changes to catalog database queries, indexes, or schema.
---

# Catalog Database Performance Battery

Run the query performance battery defined in
`plugins/catalog-backend/src/tests/performance/query-battery/queries.md`
and compare the results to the baseline in
`plugins/catalog-backend/src/tests/performance/query-battery/baseline.md`.

## Steps

1. **Ask the user** for database connection details (host, port, user,
   database name). These are environment-specific and not stored in the
   repo.

2. **Read the battery** from `queries.md`. For each scenario, the
   preferred method is to run the TypeScript method call shown (e.g.,
   `catalog.queryEntities(...)`) and capture the query plan. If that
   isn't practical, run the reference SQL directly with
   `EXPLAIN (ANALYZE, BUFFERS)` via `psql`.

3. **Read the previous baseline** from `baseline.md`.

4. **Run each scenario** (11 total). For each one, record:

   - Execution time
   - Planning time
   - Plan shape (top-level nodes and index names)
   - Anti-patterns detected (check against the scenario's list AND the
     global anti-patterns at the bottom of `queries.md`)
   - Buffer stats

5. **Compare to baseline**. Flag:

   - Execution time regressions >50%
   - Plan shape changes (different index, new Sort/Seq Scan nodes)
   - New anti-patterns that weren't in the previous run
   - Note: catalog size differences affect absolute timings. Focus on
     plan shape changes and proportional regressions.

6. **Update `baseline.md`** with the new results. Keep the same format.
   Add a comparison section at the bottom noting significant changes.

7. **Report** a summary to the user: which scenarios improved, which
   regressed, and whether any global anti-patterns were detected.

## When to run

- Before and after changes to catalog database queries
- Before and after adding/removing/modifying indexes
- Before and after schema migrations
- Periodically to establish fresh baselines

## Important

- Do NOT store database connection details in the repo
- Use a 30-second timeout per query
- Some queries use placeholder entity refs that may not exist in the
  target database — 0 rows returned is fine, the plan shape is what
  matters
