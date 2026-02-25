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
import type { Responsive, Space, SpaceProps, ProviderBg } from '../../types';

/** @public */
export type FlexOwnProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  bg?: Responsive<ProviderBg>;
};

/** @public */
export interface FlexProps extends SpaceProps, FlexOwnProps {
  gap?: Responsive<Space>;
  align?: Responsive<'start' | 'center' | 'end' | 'baseline' | 'stretch'>;
  justify?: Responsive<'start' | 'center' | 'end' | 'between'>;
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
}
