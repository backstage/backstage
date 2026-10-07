/*
 * Copyright 2026 The Backstage Authors
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

import { AnchorHTMLAttributes, forwardRef } from 'react';
import { isExternalTarget } from '@internal/frontend';
import { useAppHref } from './useAppHref';
import { useOptionalAppNavigate } from './useAppNavigate';
import type { AppNavigateOptions } from './AppLocation';

/**
 * Props for {@link RouterLink}.
 *
 * @public
 */
export interface RouterLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    AppNavigateOptions {
  /** Target resolved against the calling extension's route ancestry. */
  href: string;
}

/**
 * An unstyled anchor for composing routing into UI components.
 *
 * Use the Backstage UI Link for standard UI links. This primitive forwards
 * anchor props and refs, and can be supplied through React Aria's render prop.
 * It resolves relative targets in its own extension scope and handles internal
 * navigation through app history. Without app history, it uses browser navigation.
 * External URLs, modified clicks, downloads, and other targets retain native
 * browser behavior.
 *
 * @public
 */
export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function RouterLink(props, ref) {
    const { href: to, replace, state, onClick, children, ...rest } = props;
    const href = useAppHref(to);
    const navigate = useOptionalAppNavigate();

    return (
      <a
        {...rest}
        ref={ref}
        href={href}
        onClick={event => {
          onClick?.(event);
          if (
            event.defaultPrevented ||
            !navigate ||
            isExternalTarget(to) ||
            event.button !== 0 ||
            event.metaKey ||
            event.altKey ||
            event.ctrlKey ||
            event.shiftKey ||
            (event.currentTarget.target &&
              event.currentTarget.target.toLowerCase() !== '_self') ||
            event.currentTarget.hasAttribute('download')
          ) {
            return;
          }
          event.preventDefault();
          navigate(
            to,
            replace !== undefined || state !== undefined
              ? { replace, state }
              : undefined,
          );
        }}
      >
        {children}
      </a>
    );
  },
);
