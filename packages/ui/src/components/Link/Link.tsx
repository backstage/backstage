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
import { useLink } from 'react-aria';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { LinkDefinition } from './definition';
import type { LinkProps } from './types';
import { InternalLinkProvider } from '../InternalLinkProvider';
import styles from './Link.module.css';

const LinkInternal = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { classNames, dataAttributes, cleanedProps } = useStyles(
    LinkDefinition,
    {
      variant: 'body',
      weight: 'regular',
      color: 'primary',
      ...props,
    },
  );

  const {
    className,
    href,
    title,
    children,
    onPress,
    variant,
    weight,
    color,
    truncate,
    slot,
    ...restProps
  } = cleanedProps;

  const internalRef = useRef<HTMLAnchorElement>(null);
  const linkRef = (ref || internalRef) as React.RefObject<HTMLAnchorElement>;

  // Use useLink hook to get link props
  // For internal links, this will use the RouterProvider's navigate function
  const { linkProps } = useLink(
    {
      href,
      onPress,
      ...restProps,
    },
    linkRef,
  );

  return (
    <a
      {...linkProps}
      {...dataAttributes}
      {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      ref={linkRef}
      href={href}
      title={title}
      className={clsx(classNames.root, styles[classNames.root], className)}
    >
      {children}
    </a>
  );
});

LinkInternal.displayName = 'LinkInternal';

/** @public */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return (
    <InternalLinkProvider href={props.href}>
      <LinkInternal {...props} ref={ref} />
    </InternalLinkProvider>
  );
});

Link.displayName = 'Link';
