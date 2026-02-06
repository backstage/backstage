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
import { useDefinition } from '../../hooks/useDefinition';
import {
  CardDefinition,
  CardHeaderDefinition,
  CardBodyDefinition,
  CardFooterDefinition,
} from './definition';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './types';

/**
 * Card component.
 *
 * @public
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    CardDefinition,
    props,
  );
  const { classes, surfaceChildren } = ownProps;

  return (
    <div ref={ref} className={classes.root} {...dataAttributes} {...restProps}>
      {surfaceChildren}
    </div>
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
