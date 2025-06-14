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

import { useRef, forwardRef } from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { LinkProps } from './types';

/** @public */
export const Link = forwardRef<HTMLElement, LinkProps>((props, ref) => {
  const {
    className,
    variant = 'body',
    weight = 'regular',
    render = <a />,
    ...restProps
  } = props;

  const responsiveVariant = useResponsiveValue(variant);
  const responsiveWeight = useResponsiveValue(weight);
  const internalRef = useRef<HTMLElement | null>(null);

  const { renderElement } = useRender({
    render,
    props: {
      className: clsx('canon-Link', className),
      ['data-variant']: responsiveVariant,
      ['data-weight']: responsiveWeight,
      ...restProps,
    },
    refs: [ref, internalRef],
  });

  return renderElement();
});

Link.displayName = 'Link';
