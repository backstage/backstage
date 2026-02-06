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
import type { LinkProps as RALinkProps } from 'react-aria-components';
import type { Responsive } from '../../types';

/** @public */
export type ButtonLinkOwnProps = {
  size?: Responsive<'small' | 'medium'>;
  variant?: Responsive<'primary' | 'secondary' | 'tertiary'>;
  iconStart?: ReactElement;
  iconEnd?: ReactElement;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Properties for {@link ButtonLink}
 *
 * @public
 */
export interface ButtonLinkProps
  extends Omit<RALinkProps, 'children' | 'className' | 'style'>,
    ButtonLinkOwnProps {}
