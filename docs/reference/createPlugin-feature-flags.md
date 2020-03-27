# createPlugin - feature flags

The `featureFlags` object passed to the `register` function makes it possible for plugins to register Feature Flags in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc.

```typescript
export type FeatureFlagsHooks = {
  registerFeatureFlag(name: FeatureFlagName): void;
};
```

Here's a code sample:

```typescript
import { createPlugin } from '@backstage/core';

export default createPlugin({
  id: 'welcome',
  register({ router, featureFlags }) {
    // router.registerRoute('/', Component);
    featureFlags.registerFeatureFlag('enable-example-feature');
  },
});
```

## Using with useApi

To use it, you'll first need to register the `FeatureFlags` API via `ApiRegistry` in your `apis.ts` in your App:

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
  const { useFeatureFlag } = useApi(featureFlagsApiRef);
  const [flagState, setFlagState] = useFeatureFlag('enable-example-feature');

  const handleClick = () => {
    setFlagState(FeatureFlagState.Enabled);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Enable the 'enable-example-feature' feature flag
    </Button>
  );
};
```

Note that you must register it with `registerFeatureFlag` otherwise the `useFeatureFlag` will throw an error.

[Back to References](README.md)
