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
import { RiExternalLinkLine } from '@remixicon/react';
import type { LinkProps } from './types';
import {
  useDefinition,
  type UseDefinitionResult,
} from '../../hooks/useDefinition';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { LinkDefinition } from './definition';
import { getNodeText } from '../../analytics/getNodeText';
import {
  handleRouterLinkClick,
  type AnchorNavigation,
} from '../../navigation/useNavigation';

type LinkViewProps = {
  definitionResult: UseDefinitionResult<typeof LinkDefinition, LinkProps>;
  navigation: AnchorNavigation;
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>;
};

function LinkView({
  definitionResult,
  navigation,
  forwardedRef,
}: LinkViewProps) {
  const { ownProps, restProps, dataAttributes, analytics } = definitionResult;
  const { classes, title, children, external } = ownProps;

  const internalRef = useRef<HTMLAnchorElement>(null);
  const linkRef = (forwardedRef ||
    internalRef) as React.RefObject<HTMLAnchorElement>;

  let resolvedLinkProps = restProps;
  if (navigation.type === 'router') {
    resolvedLinkProps = {
      ...restProps,
      href: navigation.ariaHref,
      routerOptions: navigation.routerOptions,
    };
  } else if (navigation.type === 'native') {
    resolvedLinkProps = {
      ...restProps,
      href: navigation.ariaHref,
    };
  }
  // React Aria Components' Link filters out the native title attribute.
  // Render the anchor explicitly so truncated links retain their browser tooltip.
  const { linkProps } = useLink(resolvedLinkProps, linkRef);
  const { isFocusVisible, focusProps } = useFocusRing();
  const fallbackHref = useResolvedHref(restProps.href);
  const resolvedHref =
    navigation.type === 'native' ? navigation.browserHref : fallbackHref;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    linkProps.onClick?.(e);
    const text =
      restProps['aria-label'] ??
      getNodeText(children) ??
      String(restProps.href ?? '');
    analytics.captureEvent('click', text, {
      attributes: { to: String(restProps.href ?? '') },
    });
    handleRouterLinkClick(e, navigation);
  };

  const { href: _href, ...interactionProps } = mergeProps(
    linkProps,
    focusProps,
  ) as React.AnchorHTMLAttributes<HTMLAnchorElement>;
  const {
    href: _restHref,
    routerOptions: _routerOptions,
    ...anchorProps
  } = restProps;
  const commonProps = {
    ...interactionProps,
    ...dataAttributes,
    ...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>),
    ref: linkRef,
    title,
    className: classes.root,
    'data-focus-visible': isFocusVisible || undefined,
    onClick: handleClick,
    children: external ? (
      <>
        {children}
        <RiExternalLinkLine className={classes.icon} aria-hidden="true" />
      </>
    ) : (
      children
    ),
  };

  if (navigation.type === 'router') {
    return (
      <navigation.Link
        {...commonProps}
        {...navigation.routerLinkOptions}
        to={navigation.to}
      />
    );
  }

  return <a {...commonProps} href={resolvedHref} />;
}

/**
 * Builds the `rel` attribute for a link that opens in a new tab, keeping any
 * tokens provided by the caller while always including `noopener noreferrer`.
 */
function withNoOpenerRel(rel?: string): string {
  return [
    ...new Set([
      'noopener',
      'noreferrer',
      ...(rel?.split(/\s+/).filter(Boolean) ?? []),
    ]),
  ].join(' ');
}

/**
 * A styled anchor element that supports analytics event tracking on click.
 *
 * @remarks
 * Use the `external` prop for links that lead outside of the application.
 * Such links show an external link icon and always open in a new tab.
 *
 * @example
 * ```tsx
 * <Link href="https://backstage.io" external>
 *   Backstage website
 * </Link>
 * ```
 *
 * @public
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const definitionResult = useDefinition(
    LinkDefinition,
    // External links always open in a new tab, so the browser owns the
    // navigation and the anchor carries the matching `target` and `rel`.
    props.external
      ? { ...props, target: '_blank', rel: withNoOpenerRel(props.rel) }
      : props,
  );
  const Navigation = definitionResult.navigation;

  return (
    <Navigation
      props={definitionResult.restProps}
      view={LinkView}
      viewProps={{ definitionResult, forwardedRef: ref }}
    />
  );
});

Link.displayName = 'Link';
