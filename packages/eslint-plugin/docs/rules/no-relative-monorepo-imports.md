# @backstage/no-relative-monorepo-imports

Forbid relative imports that reach outside of the package in a monorepo.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-relative-monorepo-imports": ["error"]
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

Assuming an import from for example `plugins/bar/src/index.ts`:

### Fail

```ts
import { FooCard } from '../../foo';

import { FooCard } from '../../foo/src/components/FooCard';
```

### Pass

```ts
import { FooCard } from '@internal/plugin-foo';

// This is allowed by this rule, but not by no-forbidden-package-imports
import { FooCard } from '@internal/plugin-foo/src/components/FooCard';
```
