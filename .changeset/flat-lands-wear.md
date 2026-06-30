---
'@backstage/plugin-org': minor
---

Added an optional `renderMemberAvatar` render prop to `MembersListCard`, plus the exported `MembersListCardRenderMemberAvatarProps` type. Legacy `EntityMembersListCard` usage in `EntityPage.tsx` inherits the prop because it lazy-loads the same component.

**Why:** By default, each member row renders a `@backstage/ui` `Avatar` using `member.spec.profile.picture` from the catalog. That works when profile pictures are stored on the entity during ingestion (for example, via the Microsoft Graph catalog provider with `loadUserPhotos: true`). When pictures are fetched lazily from an external source instead — or when bulk photo sync is disabled for performance — `spec.profile.picture` is empty and the stock card always shows initials, even if photos are available on demand.

**What changed:** `MemberComponent` now accepts an optional renderer. When `renderMemberAvatar` is provided, it is called for each member instead of the built-in avatar. Search, pagination, aggregate-member toggles, and member card layout are unchanged.

**Default behavior (unchanged):** When the prop is omitted, members still render:

```tsx
<Avatar src={profile?.picture ?? ''} />
```

**New API:**

```tsx
import {
  MembersListCard,
  type MembersListCardRenderMemberAvatarProps,
} from '@backstage/plugin-org';

<MembersListCard
  renderMemberAvatar={({ member, displayName, className }) => (
    <LazyAvatar
      member={member}
      displayName={displayName}
      className={className}
    />
  )}
/>;
```

The renderer receives:

- `member` — the catalog `UserEntity` for the row
- `displayName` — `member.spec.profile.displayName` or `member.metadata.name`
- `className` — layout class applied to the default avatar (pass through to your component for consistent sizing)

**Example: lazy-loaded avatars without forking the card**

```tsx
import { MembersListCard } from '@backstage/plugin-org';
import { Avatar } from '@backstage/ui';
import { useLazyProfilePhoto } from './useLazyProfilePhoto';

function LazyMemberAvatar({
  member,
  displayName,
  className,
}: MembersListCardRenderMemberAvatarProps) {
  const picture = useLazyProfilePhoto(member);
  return (
    <Avatar
      className={className}
      name={displayName}
      src={picture ?? ''}
      purpose="decoration"
      size="x-large"
    />
  );
}

export const LazyMembersListCard = () => (
  <MembersListCard
    renderMemberAvatar={props => <LazyMemberAvatar {...props} />}
  />
);
```

`EntityMembersListCard` in the old frontend system lazy-loads the same `MembersListCard` component, so `renderMemberAvatar` works when passed in `EntityPage.tsx`. The default `entity-card:org/members-list` extension on the new frontend system does not expose this prop through `app-config.yaml`; use an extension override instead.

**Backward compatibility:** No breaking changes. Existing callers of `MembersListCard` and `EntityMembersListCard` require no updates.
