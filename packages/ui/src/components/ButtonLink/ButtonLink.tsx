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

import { forwardRef, Ref } from 'react';
import { Link as RALink } from 'react-aria-components';
import type { ButtonLinkProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ButtonLinkDefinition } from './definition';
import { InternalLinkProvider } from '../InternalLinkProvider';

/** @public */
export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ButtonLinkDefinition,
      props,
    );
    const { classes, iconStart, iconEnd, children } = ownProps;

    return (
      <InternalLinkProvider href={restProps.href}>
        <RALink
          className={classes.root}
          ref={ref}
          {...dataAttributes}
          {...restProps}
        >
          <span className={classes.content}>
            {iconStart}
            {children}
            {iconEnd}
          </span>
        </RALink>
      </InternalLinkProvider>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
