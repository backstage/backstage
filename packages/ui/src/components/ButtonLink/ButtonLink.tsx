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
import { Link as RALink, RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';
import type { ButtonLinkProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { isExternalLink } from '../../utils/isExternalLink';
import stylesButton from '../Button/Button.module.css';

/** @public */
export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => {
    const navigate = useNavigate();

    const { classNames, dataAttributes, cleanedProps } = useStyles('Button', {
      size: 'small',
      variant: 'primary',
      ...props,
    });

    const { classNames: classNamesButtonLink } = useStyles('ButtonLink');

    const { children, className, iconStart, iconEnd, href, ...rest } =
      cleanedProps;

    const isExternal = isExternalLink(href);

    // If it's an external link, render RALink without RouterProvider
    if (isExternal) {
      return (
        <RALink
          className={clsx(
            classNames.root,
            classNamesButtonLink.root,
            stylesButton[classNames.root],
            className,
          )}
          ref={ref}
          {...dataAttributes}
          href={href}
          {...rest}
        >
          {iconStart}
          {children}
          {iconEnd}
        </RALink>
      );
    }

    // For internal links, use RouterProvider
    return (
      <RouterProvider navigate={navigate} useHref={useHref}>
        <RALink
          className={clsx(
            classNames.root,
            classNamesButtonLink.root,
            stylesButton[classNames.root],
            className,
          )}
          ref={ref}
          {...dataAttributes}
          href={href}
          {...rest}
        >
          {iconStart}
          {children}
          {iconEnd}
        </RALink>
      </RouterProvider>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
