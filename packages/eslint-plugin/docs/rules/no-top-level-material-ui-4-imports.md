# @backstage/no-top-level-material-ui-4-imports

Forbid top level import from Material UI v4 packages.

## Usage

Add the rules as follows, it has no options:

```js
'@backstage/no-top-level-material-ui-4-imports': 'error'
```

## Rule Details

Automatically fixes imports from named to default imports. This will help you comply with [Material UI recommendations](https://mui.com/material-ui/guides/minimizing-bundle-size/) and make migrating to Material UI v5 easier.

### Fail

```tsx
import { Box, Typography } from '@material-ui/core';
```

```tsx
import Box from '@material-ui/core';
```

```tsx
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from '@material-ui/core';
```

### Pass

```tsx
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
```

## --fix known issues

This rule provides automatic fixes for the imports, but it has some known issues:

### Non Props types import

The fix will handle correctly 3 groups of imports:

- Any import from related to styles (i.e `makeStyles`, `styled`, `WithStyles`) will be auto fixed to the `@material-ui/core/styles` import.
- Any import with `Props` suffix will be auto fixed to actual component for example `DialogProps` will be imported from `@material-ui/core/Dialog`.
- Any other import will be considered as a component import and will be auto fixed to the actual component import.

This means that some types of imports without `Props` suffix will be wrongly auto fixed to the component import, for example this fix will be wrong:

```diff
-   import { Alert, Color } from '@material-ui/lab';
+   import Alert from '@material-ui/lab/Alert';
+   import Color  from '@material-ui/lab/Color'; // this import is wrong
```

The correct import should look like this:

```diff
-   import { Alert, Color } from '@material-ui/lab';
+   import Alert, {Color} from '@material-ui/lab/Alert';
```

Because `Color` is a type coming from the Alert component.

### No default export available

Some components do not have a default export, for example `@material-ui/pickers/DateTimePicker` does not have a default export, so the fix will not work for these cases.

The fix will be wrong for this import:

```diff
- import { DateTimePicker } from '@material-ui/pickers';
+ import DateTimePicker from '@material-ui/pickers/DateTimePicker'; // this default import does not exist
```

The correct import should look like this:

```diff
- import { DateTimePicker } from '@material-ui/pickers';
+ import { DateTimePicker } from '@material-ui/pickers/DateTimePicker'; // this is the correct import
```
