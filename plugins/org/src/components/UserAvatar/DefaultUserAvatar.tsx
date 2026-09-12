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
import { Avatar, AvatarOwnProps } from '@backstage/ui';

/**
 * Props for the default {@link UserAvatar} implementation.
 *
 * @public
 */
export interface DefaultUserAvatarProps {
  entity: UserEntity;
  displayName: string;
  className?: string;
  size?: AvatarOwnProps['size'];
  purpose?: AvatarOwnProps['purpose'];
}

/**
 * Default implementation of the {@link UserAvatar} swappable component.
 *
 * @public
 */
export const DefaultUserAvatar = (props: DefaultUserAvatarProps) => {
  const { entity, displayName, className, size = 'x-large', purpose } = props;
  const picture = entity.spec?.profile?.picture;

  return (
    <Avatar
      className={className}
      name={displayName}
      src={picture ?? ''}
      purpose={purpose ?? 'decoration'}
      size={size}
    />
  );
};
