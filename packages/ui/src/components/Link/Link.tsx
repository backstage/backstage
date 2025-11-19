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

import { forwardRef } from 'react';
import { Link as AriaLink, RouterProvider } from 'react-aria-components';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { LinkDefinition } from './definition';
import type { LinkProps } from './types';
import { useNavigate, useHref } from 'react-router-dom';
import { isExternalLink } from '../../utils/isExternalLink';
import styles from './Link.module.css';

/** @public */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const navigate = useNavigate();
  const { classNames, dataAttributes, cleanedProps } = useStyles(
    LinkDefinition,
    {
      variant: 'body',
      weight: 'regular',
      color: 'primary',
      ...props,
    },
  );

  const { className, href, ...restProps } = cleanedProps;

  const isExternal = isExternalLink(href);

  const component = (
    <AriaLink
      ref={ref}
      className={clsx(classNames.root, styles[classNames.root], className)}
      href={href}
      {...dataAttributes}
      {...restProps}
    />
  );

  // If it's an external link, render AriaLink without RouterProvider
  if (isExternal) {
    return component;
  }

  // For internal links, use RouterProvider
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {component}
    </RouterProvider>
  );
});

Link.displayName = 'Link';
