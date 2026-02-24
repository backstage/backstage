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
import type { LinkProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { LinkDefinition } from './definition';
import { InternalLinkProvider } from '../InternalLinkProvider';

const LinkInternal = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    LinkDefinition,
    props,
  );
  const { classes, title, children } = ownProps;

  const internalRef = useRef<HTMLAnchorElement>(null);
  const linkRef = (ref || internalRef) as React.RefObject<HTMLAnchorElement>;

  const { linkProps } = useLink(restProps, linkRef);

  return (
    <a
      {...linkProps}
      {...dataAttributes}
      {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      ref={linkRef}
      title={title}
      className={classes.root}
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
