# @backstage/plugin-user-settings-react

React utilities for working with user settings and the current user.

## User profile

The `useUserProfile` hook loads the current user's identity-provider profile and
Backstage identity. If the identity-provider profile has no picture, the hook
uses the profile picture from the user's catalog entity as a fallback.

```tsx
import { useUserProfile } from '@backstage/plugin-user-settings-react';

const UserGreeting = () => {
  const { displayName, profile, backstageIdentity, loading } = useUserProfile();

  if (loading) {
    return null;
  }

  return (
    <div>
      Signed in as {displayName} ({profile.email}) with entity ref{' '}
      {backstageIdentity?.userEntityRef}
    </div>
  );
};
```
