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

import type { ReactNode, CSSProperties } from 'react';
import type { Responsive, ProviderBg, SpaceProps } from '../../types';

/** @public */
export type BoxOwnProps = {
  as?: keyof JSX.IntrinsicElements;
  bg?: Responsive<ProviderBg>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** @public */
export type BoxUtilityProps = {
  display?: Responsive<'none' | 'flex' | 'block' | 'inline'>;
  position?: Responsive<
    'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  >;
  width?: Responsive<string>;
  minWidth?: Responsive<string>;
  maxWidth?: Responsive<string>;
  height?: Responsive<string>;
  minHeight?: Responsive<string>;
  maxHeight?: Responsive<string>;
};

/** @public */
export interface BoxProps
  extends SpaceProps,
    BoxOwnProps,
    BoxUtilityProps,
    React.HTMLAttributes<HTMLDivElement> {}
