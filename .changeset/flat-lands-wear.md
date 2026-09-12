---
'@backstage/plugin-org': minor
---

Added a swappable `UserAvatar` component and wired org plugin surfaces to use it for user profile pictures.

**Why:** By default, user avatars use `entity.spec.profile.picture` from the catalog. That works when profile pictures are stored on the entity during ingestion (for example, via the Microsoft Graph catalog provider with `loadUserPhotos: true`). When pictures are fetched lazily from an external source instead — or when bulk photo sync is disabled for performance — `spec.profile.picture` is empty and org plugin surfaces show initials, even if photos are available on demand.

**What changed:** `MembersListCard` and `UserProfileCard` now render the shared `UserAvatar` swappable component instead of inlining `@backstage/ui` `Avatar`. Apps can override `UserAvatar` once via `SwappableComponentBlueprint` to customize avatar rendering consistently across org plugin surfaces.

**Default behavior (unchanged):** When no override is registered, avatars still render:

```tsx
<Avatar src={profile?.picture ?? ''} />
```

**New API:**

```tsx
import { UserAvatar, type UserAvatarProps } from '@backstage/plugin-org';
```

Apps using the new frontend system can override the component globally:

```tsx
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { UserAvatar } from '@backstage/plugin-org';

export const appModuleOrg = createFrontendModule({
  pluginId: 'app',
  extensions: [
    SwappableComponentBlueprint.make({
      name: 'org-user-avatar',
      params: defineParams =>
        defineParams({
          component: UserAvatar,
          loader: () => import('./LazyUserAvatar').then(m => m.LazyUserAvatar),
        }),
    }),
  ],
});
```

Components used as the swappable implementation receive `DefaultUserAvatarProps`:

```tsx
import type { DefaultUserAvatarProps } from '@backstage/plugin-org';

export function LazyUserAvatar(props: DefaultUserAvatarProps) {
  const picture = useLazyProfilePhoto(props.entity);
  return (
    <Avatar
      className={props.className}
      name={props.displayName}
      src={picture ?? ''}
      purpose={props.purpose ?? 'decoration'}
      size={props.size ?? 'x-large'}
    />
  );
}
```

**Backward compatibility:** No breaking changes. Existing callers of `MembersListCard`, `EntityMembersListCard`, and `UserProfileCard` require no updates.
