---
'@backstage/cli': minor
---

**BREAKING**: The linter now rejects imports from the index file of the current directory, or of any parent directory. These frequently lead to problematic circular imports.

Example of a piece of code that will now be rejected:

```ts
import { MyClass } from '.';
```

It should instead be refactored to:

```ts
import { MyClass } from './MyClass';
```
