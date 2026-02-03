# no-ui-css-imports-in-non-frontend

Ensures that only packages with `backstage.role` set to `"frontend"` can import CSS files from `@backstage/ui`.

This rule prevents non-frontend packages from accidentally importing global CSS styles from `@backstage/ui`. These CSS files should only be imported by the app, never by plugins, modules or libraries.

## Rule Details

This rule checks imports from `@backstage/ui` that end with `.css` and verifies that the importing package has `backstage.role: "frontend"` in its `package.json`.

If a package does not have a `backstage.role` field defined at all, the import is allowed (the check is skipped).

Examples of **incorrect** code for this rule:

```js
// In a package with "backstage.role": "frontend-plugin"
import '@backstage/ui/css/styles.css';
```

```js
// In a package with "backstage.role": "web-library"
import '@backstage/ui/css/styles.css';
```

```js
// In a package with "backstage.role": "backend"
require('@backstage/ui/css/styles.css');
```

Examples of **correct** code for this rule:

```js
// In a package with "backstage.role": "frontend"
import '@backstage/ui/css/styles.css';
```

```js
// In a package without a "backstage.role" field
import '@backstage/ui/css/styles.css';
```

```js
// Non-CSS imports are allowed in any package
import { Button, Text } from '@backstage/ui';
```

```js
// In a package with "backstage.role": "backend"
import { Button } from '@backstage/ui';
```
