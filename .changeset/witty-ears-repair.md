---
'@backstage/backend-test-utils': patch
---

Added support for PostgreSQL versions 15 and 16

Also introduced a new `setDefaults(options: { ids?: TestDatabaseId[] })` static method that can be added to the `setupTests.ts` file to define the default database ids you want to use throughout your package. Usage would look like this: `TestDatabases.setDefaults({ ids: ['POSTGRES_12','POSTGRES_16'] })` and would result in PostgreSQL versions 12 and 16 being used for your tests.
