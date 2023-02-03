# @backstage/no-undeclared-imports

Forbid imports of external packages that have not been declared in the appropriate dependencies field in `package.json`.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-undeclared-imports": ["error"]
```

The following patterns are considered files used during development, and only need dependencies to be declared in devDependencies:

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
