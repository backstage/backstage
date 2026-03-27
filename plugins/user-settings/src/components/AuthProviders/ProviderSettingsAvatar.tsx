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

type Props = { size?: number; picture: string | undefined };

/** Renders a profile avatar for an authentication provider settings item. */
export const ProviderSettingsAvatar = ({ size, picture }: Props) => {
  const { iconSize } = sidebarConfig;
  const resolvedSize = size ?? iconSize;

  return (
    <ShadcnAvatar
      className="shrink-0 border border-border"
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      {picture ? (
        <AvatarImage src={picture} alt="" />
      ) : (
        <AvatarFallback
          className="text-xs text-muted-foreground"
          style={{ fontSize: resolvedSize * 0.7 }}
        />
      )}
    </ShadcnAvatar>
  );
};
