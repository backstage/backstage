---
'@backstage/plugin-code-coverage-backend': patch
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-linguist-backend': patch
'@backstage/backend-common': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/backend-tasks': patch
'@backstage/plugin-app-backend': patch
'@backstage/create-app': patch
---

Expanded packages/backend-common added test to database manager specifically for MySQL for test that targets postgresql
Updated packages/backend-tasks text columns to longtext to work
with MySQL. MySQL requires lengths on their varchar columns. String columns in knex default to 255 characters unless otherwise provided in configuration
Updated packages/backend-tasks database migrations, scheduler and task manager test database array to include MySQL in the tests
Updated packages/backend-tasks task worker to add the includeOffset flag when updating the startAt column
Updated packages/create-app with a production MySQL App Config template. This config is referenced in the new e2e Linux MySQL test
Updated plugins/app-backend text columns to longtext to work
with MySQL. MySQL requires lengths on their varchar columns. String columns in knex default to 255 characters unless otherwise provided in configuration
Updated plugins/app-backend StaticAssetStore interval column to use the date_sub function to work with MySQL
Updated plugins/bazaar-backend Database Handler tests to run db tests against MySQL
Updated plugins/catalog-backend-module-incremental-ingestion WrapperProviders tests database array to run tests against MySQL
db tests against MySQL
Updated plugins/catalog-backend text columns to longtext to work
with MySQL. MySQL requires lengths on their varchar columns. String columns in knex default to 255 characters unless otherwise provided in configuration
Updated plugins/code-coverage-backend Migration sql text columns to string to work with MySQL. MySQL requires lengths on varchar columns. String columns default to 255 characters
Updated plugins/linguist-backend Migration sql text columns to string to work with MySQL. MySQL requires lengths on varchar columns. String columns default to 255 characters
Updated plugins/tech-insights-backend Migration sql text columns to string to work with MySQL. MySQL requires lengths on varchar columns. String columns default to 255 characters
Updated plugins/tech-insights-backend FactRetriever engine database list to run against MySQL
Updated e2e-test run command to run automated e2e tests against a MySQL service
