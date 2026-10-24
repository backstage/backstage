/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserEntity } from '@backstage/catalog-model';
import { createSwappableComponent } from '@backstage/frontend-plugin-api';
import type { AvatarOwnProps } from '@backstage/ui';
import type { DefaultUserAvatarProps } from './DefaultUserAvatar';

/**
 * Props for the {@link UserAvatar} swappable component.
 *
 * @public
 */
export interface UserAvatarProps {
  /**
   * The catalog user entity whose profile picture should be displayed.
   */
  entity: UserEntity;
  /**
   * Display name used for avatar initials when no picture is available.
   * Defaults to `entity.spec.profile.displayName` or `entity.metadata.name`.
   */
  displayName?: string;
  className?: string;
  size?: AvatarOwnProps['size'];
  purpose?: AvatarOwnProps['purpose'];
}

/**
 * Swappable component that renders a user profile avatar. Apps can override
 * this to customize avatar rendering consistently across org plugin surfaces
 * such as the members list and user profile cards.
 *
 * @public
 */
export const UserAvatar = createSwappableComponent<
  DefaultUserAvatarProps,
  UserAvatarProps
>({
  id: 'org.user-avatar',
  loader: () => import('./DefaultUserAvatar').then(m => m.DefaultUserAvatar),
  transformProps: ({ entity, displayName, className, size, purpose }) => ({
    entity,
    displayName:
      displayName ?? entity.spec?.profile?.displayName ?? entity.metadata.name,
    className,
    size,
    purpose,
  }),
});
