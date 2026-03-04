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
import { Button as RAButton, Link as RALink } from 'react-aria-components';
import { useDefinition } from '../../hooks/useDefinition';
import {
  CardDefinition,
  CardHeaderDefinition,
  CardBodyDefinition,
  CardFooterDefinition,
} from './definition';
import type {
  CardOwnProps,
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types';
import { Box } from '../Box/Box';

/**
 * Card component.
 *
 * @public
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    CardDefinition,
    props as CardOwnProps &
      Omit<React.HTMLAttributes<HTMLDivElement>, 'onPress'>,
  );
  const { classes, children, onPress, href, label } = ownProps;
  const isInteractive = !!(onPress || href);

  return (
    <Box
      bg="neutral"
      ref={ref}
      className={classes.root}
      data-interactive={isInteractive || undefined}
      {...dataAttributes}
      {...restProps}
    >
      {href && (
        <RALink className={classes.overlay} href={href} aria-label={label} />
      )}
      {onPress && !href && (
        <RAButton
          className={classes.overlay}
          onPress={onPress}
          aria-label={label}
        />
      )}
      {children}
    </Box>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader component.
 *
 * @public
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardHeaderDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

/**
 * CardBody component.
 *
 * @public
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardBodyDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';

/**
 * CardFooter component.
 *
 * @public
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(CardFooterDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
