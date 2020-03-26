# createPlugin - feature flags

The `featureFlags` object passed to the `register` function makes it possible for plugins to register Feature Flags in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc.

```typescript
export type FeatureFlagsHooks = {
  registerFeatureFlag(name: FeatureFlagName): void;
};
```

Then, later, if you want to check if the user has enabled them:

```tsx
import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { featureFlagsApiRef, useApi } from '@backstage/core';

const ExampleButton: FC<{}> = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);

  const handleClick = () => {
    featureFlagsApi.enable('enable-example-feature');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Enable the 'enable-example-feature' feature flag
    </Button>
  );
};
```

[Back to References](README.md)
