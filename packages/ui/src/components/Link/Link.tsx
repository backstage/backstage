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
import { mergeProps, useFocusRing, useLink } from 'react-aria';
import type { LinkProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { useHasBUIRouter, useResolvedHref } from '../../hooks/useResolvedHref';
import { LinkDefinition } from './definition';
import { getNodeText } from '../../analytics/getNodeText';

const LinkInternal = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes, analytics } = useDefinition(
    LinkDefinition,
    props,
  );
  const { classes, title, children } = ownProps;

  const internalRef = useRef<HTMLAnchorElement>(null);
  const linkRef = (ref || internalRef) as React.RefObject<HTMLAnchorElement>;

  const { linkProps } = useLink(restProps, linkRef);
  const { isFocusVisible, focusProps } = useFocusRing();
  // Link renders its own anchor rather than letting react-aria render one, so
  // it has to pick the href itself — and there are two answers to pick from.
  // react-aria has already resolved the target through whichever resolver
  // `BUIProvider` gave its router context, which is where an injected resolver
  // runs; `useResolvedHref` resolves it through react-router. Only one of them
  // is the authority, and taking the other would render an href here that
  // disagrees with the one the same target gets on every other BUI surface.
  // `useLink` types its result as plain DOM attributes, but the resolved href
  // is in there all the same.
  const ariaHref = (linkProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)
    .href;
  const hasBUIRouter = useHasBUIRouter();
  const routerHref = useResolvedHref(restProps.href);
  const resolvedHref = hasBUIRouter ? ariaHref : routerHref;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    linkProps.onClick?.(e);
    const text =
      restProps['aria-label'] ??
      getNodeText(children) ??
      String(restProps.href ?? '');
    analytics.captureEvent('click', text, {
      attributes: { to: String(restProps.href ?? '') },
    });
  };

  return (
    <a
      {...mergeProps(linkProps, focusProps)}
      {...dataAttributes}
      {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      href={resolvedHref}
      ref={linkRef}
      title={title}
      className={classes.root}
      data-focus-visible={isFocusVisible || undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
});

LinkInternal.displayName = 'LinkInternal';

/**
 * A styled anchor element that supports analytics event tracking on click.
 *
 * @public
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <LinkInternal {...props} ref={ref} />;
});

Link.displayName = 'Link';
