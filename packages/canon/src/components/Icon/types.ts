/*
 * Copyright 2024 The Backstage Authors
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

import { ReactNode } from 'react';

/** @public */
export type IconNames =
  | 'account-circle'
  | 'alert'
  | 'arrow-down'
  | 'arrow-down-circle'
  | 'caret-down'
  | 'caret-left'
  | 'caret-right'
  | 'caret-up'
  | 'arrow-left'
  | 'arrow-left-circle'
  | 'arrow-left-down'
  | 'arrow-left-up'
  | 'arrow-right'
  | 'arrow-right-circle'
  | 'arrow-right-down'
  | 'arrow-right-up'
  | 'arrow-up'
  | 'arrow-up-circle'
  | 'braces'
  | 'brackets'
  | 'bug'
  | 'check'
  | 'check-double'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'cloud'
  | 'code'
  | 'discord'
  | 'download'
  | 'external-link'
  | 'eye'
  | 'eye-off'
  | 'filter'
  | 'flower'
  | 'github'
  | 'git-repository'
  | 'group'
  | 'heart'
  | 'moon'
  | 'plus'
  | 'sidebar-fold'
  | 'sidebar-unfold'
  | 'sparkling'
  | 'star'
  | 'sun'
  | 'terminal'
  | 'trash'
  | 'upload'
  | 'user'
  | 'youtube'
  | 'zoom-in'
  | 'zoom-out';

/** @public */
export type IconMap = Partial<Record<IconNames, React.ComponentType>>;

/** @public */
export type IconProps = {
  name: IconNames;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** @public */
export interface IconContextProps {
  icons: IconMap;
}

/** @public */
export interface IconProviderProps {
  children?: ReactNode;
  overrides?: Partial<Record<IconNames, React.ComponentType>>;
}
