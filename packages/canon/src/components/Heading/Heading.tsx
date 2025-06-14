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

import { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import { useRender } from '@base-ui-components/react/use-render';
import type { HeadingProps } from './types';

/** @public */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => {
    const {
      variant = 'title1',
      color = 'primary',
      truncate,
      className,
      render = <h1 />,
      ...restProps
    } = props;

    const responsiveVariant = useResponsiveValue(variant);
    const responsiveColor = useResponsiveValue(color);
    const internalRef = useRef<HTMLElement | null>(null);

    const { renderElement } = useRender({
      render,
      props: {
        className: clsx('canon-Heading', className),
        ['data-variant']: responsiveVariant,
        ['data-color']: responsiveColor,
        ['data-truncate']: truncate,
        ...restProps,
      },
      refs: [ref, internalRef],
    });

    return renderElement();
  },
);

Heading.displayName = 'Heading';
