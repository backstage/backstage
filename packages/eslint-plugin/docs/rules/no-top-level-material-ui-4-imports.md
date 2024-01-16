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
