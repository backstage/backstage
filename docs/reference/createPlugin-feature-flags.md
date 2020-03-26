# createPlugin - feature flags

The `featureFlags` object passed to the `register` function makes it possible for plugins to register Feature Flags in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc.

```typescript
export type FeatureFlagsHooks = {
  registerFeatureFlag(name: FeatureFlagName): void;
};
```

## Using with useApi

This is the **recommended** way of using the API. It's officially supported by Backstage. To use it, you'll first need to register the `FeatureFlags` API via `ApiRegistry` in your `apis.ts` in your App:

```tsx
import {
  ApiHolder,
  ApiRegistry,
  featureFlagsApiRef,
  FeatureFlags,
} from '@backstage/core';

const builder = ApiRegistry.builder();
builder.add(featureFlagsApiRef, FeatureFlags);

export default builder.build() as ApiHolder;
```

Then, later, you can directly use it via `useApi`:

```tsx
import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { featureFlagsApiRef, useApi } from '@backstage/core';

const ExampleButton: FC<{}> = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const handleClick = () => featureFlagsApi.enable('enable-example-feature');

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Enable the 'enable-example-feature' feature flag
    </Button>
  );
};
```

## Using directly with the `FeatureFlags` object

This is **only** for backwards-compatibility support for Spotify's internal Backstage plugins. This may be deprecated in the distant future so generally we advise against using it.

```tsx
import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { FeatureFlags } from '@backstage/core';

const ExampleButton: FC<{}> = () => {
  const handleClick = () => FeatureFlags.enable('enable-example-feature');

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Enable the 'enable-example-feature' feature flag
    </Button>
  );
};
```

[Back to References](README.md)
