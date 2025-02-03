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

import type { HeightProps } from '../../props/height.props';
import type { WidthProps } from '../../props/width.props';
import type { PositionProps } from '../../props/position.props';
import type { DisplayProps } from '../../props/display.props';
import type { SpaceProps } from '../../types';
import type { BoxOwnProps } from './Box.props';

/** @public */
export interface BoxProps extends SpaceProps {
  display?: DisplayProps['display'];
  as?: BoxOwnProps['as'];
  width?: WidthProps['width'];
  minWidth?: WidthProps['minWidth'];
  maxWidth?: WidthProps['maxWidth'];
  height?: HeightProps['height'];
  minHeight?: HeightProps['minHeight'];
  maxHeight?: HeightProps['maxHeight'];
  position?: PositionProps['position'];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
