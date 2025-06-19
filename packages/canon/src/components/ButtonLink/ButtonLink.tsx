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

import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { Link as RALink } from 'react-aria-components';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import type { ButtonLinkProps } from './types';

/** @public */
export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => {
    const {
      size = 'small',
      variant = 'primary',
      iconStart,
      iconEnd,
      children,
      className,
      ...rest
    } = props;

    const responsiveSize = useResponsiveValue(size);
    const responsiveVariant = useResponsiveValue(variant);

    return (
      <RALink
        className={clsx('canon-Button', 'canon-ButtonLink', className)}
        data-variant={responsiveVariant}
        data-size={responsiveSize}
        ref={ref}
        {...rest}
      >
        {iconStart}
        {children}
        {iconEnd}
      </RALink>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
