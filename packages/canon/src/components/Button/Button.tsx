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

import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import type { ButtonProps } from './types';

/** @public */
export const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const {
    size = 'small',
    variant = 'primary',
    iconStart,
    iconEnd,
    children,
    href,
    className,
    style,
    ...rest
  } = props;

  const isAnchor = typeof props.href === 'string';

  const responsiveSize = useResponsiveValue(size);
  const responsiveVariant = useResponsiveValue(variant);

  const content = (
    <>
      {iconStart && (
        <span
          className="canon-ButtonIcon"
          aria-hidden="true"
          data-size={responsiveSize}
        >
          {iconStart}
        </span>
      )}
      {children}
      {iconEnd && (
        <span
          className="canon-ButtonIcon"
          aria-hidden="true"
          data-size={responsiveSize}
        >
          {iconEnd}
        </span>
      )}
    </>
  );

  if (isAnchor) {
    const { onClick, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={clsx('canon-Button', className)}
        data-variant={responsiveVariant}
        data-size={responsiveSize}
        style={style}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onClick={onClick}
        {...anchorRest}
      >
        {content}
      </a>
    );
  } else {
    const { onClick, ...buttonRest } =
      rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        type="button"
        className={clsx('canon-Button', className)}
        data-variant={responsiveVariant}
        data-size={responsiveSize}
        style={style}
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
});

Button.displayName = 'Button';
