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
import type { LinkProps } from './types';
import { useNavigate, useHref } from 'react-router-dom';

// Helper function to determine if a link is external
function isExternalLink(href?: string): boolean {
  if (!href) return false;

  // Check if it's an absolute URL with protocol
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return true;
  }

  // Check if it's a protocol-relative URL
  if (href.startsWith('//')) {
    return true;
  }

  // Check if it's a mailto: or tel: link
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true;
  }

  return false;
}

/** @public */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const navigate = useNavigate();
  const {
    className,
    variant = 'body',
    weight = 'regular',
    color = 'primary',
    href,
    ...restProps
  } = props;

  const { classNames, dataAttributes } = useStyles('Link', {
    variant,
    weight,
    color,
  });

  const isExternal = isExternalLink(href);

  // If it's an external link, render AriaLink without RouterProvider
  if (isExternal) {
    return (
      <AriaLink
        ref={ref}
        className={clsx(classNames.root, className)}
        href={href}
        {...dataAttributes}
        {...restProps}
      />
    );
  }

  // For internal links, use RouterProvider
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <AriaLink
        ref={ref}
        className={clsx(classNames.root, className)}
        href={href}
        {...dataAttributes}
        {...restProps}
      />
    </RouterProvider>
  );
});

Link.displayName = 'Link';
