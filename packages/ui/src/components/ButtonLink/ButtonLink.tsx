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
import { getNodeText } from '../../analytics/getNodeText';

/**
 * A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.
 *
 * @public
 */
export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => {
    const { ownProps, restProps, dataAttributes, analytics } = useDefinition(
      ButtonLinkDefinition,
      props,
    );
    const { classes, iconStart, iconEnd, children } = ownProps;

    const handlePress: typeof restProps.onPress = e => {
      restProps.onPress?.(e);
      const text =
        restProps['aria-label'] ??
        getNodeText(children) ??
        String(restProps.href ?? '');
      analytics.captureEvent('click', text, {
        attributes: { to: String(restProps.href ?? '') },
      });
    };

    return (
      <RALink
        className={classes.root}
        ref={ref}
        {...dataAttributes}
        {...restProps}
        onPress={handlePress}
      >
        <span className={classes.content}>
          {iconStart}
          {children}
          {iconEnd}
        </span>
      </RALink>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
