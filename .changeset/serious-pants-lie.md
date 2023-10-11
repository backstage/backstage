---
'@backstage/cli': patch
---

Support for the `.icon.svg` extension has been deprecated and will be removed in the future. The implementation of this extension is too tied to a particular version of MUI and the SVGO, and it makes it harder to evolve the build system. We may introduce the ability to reintroduce this kind of functionality in the future through configuration for use in internal plugins, but for now we're forced to remove it.

To migrate existing code, rename the `.icon.svg` file to `.tsx` and replace the `<svg>` element with `<SvgIcon>` from MUI and add necessary imports. For example:

```tsx
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { IconComponent } from '@backstage/core-plugin-api';

export const CodeSceneIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <g>
      <path d="..." />
    </g>
  </SvgIcon>
);
```
