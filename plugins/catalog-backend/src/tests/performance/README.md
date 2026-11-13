# Catalog Performance Tests

These are regular jest tests, but they are only enabled when the
`PERFORMANCE_TEST` environment variable is set. You can also set the
`PERFORMANCE_TRACE` environment variable to get additional trace output while
the tests run.

## Large dataset suites

The `queryBattery`, `orphanCleanup`, `ancestry`, `refreshAtScale` and
`stitchQueue` suites run against a seeded Postgres dataset of about 500,000
entities. SQLite is not supported, because its plans say nothing about the
Postgres planner. Plan assertions in `queryBattery` fail the test, and the
operation timings are recorded as `<test> [op]` entries.

The dataset is prepared once, before the suites run, by `lib/preloadDataset.ts`.
It seeds the `catalog_perf_template` database, and creates the read copy
`catalog_perf_dataset` that read-only suites query. Suites that change data
work on their own copies of the template.

### Environment variables

- `PERFORMANCE_TEST`: set to `1` to enable the tests.
- `PERFORMANCE_DATABASE_IDS`: comma separated database ids to run against, for
  example `POSTGRES_18`. Defaults to `POSTGRES_14,POSTGRES_18`.
- `BACKSTAGE_TEST_DATABASE_POSTGRES14_CONNECTION_STRING` and
  `BACKSTAGE_TEST_DATABASE_POSTGRES18_CONNECTION_STRING`: the server for each
  database id.
- `PERFORMANCE_DATASET_SIZE`: number of entities to seed. Defaults to 500000.
- `PERFORMANCE_RESULTS_FILE`: file that timings are appended to as JSON lines.
  The query battery records the median of five timed runs after one warm-up.
  Suites that change data record a single run. Each battery scenario also
  records the shared buffers its plans touched, as `<name> [buffers]`.
- `PERFORMANCE_PLAN_CHECKS`: set to `report` to record query plan check
  violations in `PERFORMANCE_PLAN_FINDINGS_FILE` instead of failing the test.
  When unset, a violation fails the test. Correctness assertions, such as row
  counts, always fail.
- `PERFORMANCE_PLAN_FINDINGS_FILE`: file that plan findings are appended to as
  JSON lines of `{ test, rule, planSummary, known }`, in report mode.

### Known plan issues

A plan check that fails for a documented reason is passed `known: true` in
`queryBattery.test.ts` and `orphanCleanup.test.ts`, next to a comment that
explains the issue. In report mode, its violations are recorded with
`known: true`. If it stops finding violations, a "now passing" finding is
recorded, and the `known` flag should be removed. In strict mode, known issues
fail the test like any other violation.

### Running locally

Use a smaller dataset to iterate quickly. From the repository root, with
Postgres running and no tests in progress:

```bash
export PERFORMANCE_TEST=1
export PERFORMANCE_DATABASE_IDS=POSTGRES_18
export PERFORMANCE_DATASET_SIZE=50000
export BACKSTAGE_TEST_DATABASE_POSTGRES18_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432

node --require @backstage/cli/config/nodeTransform.cjs \
  plugins/catalog-backend/src/tests/performance/lib/preloadDataset.ts

CI=1 yarn test plugins/catalog-backend/src/tests/performance/queryBattery
```

Running the script again with the same size does nothing. Run it again whenever the
size or the generator changes.

## CI

The `Catalog Performance` workflow runs the older suites in one job, and the
large dataset suites in a `query-battery` matrix job with one leg per Postgres
version. Each leg restores a `pg_dump` of the template database from the
Actions cache, keyed on the catalog migrations and `lib/dataset.ts`. On a
cache miss the leg seeds the dataset, then saves the dump. Timings are compared
against a per-version baseline recorded on master by the
`Catalog Performance Baseline` workflow.

The `query-battery` jobs run with `PERFORMANCE_PLAN_CHECKS=report`, so query
plan violations do not fail the job. The compare step adds them to the job
summary under "Query plan findings": new findings first, and annotated as
warnings, then known issues, then known issues that now pass.

### Stable results

Timings on shared runners are noisy, so the comparison treats the number of
shared buffers a query touches as the main signal. Medians of repeated runs
are flagged at 1.5x, and single runs and whole tests only above 3x. Findings
are matched against the baseline ignoring numbers in the rule text.

To keep plans and buffer counts the same between runs, the dataset script
turns off automatic vacuuming on the dataset tables and JIT on the databases,
analyzes with a statistics target of 1000, and loads the dataset into the
buffer cache with `pg_prewarm`.
A Postgres 18 snapshot keeps its statistics through the dump and restore.
Earlier versions do not dump statistics, so the restored template is analyzed
again, and plans can still differ slightly between runs there.
