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

import type { ReactElement, ReactNode, CSSProperties } from 'react';
import type { ButtonProps as RAButtonProps } from 'react-aria-components';
import type { Responsive, Surface } from '../../types';

/**
 * Button's own properties (excluding inherited React Aria props)
 *
 * @public
 */
export type ButtonOwnProps = {
  size?: Responsive<'small' | 'medium' | 'large'>;
  variant?: Responsive<'primary' | 'secondary' | 'tertiary'>;
  iconStart?: ReactElement;
  iconEnd?: ReactElement;
  loading?: boolean;
  /** Surface the button is placed on. Defaults to context surface if available */
  onSurface?: Responsive<Surface>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Properties for {@link Button}
 *
 * @public
 */
export interface ButtonProps
  extends Omit<RAButtonProps, 'children' | 'className' | 'style'>,
    ButtonOwnProps {}
