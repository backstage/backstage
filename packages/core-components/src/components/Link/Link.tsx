/*
 * Copyright 2020 The Backstage Authors
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

import { useAnalytics } from '@backstage/core-plugin-api';
import MaterialLink, {
  LinkProps as MaterialLinkProps,
} from '@material-ui/core/Link';
import React, { ElementType } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

export const isExternalUri = (uri: string) => /^([a-z+.-]+):/.test(uri);

export type LinkProps = MaterialLinkProps &
  RouterLinkProps & {
    component?: ElementType<any>;
    noTrack?: boolean;
  };

/**
 * Given a react node, try to retrieve its text content.
 */
const getNodeText = (node: React.ReactNode): string => {
  // If the node is an array of children, recurse and join.
  if (node instanceof Array) {
    return node.map(getNodeText).join(' ').trim();
  }

  // If the node is a react element, recurse on its children.
  if (typeof node === 'object' && node) {
    return getNodeText((node as React.ReactElement)?.props?.children);
  }

  // Base case: the node is just text. Return it.
  if (['string', 'number'].includes(typeof node)) {
    return String(node);
  }

  // Base case: just return an empty string.
  return '';
};

/**
 * Thin wrapper on top of material-ui's Link component, which...
 * - Makes the Link use react-router
 * - Captures Link clicks as analytics events.
 */
export const Link = React.forwardRef<any, LinkProps>(
  ({ onClick, noTrack, ...props }, ref) => {
    const analytics = useAnalytics();
    const to = String(props.to);
    const linkText = getNodeText(props.children) || to;
    const external = isExternalUri(to);
    const newWindow = external && !!/^https?:/.exec(to);

    const handleClick = (event: React.MouseEvent<any, MouseEvent>) => {
      onClick?.(event);
      if (!noTrack) {
        analytics.captureEvent('click', linkText, { attributes: { to } });
      }
    };

    return external ? (
      // External links
      <MaterialLink
        ref={ref}
        href={to}
        onClick={handleClick}
        {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
        {...props}
      />
    ) : (
      // Interact with React Router for internal links
      <MaterialLink
        ref={ref}
        component={RouterLink}
        onClick={handleClick}
        {...props}
      />
    );
  },
) as (props: LinkProps) => JSX.Element;
