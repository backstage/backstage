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

import { Breakpoint } from '@backstage/canon';
import {
  ReactElement,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react';

/** @public */
export type ButtonCommonProps = {
  size?: 'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>;
  variant?:
    | 'primary'
    | 'secondary'
    | Partial<Record<Breakpoint, 'primary' | 'secondary'>>;
  iconStart?: ReactElement;
  iconEnd?: ReactElement;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** @public */
export type ButtonAnchorProps = ButtonCommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'> & {
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

/** @public */
export type ButtonNativeProps = ButtonCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'> & {
    href?: undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

/**
 * Properties for {@link Button}
 *
 * @public
 */
export type ButtonProps = ButtonAnchorProps | ButtonNativeProps;
