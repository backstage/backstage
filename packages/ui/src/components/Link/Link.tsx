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
import { mergeProps, useFocusRing, useLink, useObjectRef } from 'react-aria';
import type { LinkProps } from './types';
import {
  useDefinition,
  type UseDefinitionResult,
} from '../../hooks/useDefinition';
import { LinkDefinition } from './definition';
import { getNodeText } from '../../analytics/getNodeText';
import { BUIRoutingProvider } from '../../navigation/BUIRoutingProvider';

type LinkViewProps = {
  definitionResult: UseDefinitionResult<typeof LinkDefinition, LinkProps>;
  forwardedRef: React.ForwardedRef<HTMLAnchorElement>;
};

function LinkView({ definitionResult, forwardedRef }: LinkViewProps) {
  const { ownProps, restProps, dataAttributes, analytics } = definitionResult;
  const { classes, title, children } = ownProps;

  const linkRef = useObjectRef(forwardedRef);

  // React Aria Components' Link filters out the native title attribute.
  // Render the anchor explicitly so truncated links retain their browser tooltip.
  // RouterConfig belongs to applications. The host provider accepts BUI's
  // router-neutral options, so only the React Aria boundary needs this cast.
  const { linkProps } = useLink(
    restProps as Parameters<typeof useLink>[0],
    linkRef,
  );
  const { isFocusVisible, focusProps } = useFocusRing();

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

  const interactionProps = mergeProps(
    linkProps,
    focusProps,
  ) as React.AnchorHTMLAttributes<HTMLAnchorElement>;
  const {
    href: _restHref,
    routerOptions: _routerOptions,
    ...anchorProps
  } = restProps;
  const commonProps = {
    ...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>),
    ...interactionProps,
    href: interactionProps.href ?? (restProps.href === '' ? '' : undefined),
    ...dataAttributes,
    ref: linkRef,
    title,
    className: classes.root,
    'data-focus-visible': isFocusVisible || undefined,
    onClick: handleClick,
    children,
  };

  return <a {...commonProps} />;
}

/**
 * A styled anchor element that supports analytics event tracking on click.
 *
 * @public
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const definitionResult = useDefinition(LinkDefinition, props);

  return (
    <BUIRoutingProvider>
      <LinkView definitionResult={definitionResult} forwardedRef={ref} />
    </BUIRoutingProvider>
  );
});

Link.displayName = 'Link';
