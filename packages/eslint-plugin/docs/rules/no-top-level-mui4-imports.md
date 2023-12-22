# @backstage/no-top-level-mui4-imports

Forbid top level import from Material UI v4 packages.

## Usage

Add the rules as follows, it has no options:

```js
"@backstage/no-top-level-mui4-imports": ["error"]
```

## Rule Details

TBD - Not sure what should go here

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
