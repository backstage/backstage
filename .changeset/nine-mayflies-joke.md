---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Updated `EntityRefLink` and `AboutField` components to handle long values by using the `OverflowTooltip` component to truncate when needed.

Changes to EntityRefLink.tsx:

```diff
-import { Tooltip } from '@material-ui/core';
+import { Tooltip, Box } from '@material-ui/core';
+import { OverflowTooltip } from '@backstage/core-components';

-        {!children && (title ?? formattedEntityRefTitle)}
+        {!children &&
+          (title ?? (
+            <Box maxWidth="200px">
+              <OverflowTooltip text={formattedEntityRefTitle} />
+            </Box>
+          ))}

```

Changes to AboutField.tsx:

```diff
-import { Grid, makeStyles, Typography } from '@material-ui/core';
+import { Grid, makeStyles, Typography, Box } from '@material-ui/core';
+import { OverflowTooltip } from '@backstage/core-components';

-        {value || `unknown`}
+        <Box maxWidth="200px">
+          <OverflowTooltip text={value || `unknown`} />
+        </Box>
```
