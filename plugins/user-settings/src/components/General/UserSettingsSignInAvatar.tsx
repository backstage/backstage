/*
 * Copyright 2020 The Backstage Authors
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

import {
  ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
  sidebarConfig,
} from '@backstage/core-components';
import { useUserProfile } from '../useUserProfileInfo';

/** @public */
export const UserSettingsSignInAvatar = (props: { size?: number }) => {
  const { size } = props;
  const { iconSize } = sidebarConfig;
  const avatarSize = size ?? iconSize;
  const { profile } = useUserProfile();

  return (
    <ShadcnAvatar
      style={{ width: avatarSize, height: avatarSize }}
      className="border border-border"
    >
      <AvatarImage
        src={profile.picture}
        alt="Profile picture"
        style={{ fontSize: avatarSize * 0.7 }}
      />
      <AvatarFallback
        className="text-muted-foreground"
        style={{ fontSize: avatarSize * 0.7 }}
      >
        {profile.displayName?.[0]?.toUpperCase() || '?'}
      </AvatarFallback>
    </ShadcnAvatar>
  );
};
