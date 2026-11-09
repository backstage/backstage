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
