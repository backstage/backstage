# @backstage/no-undeclared-imports

Forbid imports of external packages that have not been declared in the appropriate dependencies field in `package.json`.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-undeclared-imports": ["error"]
```

The following patterns are considered files used during development, and only need dependencies to be declared in `devDependencies`:

```python
!src/**  # Any files outside of src are considered dev files
src/**/*.test.*
src/**/*.stories.*
src/**/__testUtils__/**
src/**/__mocks__/**
src/setupTests.*
```

## Rule Details

Given the following `package.json`:

```json
{
  "name": "@backstage/plugin-foo",
  "backstage": {
    "role": "frontend-plugin"
  },
  "dependencies": {
    "react": "^17.0.0"
  },
  "devDependencies": {
    "@backstage/core-plugin-api": "^1.0.0"
  },
  "peerDependencies": {
    "@backstage/config": "*"
  }
}
```

### Fail

Inside `src/my-plugin.ts`:

```ts
// Should be declared as a dependency
const _ = require('lodash');
import _ from 'lodash';

// React should be a peer dependency in frontend plugins
import react from 'react';

// Should be declared as a dependency, not a dev dependency
import { useApi } from '@backstage/core-plugin-api';
```

Inside `src/my-plugin.test.ts` (a test file):

```ts
// Should be declared as a dev dependency
const _ = require('lodash');
import _ from 'lodash';
```

### Pass

Inside `src/my-plugin.ts`:

```ts
// Declared in peerDependencies, so it is allowed
import { ConfigReader } from '@backstage/config';
```

Inside `src/my-plugin.test.ts` (a test file):

```ts
// Declared as a dev dependency inside a test file
import { useApi } from '@backstage/core-plugin-api';
```

## Fixes

The fix adds missing dependencies by running the `add` command of the package manager in the package directory. It uses the package manager that the `packageManager` field of the root `package.json` names, or, without that field, the one that its `devEngines.packageManager` field names. Without either, it uses pnpm when the root has a `pnpm-lock.yaml` file, Yarn when it has a `yarn.lock` file, and pnpm when it has a `pnpm-workspace.yaml` file. When the root has none of these, as for a Backstage installation in a subdirectory of a pnpm workspace, the nearest parent directory with one of these files decides in the same way. Otherwise it uses Yarn. With pnpm, workspace packages are added with a `workspace:^` range unless another range is already used in the repository.
