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

import React, { forwardRef, memo, ComponentType } from 'react';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { LinkProps, LinkRenderProps } from './types';

/** @public */
export const Link = memo(
  forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const {
      children,
      variant = 'body',
      weight = 'regular',
      style,
      className,
      render,
      to,
      ...restProps
    } = props;

    const responsiveVariant = useResponsiveValue(variant);
    const responsiveWeight = useResponsiveValue(weight);

    const linkProps: LinkRenderProps = {
      className: clsx(
        'canon-Link',
        responsiveVariant && `canon-Link--variant-${responsiveVariant}`,
        responsiveWeight && `canon-Link--weight-${responsiveWeight}`,
        className,
      ),
      style,
      children,
      to,
      ...restProps,
    };

    if (render) {
      // If render is a component type, wrap it in memo to prevent unnecessary re-renders
      if (typeof render === 'function' && !render.length) {
        const MemoizedComponent = memo(
          render as ComponentType<LinkRenderProps>,
        );
        return <MemoizedComponent {...linkProps} />;
      }
      // If it's a render function, call it directly
      const RenderComponent = render as (
        props: LinkRenderProps,
      ) => React.ReactNode;
      return <RenderComponent {...linkProps} />;
    }

    return <a ref={ref} href={to} {...linkProps} />;
  }),
);

Link.displayName = 'Link';
