# Basic database creator

This directory contains a database.ts file that can be used to create databases in PostgreSQL if they don't exist. It's a very basic implementation but it does the job.

## Usage

Copy the `database.ts` file to the src folder of your backend package and update your `index.ts` file.

```
import { createDatabasesIfNotExists } from './database';
...
async function main() {
  ....
  await createDatabasesIfNotExists(configReader, 'catalog', 'auth');

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
...
}
```
